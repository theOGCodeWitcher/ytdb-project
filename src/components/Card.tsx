import { useEffect, useState } from "react";
import { RatingComp } from "./Rating";
import clipDescription, { extractCategories } from "../lib/util";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { BiSolidVideoPlus } from "react-icons/bi";

type CardProps = {
  data: {
    Thumbnails?: string[];
    imgAlt?: string;
    title?: string;
    Description?: string;
    Rating?: string;
    TopicCategories?: string[];
    BannerImage?: string;
    Subs?: number;
    uploads?: number;
    Category?: string;
  };
};

export default function Card({ data }: CardProps) {
  const [categories, setcategories] = useState<string[] | undefined>([]);
  useEffect(() => {
    if (data.TopicCategories) {
      const categories = extractCategories(data.TopicCategories);
      setcategories(categories);
    }
    if (data.Category) {
      setcategories((prevVal) => {
        if (prevVal && data.Category) {
          return [...prevVal, data.Category];
        }
        return prevVal || [];
      });
    }
    if (data.Description) {
      clipDescription(data.Description);
    }
  }, []);

  return (
    <div className="card w-[18rem] bg-base-100 shadow-xl overflow-hidden cursor-pointer ">
      <div
        className="h-[12rem] relative bg-center bg-no-repeat brightness-50 hover:scale-[1.06] transition"
        style={{
          backgroundImage: data.BannerImage
            ? `url(${data.BannerImage})`
            : "none",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center    ">
          {data.Thumbnails && (
            <figure className="h-[6rem] w-[6rem] rounded-full brightness-200">
              <img src={data.Thumbnails[1]} alt={data.imgAlt || "Image"} />
            </figure>
          )}
        </div>
      </div>
      <div className="card-body p-[0.8rem]  ">
        {data.title && <h2 className="card-title text-base">{data.title}</h2>}
        {data.Rating && <RatingComp Rating={Number(data.Rating)} />}
        {data.Description && (
          <p className="text-gray-500 text-xs">
            {clipDescription(data.Description)}
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
          {data.Subs && (
            <div className="flex align-center flex-col gap-1">
              <MdOutlinePeopleOutline size={20} />
              <span className="text-xs">Subscribers</span>
              <span className="text-xs">{data.Subs}</span>
            </div>
          )}
          {data.uploads && (
            <div className="flex items-center flex-col gap-1 ">
              <BiSolidVideoPlus size={20} />
              <span className="text-xs">Uploads</span>
              <span className="text-xs">{data.uploads}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
