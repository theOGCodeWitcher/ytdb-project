import { AiTwotoneHeart } from "react-icons/ai";

export default function Footer() {
  return (
    <footer className="mb-10 px-4 items-center text-gray-500 py-4 my-4 flex flex-col border-t border-black-100 ">
      <small className=" pt-4 text-xs ">Made with </small>
      <span className="px-4 py-2">
        {<AiTwotoneHeart size={24} color="red" />}
      </span>
      <small>in India</small>
      <small className="mb-2 block text-xs">
        &copy; 2030 YTDB. All rights reserved.
      </small>
      <p className="text-xs">
        <span className="font-semibold">About this website:</span> built with
        React , TypeScript, Tailwind CSS, MongoDb, Express, NodeJs, Framer
        Motion, React Email & Resend, Vercel hosting.
      </p>
    </footer>
  );
}
