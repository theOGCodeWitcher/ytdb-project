import { useEffect, useState } from "react";
import { RatingComp } from "./Rating";
import clipDescription, { extractCategories, formatCount } from "../lib/util";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { BiSolidVideoPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import placeholder from "../assets/placeholder.jpg";
import bannerplaceholder from "../assets/bannerplaceholder.jpg";

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
    ChannelId?: string;
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
    <>
      <Link to={`/channel/${data.ChannelId}`}>
        <div className="card h-[32rem] w-[16rem] md:w-[18rem] md:h-[32rem] dark:bg-gray-800 shadow-2xl overflow-hidden cursor-pointer md:hover:scale-[1.04]   transition">
          <div className="relative  transition">
            {data.BannerImage ? (
              <div
                className="h-[12rem] bg-center bg-no-repeat brightness-50 "
                style={{
                  backgroundImage: `url(${
                    data.BannerImage || bannerplaceholder
                  })`,
                }}
              ></div>
            ) : (
              <div
                className="h-[12rem] bg-center bg-no-repeat brightness-50 "
                style={{
                  backgroundImage: `url(${bannerplaceholder})`,
                }}
              ></div>
            )}
            <div className="absolute inset-0 flex items-center justify-center ">
              {data.Thumbnails ? (
                <figure className="h-[6rem] w-[6rem] rounded-full">
                  <img
                    src={data.Thumbnails[1] || placeholder}
                    alt={data.imgAlt || "Image"}
                    loading="lazy"
                  />
                </figure>
              ) : (
                <figure className="h-[6rem] w-[6rem] rounded-full">
                  <img
                    src={placeholder}
                    alt={data.imgAlt || "Image"}
                    loading="lazy"
                  />
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
            {
              <p className=" text-xs h-[6rem]">
                {(data.Description && clipDescription(data.Description)) ||
                  "No description Available for this channel on Youtube"}
              </p>
            }
            <div className="flex gap-1 flex-wrap">
              {categories &&
                categories.map((item, index) => (
                  <div
                    key={index}
                    className="badge p-2 text-xs capitalize border-gray-200"
                  >
                    {item}
                  </div>
                ))}
            </div>
            <div className="flex justify-between gap-1 m-2 px-2">
              {data.Subs && (
                <div className="flex align-center  flex-col gap-1">
                  <MdOutlinePeopleOutline size={20} />
                  <span className="text-xs">Subscribers</span>
                  <span className="text-xs">{formatCount(data.Subs)}</span>
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
      </Link>
    </>
  );
}
