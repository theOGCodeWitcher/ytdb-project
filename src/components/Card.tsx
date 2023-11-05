import { useContext, useEffect, useState } from "react";
import { RatingComp } from "./Rating";
import clipDescription, { extractCategories, formatCount } from "../lib/util";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { BiSolidVideoPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import placeholder from "../assets/placeholder.jpg";
import bannerplaceholder from "../assets/bannerplaceholder.jpg";
import { useLocation } from "react-router-dom";
import UserContext from "../context/userContext";
import toast from "react-hot-toast";
import { deleteFromFav, deleteFromWishlist } from "../api/channelPageApi";
import { getUserID_db } from "../context/customHooks";

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
  onRemoveCard: (channelId: string) => void;
};

export default function Card({ data, onRemoveCard }: CardProps) {
  const [categories, setcategories] = useState<string[] | undefined>([]);
  const location = useLocation();
  const userId = getUserID_db();

  const { setChangeObserved } = useContext(UserContext);

  const [isButtonLoading, setisButtonLoading] = useState<boolean>(false);

  async function handleDeleteFav() {
    if (userId && data.ChannelId) {
      try {
        setisButtonLoading(true);
        const response = await deleteFromFav(data.ChannelId, userId);
        setChangeObserved(true);
        onRemoveCard(data.ChannelId);
        toast.success(response.message);
        setisButtonLoading(false);
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setisButtonLoading(false);
      }
    }
  }

  async function handleDeleteWishlist() {
    if (userId && data.ChannelId) {
      try {
        setisButtonLoading(true);
        const response = await deleteFromWishlist(data.ChannelId, userId);
        toast.success(response.message);
        onRemoveCard(data.ChannelId);
        setisButtonLoading(false);
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setisButtonLoading(false);
      }
    }
  }

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
      <div className="card relative h-[32rem] w-[16rem] md:w-[18rem] md:h-[32rem] dark:bg-gray-800 shadow-2xl overflow-hidden cursor-pointer md:hover:scale-[1.04]   transition">
        <Link to={`/channel/${data.ChannelId}`}>
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
            <div className="flex">
              {data.Title && (
                <h2 className="card-title text-sm">{data.Title}</h2>
              )}
            </div>
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
                    className="badge p-2 text-xs capitalize border-gray-200 mb-[0.1rem]"
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
        </Link>
        {location.pathname === "/wishlist" && (
          <button
            className=" absolute btn btn-error btn-outline top-2 right-2 mt-1 btn-sm w-[7rem] p-1 "
            onClick={() => {
              handleDeleteWishlist();
            }}
          >
            {isButtonLoading ? (
              <span className="loading loading-spinner text-primary"></span>
            ) : (
              <>
                <RxCross2 size={20} />
                Remove
              </>
            )}
          </button>
        )}
        {location.pathname === "/favorites" && (
          <button
            className=" absolute btn btn-error btn-outline top-2 right-2 mt-1 btn-sm w-[7rem] p-1 "
            onClick={() => {
              handleDeleteFav();
            }}
          >
            {isButtonLoading ? (
              <span className="loading loading-spinner text-primary"></span>
            ) : (
              <>
                <RxCross2 size={20} />
                Remove
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}
