import { useEffect, useState } from "react";
import { RatingComp } from "./Rating";
import clipDescription, { extractCategories } from "../lib/util";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { BiSolidVideoPlus } from "react-icons/bi";

type CardProps = {
  data: {
    Thumbnails?: string[];
    imgAlt?: string;
    Title?: string;
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
    <div className="card h-[32rem] w-[16rem] md:w-[18rem] md:h-[32rem] bg-base-100 shadow-lg overflow-hidden cursor-pointer  hover:shadow-xl transition">
      <div className="relative hover:scale-[1.06] transition">
        <div
          className="h-[12rem] bg-center bg-no-repeat brightness-50 "
          style={{
            backgroundImage: data.BannerImage
              ? `url(${data.BannerImage})`
              : "none",
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center ">
          {data.Thumbnails && (
            <figure className="h-[6rem] w-[6rem] rounded-full">
              <img src={data.Thumbnails[1]} alt={data.imgAlt || "Image"} />
            </figure>
          )}
        </div>
      </div>

      <div className="card-body p-[0.8rem]  ">
        {data.Title && <h2 className="card-title text-sm">{data.Title}</h2>}
        {data.Rating && (
          <div className="flex ">
            <RatingComp Rating={Number(data.Rating)} />
            <span className="text-xs mx-2 pt-1">{Number(data.Rating)}</span>
          </div>
        )}
        {data.Description && (
          <p className="text-gray-500 text-xs">
            {clipDescription(data.Description)}
          </p>
        )}
        <div className="flex gap-1 flex-wrap">
          {categories &&
            categories.map((item, index) => (
              <div key={index} className="badge p-2 text-xs capitalize">
                {item}
              </div>
            ))}
        </div>
        <div className="flex justify-between gap-1 m-2 px-2">
          {data.Subs && (
            <div className="flex align-center  flex-col gap-1">
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
