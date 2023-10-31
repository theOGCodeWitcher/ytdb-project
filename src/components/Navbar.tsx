import avatar from "../assets/profile.jpg";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <>
      <div className="navbar bg-base-100  shadow-md px-3">
        <div className="flex-1">
          <div className="flex justify-between w-4/5 md:w-2/3">
            <Link to="/">
              <a className="btn btn-ghost normal-case text-xl">YTDB</a>
            </Link>
            <div className="form-control pt-2">
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered  md:w-[22rem] w-[10rem] h-9"
              />
            </div>
          </div>
        </div>
        <div className="flex-none gap-2">
          <button className="btn btn-sm btn-outline btn-primary">Login</button>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={avatar} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
