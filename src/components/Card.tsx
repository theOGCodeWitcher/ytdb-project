import { useEffect, useState } from "react";
import { RatingComp } from "./Rating";
import clipDescription from "../lib/util";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { BiSolidVideoPlus } from "react-icons/bi";

type CardProps = {
  imgSrc?: string;
  imgAlt?: string;
  title?: string;
  description?: string;
  Rating?: number;
  TopicCategories?: string[];
  bannerImage?: string;
  Subs?: number;
  uploads?: number;
};

export default function Card({
  imgSrc,
  imgAlt,
  title,
  description,
  Rating,
  TopicCategories,
  bannerImage,
  Subs,
  uploads,
}: CardProps) {
  function extractCategories(urls: string[]) {
    return urls.map((url: string) => {
      const parts = url.split("/");
      return parts[parts.length - 1];
    });
  }

  const [categories, setcategories] = useState<string[]>();
  useEffect(() => {
    if (TopicCategories) {
      const categories = extractCategories(TopicCategories);
      setcategories(categories);
    }
    if (description) {
      clipDescription(description);
    }
  }, []);

  return (
    <div className="card w-[18rem] bg-base-100 shadow-xl overflow-hidden cursor-pointer ">
      <div
        className="h-[12rem] relative bg-center bg-no-repeat brightness-50 hover:scale-[1.06] transition"
        style={{
          backgroundImage: bannerImage ? `url(${bannerImage})` : "none",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center    ">
          {imgSrc && (
            <figure className="h-[6rem] w-[6rem] rounded-full brightness-200">
              <img src={imgSrc} alt={imgAlt || "Image"} />
            </figure>
          )}
        </div>
      </div>
      <div className="card-body p-[0.8rem]  ">
        {title && <h2 className="card-title text-base">{title}</h2>}
        {Rating && <RatingComp Rating={Rating} />}
        {description && (
          <p className="text-gray-500 text-xs">
            {clipDescription(description)}
          </p>
        )}
        <div className="flex gap-1 flex-wrap">
          {categories &&
            categories.map((item, index) => (
              <div key={index} className="badge p-2 text-xs">
                {item}
              </div>
            ))}
        </div>
        <div className="flex justify-between gap-1 m-2 px-2">
          {Subs && (
            <div className="flex align-center flex-col gap-1">
              <MdOutlinePeopleOutline size={20} />
              <span className="text-xs">Subscribers</span>
              <span className="text-xs">{Subs}</span>
            </div>
          )}
          {uploads && (
            <div className="flex items-center flex-col gap-1 ">
              <BiSolidVideoPlus size={20} />
              <span className="text-xs">Uploads</span>
              <span className="text-xs">{uploads}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
