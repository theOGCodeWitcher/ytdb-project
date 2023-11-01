import { useEffect, useState, useRef } from "react";
import avatar from "../assets/profile.jpg";
import { Link } from "react-router-dom";
import { search } from "../api/homePageApi";
import { ChannelItem } from "../types/type";
import placeholder from "../assets/placeholder.jpg";
import { useAuth0 } from "@auth0/auth0-react";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ChannelItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  console.log(isAuthenticated);
  console.log(JSON.stringify(user));

  const performSearch = async () => {
    try {
      setIsDropdownOpen(true);
      const results = await search(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 1500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  return (
    <>
      <div className="navbar  shadow-md px-3 relative">
        <div className="flex-1">
          <div className="flex justify-between w-4/5 md:w-2/3">
            <Link to="/">
              <p className="btn btn-ghost normal-case text-xl">YTDB</p>
            </Link>
            <div className="form-control pt-2 relative">
              <input
                type="text"
                placeholder="Search Channel"
                className="input input-bordered md:w-[22rem] w-[12rem] h-9 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={() => setIsDropdownOpen(true)}
                onKeyDown={(e) => handleKeyDown(e)}
              />
              {isDropdownOpen && searchResults.length > 0 && (
                <ul
                  ref={dropdownRef}
                  className="search-dropdown bg-white border border-gray-300 rounded-md shadow-md mt-9 absolute left-0 w-[12rem] md:w-[22rem]   z-[99]"
                >
                  {searchResults.map((result) => (
                    <li
                      key={result._id}
                      className="px-2 py-2 hover:bg-gray-100 transition duration-150 ease-in-out"
                    >
                      <Link
                        to={`/channel/${result.ChannelId}`}
                        className=""
                        onClick={() => setIsDropdownOpen(false)}
                        key={result._id + "ddwd"}
                      >
                        <div className="flex gap-4">
                          <div className="flex items-center justify-center  ">
                            {result?.Thumbnails && (
                              <figure className="h-[2rem] w-[2rem] ">
                                <img
                                  src={result?.Thumbnails[1] || placeholder}
                                  alt={""}
                                  loading="lazy"
                                  className=""
                                  key={result._id + "fnjd"}
                                />
                              </figure>
                            )}
                          </div>
                          <span className="flex items-center">
                            {result.Title}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="flex-none gap-2">
          {!isAuthenticated && (
            <button
              className="btn btn-sm btn-outline btn-primary"
              onClick={() => loginWithRedirect()}
            >
              Login
            </button>
          )}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={avatar} alt="User Avatar" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li key={1}>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li key={2}>
                <a>Settings</a>
              </li>
              {
                <li key={3}>
                  <a onClick={() => logout()}>Logout</a>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
