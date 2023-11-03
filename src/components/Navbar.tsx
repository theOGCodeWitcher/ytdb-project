import { useEffect, useState, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { search } from "../api/homePageApi";
import { ChannelItem } from "../types/type";
import placeholder from "../assets/placeholder.jpg";
import { useAuth0 } from "@auth0/auth0-react";
import SearchResultsSkeleton from "./SearchResultsSkeleton";
import UserContext from "../context/userContext";
import { fetchUserWithId } from "../api/UserApi";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ChannelItem[] | string>(
    []
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { setuserData } = useContext(UserContext); //context api
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const location = useLocation();

  const dropdownRef = useRef<HTMLUListElement | null>(null);

  const performSearch = async () => {
    try {
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
      }, 300);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchUser = async () => {
        try {
          const obj = await fetchUserWithId(user);
          setuserData(obj);
        } catch (error) {
          console.error("Error fetching UserData:", error);
        }
      };
      fetchUser();
    }

    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSearchResults([]);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isAuthenticated]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  function handleChange(e: any) {
    setIsDropdownOpen(true);
    setSearchQuery(e.target.value);
  }

  useEffect(() => {
    if (searchQuery.length == 0) {
      setIsDropdownOpen(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

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
                className="input input-bordered md:w-[22rem] w-[12rem] h-9 text-xs focus:outline-none"
                value={searchQuery}
                onChange={(e) => {
                  handleChange(e);
                }}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
              />
              {isDropdownOpen && (
                <ul
                  ref={dropdownRef}
                  className="search-dropdown  z-[99] bg-white  dark:bg-gray-800  rounded-md shadow-lg mt-10 absolute left-0 w-[12rem] md:w-[22rem] h-fit   "
                >
                  {searchResults.length === 0 ? (
                    <div>
                      <SearchResultsSkeleton />
                    </div>
                  ) : (
                    Array.isArray(searchResults) &&
                    searchResults.map((result) => (
                      <li
                        key={result._id}
                        className="px-2 py-2 dark:hover:bg-gray-900 hover:bg-gray-200 transition duration-150 ease-in-out overflow-hidden"
                      >
                        <Link
                          to={`/channel/${result.ChannelId}`}
                          onClick={() => {
                            setSearchQuery("");
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="flex gap-4">
                            <div className="flex items-center justify-center">
                              {result?.Thumbnails && (
                                <figure className="h-[2rem] w-[2rem]">
                                  <img
                                    src={result?.Thumbnails[1] || placeholder}
                                    alt=""
                                    loading="lazy"
                                    className="rounded-full"
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
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="flex-none gap-2">
          {!isAuthenticated && (
            <button
              className="btn btn-sm btn-outline btn-primary"
              onClick={() =>
                loginWithRedirect({
                  appState: {
                    returnTo: location.pathname,
                  },
                })
              }
            >
              Login
            </button>
          )}
          {isAuthenticated && (
            <div className="dropdown dropdown-end z-[999] ">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={
                      user
                        ? user.picture && user.picture?.length > 0
                          ? user.picture
                          : placeholder
                        : ""
                    }
                    alt="User Avatar"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3  p-2  menu menu-sm dropdown-content bg-base-100 rounded-box w-52 shadow-xl"
              >
                <Link to="/profile">
                  <li key={1}>
                    <span className="justify-between">Profile</span>
                  </li>
                </Link>
                <Link to="/wishlist&favourites">
                  <li key={2}>
                    <span>Wishlist & Favourites</span>
                  </li>
                </Link>
                {
                  <li key={3}>
                    <a
                      onClick={() =>
                        logout({
                          logoutParams: {
                            returnTo: window.location.origin,
                          },
                        })
                      }
                    >
                      Logout
                    </a>
                  </li>
                }
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
