import { useEffect, useState } from "react";
import { fetchChannelById } from "../api/channelPageApi";
import { useParams } from "react-router-dom";
import { ChannelItem } from "../types/type";
import { RatingComp } from "../components/Rating";
import { extractCategories } from "../lib/util";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { BiSolidVideoPlus } from "react-icons/bi";
import { IoPeopleCircleSharp } from "react-icons/io5";
import Youtubelogo from "../assets/youtube.jpg";
import Loading from "../components/Loading";

export default function Channel() {
  const { channelId } = useParams<string>();
  const [channelData, setchannelData] = useState<ChannelItem>();
  const [categories, setcategories] = useState<string[] | undefined>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchchannelData() {
      console.log(channelId);

      if (channelId) {
        try {
          setIsLoading(true);
          const data = await fetchChannelById(channelId);
          setchannelData(data);
          setIsLoading(false);
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
        } catch (error) {
          console.error("Error fetching channel data:", error);
          setIsLoading(false);
        }
      }
    }

    fetchchannelData();
  }, [channelId]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col md:flex-row  md:px-8 md:mx-8  md:py-4 md:my-4 ">
          <div className="flex flex-col  px-2 my-2 overflow-hidden md:w-1/2">
            <img
              src={channelData?.BannerImage}
              loading="lazy"
              className="rounded-sm"
            ></img>
            <div className="flex flex-col gap-2 my-2 px-2">
              <span className="  text-base md:text-xl font-semibold">
                Channel Tags
              </span>
              <div className="flex gap-1 flex-wrap">
                {categories &&
                  categories.map((item, index) => (
                    <div
                      key={index}
                      className="badge p-2 md:p-3 text-sm capitalize md:text-base"
                    >
                      {item}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className=" flex flex-col gap-2 md:mx-4 md:px-4 md:w-1/2 ">
            <div className="flex md:justify-between flex-col md:flex-row p-2 m-2 gap-2">
              {channelData?.Title && (
                <h2 className="card-title text-xl md:text-2xl text-center">
                  {channelData?.Title}
                </h2>
              )}
              <button className="btn btn-secondary btn-outline btn-sm md:btn-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Add to Favourite
              </button>
            </div>
            {channelData?.Rating && (
              <div className="flex px-2 mx-2 ">
                <p className="font-semibold text-xl mr-2">Rating</p>
                <RatingComp Rating={Number(channelData?.Rating)} />
                <span className="text-xs md:text-base mx-2 pt-1">
                  {Number(channelData?.Rating)}
                </span>
              </div>
            )}
            <div className="flex flex-col p-2 m-2 gap-4">
              <h6 className="text-xl font-semibold">Description</h6>
              <p className="text-sm">{channelData?.Description}</p>
              <div className="flex justify-between gap-1  px-4 py-2 rounded-lg border border-black">
                {channelData?.Subs && (
                  <div className="flex align-center  flex-col gap-1">
                    <MdOutlinePeopleOutline size={36} />
                    <span className="text-xs">Total Subscribers</span>
                    <span className="text-xs">{channelData?.Subs}</span>
                  </div>
                )}
                {channelData?.uploads && (
                  <div className="flex items-center flex-col gap-1 ">
                    <BiSolidVideoPlus size={36} />
                    <span className="text-xs">Uploads Till Date</span>
                    <span className="text-xs">{channelData?.uploads}</span>
                  </div>
                )}
                {channelData?.VideoViews && (
                  <div className="flex items-center flex-col gap-1 ">
                    <IoPeopleCircleSharp size={32} />
                    <span className="text-xs">Total Video Views</span>
                    <span className="text-xs">{channelData?.VideoViews}</span>
                  </div>
                )}
              </div>
              <div>
                <a
                  href={`https://www.youtube.com/${channelData?.Username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={Youtubelogo}
                    loading="lazy"
                    className="h-[4rem] w-[6rem] md:h-[6rem] md:w-[10rem] cursor-pointer hover:scale-[1.1] transition-all dark:bg-white rounded-lg"
                  ></img>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
