import { AiTwotoneHeart } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mb-10 px-4 items-center text-gray-500 py-4 my-4 flex flex-col border-t border-black-100 ">
      <small className=" pt-4 text-xs ">Made with </small>
      <span className="px-4 py-2">
        {<AiTwotoneHeart size={24} color="red" />}
      </span>
      <small className="mb-1">in India</small>
      <small>Crafted By</small>
      <div className="flex gap-4 my-2">
        <Link to="https://www.linkedin.com/in/rahul-singhh/">
          <small className="dark:text-white text-gray-800 flex gap-2">
            {" "}
            <div className="pt-1">
              <FaLinkedin size={15}></FaLinkedin>
            </div>
            Rahul Singh
          </small>
        </Link>
        <Link to="https://www.linkedin.com/in/jatinnaroraa/">
          <small className="dark:text-white text-gray-800 flex gap-2">
            <div className="pt-1">
              <FaLinkedin size={15}></FaLinkedin>
            </div>{" "}
            Jatin Arora
          </small>
        </Link>
      </div>
      <small className="mb-2 block text-xs">
        &copy; 2023 YTDB. All rights reserved.
      </small>
      <p className="text-xs">
        <span className="font-semibold">About this website:</span> built with
        React , TypeScript, Tailwind CSS, Redux Toolkit, MongoDb, Express,
        NodeJs, Auth0, Vercel hosting.
      </p>
    </footer>
  );
}
