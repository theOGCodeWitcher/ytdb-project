import { useEffect, useState } from "react";
import {
  fetchChannelById,
  getReviewsByChannelId,
  getReviewsByChannelIdAnduserId,
  postReview,
} from "../api/channelPageApi";
import { useParams } from "react-router-dom";
import {
  ChannelItem,
  OwnReviewCardProps,
  ReviewCardProps,
  ReviewFormData,
} from "../types/type";
import { RatingComp } from "../components/Rating";
import { extractCategories, formatCount } from "../lib/util";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { BiSolidVideoPlus } from "react-icons/bi";
import { IoPeopleCircleSharp } from "react-icons/io5";
import Youtubelogo from "../assets/youtube.jpg";
import Loading from "../components/Loading";
import VideoCompWrapper from "../components/VideoCompWrapper";
import ReviewForm from "../components/ReviewForm";
import HorizontalDivider from "../components/HorizontalDivider";
import { getUserID_db } from "../context/customHooks";
import { BsBalloonHeartFill, BsFillBookmarkStarFill } from "react-icons/bs";
import ReviewContainer from "../components/ReviewContainer";
import OwnReview from "../components/OwnReview";
import bannerplaceholder from "../assets/bannerplaceholder.jpg";
import SimilarChannel from "../components/SimilarChannel";
import { useAuth0 } from "@auth0/auth0-react";

export default function Channel() {
  const { channelId } = useParams<string>();
  const [channelData, setchannelData] = useState<ChannelItem>();
  const [categories, setcategories] = useState<string[] | undefined>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const id = getUserID_db();
  const { isAuthenticated } = useAuth0();
  const userId = getUserID_db();

  async function fetchchannelData() {
    if (channelId) {
      try {
        setIsLoading(true);
        let data: ChannelItem;
        if (id) {
          data = await fetchChannelById(channelId, id);
        } else {
          data = await fetchChannelById(channelId, "");
        }
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

  async function submitForm(formData: ReviewFormData, clearForm: () => void) {
    try {
      await postReview(formData);
      setIsModalOpen(true);
      clearForm();
    } catch (error) {
      console.log("Error posting form", error);
    }
  }

  const handleFormSubmission = (
    formData: ReviewFormData,
    clearForm: () => void
  ) => {
    submitForm(formData, clearForm);
  };

  const [reviewsData, setreviewsData] = useState<ReviewCardProps[]>();
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(true);

  async function fetchReviewsByChannelId() {
    if (channelId) {
      try {
        setIsLoadingReview(true);
        const data = await getReviewsByChannelId(channelId);
        setreviewsData(data);
        setIsLoadingReview(false);
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setIsLoadingReview(false);
      }
    }
  }

  const [ownreviewsData, setownreviewsData] = useState<OwnReviewCardProps>();
  const [isLoadingOwnReview, setIsLoadingOwnReview] = useState<boolean>(false);
  const [reviewExist, setreviewExist] = useState<boolean>(false);

  async function fetchReviewsByChannelIdAndUserId() {
    if (channelId && userId) {
      try {
        setIsLoadingOwnReview(true);
        const data = await getReviewsByChannelIdAnduserId(channelId, userId);
        setownreviewsData(data);
        if (typeof data === "object" && data !== null && !Array.isArray(data)) {
          setreviewExist(true);
        } else {
          setreviewExist(false);
        }
        setIsLoadingOwnReview(false);
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setIsLoadingOwnReview(false);
      }
    }
  }

  useEffect(() => {
    fetchchannelData();
    fetchReviewsByChannelId();
  }, [channelId, isModalOpen]);

  useEffect(() => {
    fetchReviewsByChannelIdAndUserId();
  }, [isAuthenticated, channelId, userId, isModalOpen]);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="modal modal-open">
                <div className="modal-box">
                  <h2 className="text-lg">Thanks for posting a review! 😍"</h2>
                  <div className="modal-action">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="btn"
                    >
                      Ok
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row  md:px-8 md:mx-8  md:py-4 md:my-4 ">
            <div className="flex flex-col  px-2 my-2 overflow-hidden md:w-1/2">
              <img
                src={
                  channelData?.BannerImage
                    ? channelData.BannerImage
                    : bannerplaceholder
                }
                loading="lazy"
                key={channelData?.ChannelId}
                className="rounded-sm"
              ></img>
              <div className="flex flex-col gap-2 my-2 px-1">
                <span className="  text-base md:text-xl font-semibold">
                  Channel Tags
                </span>
                <div className="flex gap-1 flex-wrap">
                  {categories &&
                    categories.map((item, index) => (
                      <div
                        key={index}
                        className="badge bg-gray-100 dark:bg-gray-800 border border-gray-300 p-3 cursor-pointer"
                      >
                        {item}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className=" flex flex-col gap-2 md:mx-4 md:px-4 md:w-1/2 ">
              <div className="flex md:justify-between flex-col md:flex-row px-2 mx-2 gap-2">
                <div className="flex flex-row justify-between md:pt-4 md:mt-4 gap-8 ">
                  {channelData?.Title && (
                    <h2 className="card-title text-xl md:text-2xl text-center">
                      {channelData?.Title}
                    </h2>
                  )}
                  <div className="flex items-center justify-center  ">
                    {channelData?.Thumbnails && (
                      <figure className="h-[4rem] w-[4rem]   md:h-[6rem] md:w-[6rem] ">
                        <img
                          src={channelData?.Thumbnails[1] || ""}
                          alt={"Thumbnail"}
                          loading="lazy"
                          className="rounded-full"
                          key={channelData?.ChannelId}
                        />
                      </figure>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-4 md:gap-8 items-center flex-shrink-0 ">
                  <div className="flex w-full gap-3 md:gap-4">
                    <button className="btn btn-secondary btn-outline ml-4 mt-1  btn-sm md:btn-bas ">
                      <BsBalloonHeartFill size={20} />
                      Favourite
                    </button>
                    <button className="btn btn-warning btn-outline mt-1  btn-sm md:btn-bas ">
                      <BsFillBookmarkStarFill size={20} />
                      wishlist
                    </button>
                    <div className="pb-4 ">
                      <a
                        href={`https://www.youtube.com/${channelData?.Username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={Youtubelogo}
                          loading="lazy"
                          className="h-[2.5rem] w-[5rem] md:h-[3rem] md:w-[6rem] cursor-pointer hover:scale-[1.1] transition-all dark:bg-white rounded-xl border border-black"
                        ></img>
                      </a>
                    </div>
                  </div>
                </div>
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
                <div className="flex justify-between gap-1  px-4 py-2 rounded-lg border border-black bg-gray-50 dark:border-white dark:bg-gray-800">
                  {channelData?.Subs && (
                    <div className="flex align-center  flex-col gap-1">
                      <MdOutlinePeopleOutline size={36} />
                      <span className="text-xs">Total Subscribers</span>
                      <span className="text-xs">
                        {formatCount(channelData?.Subs)}
                      </span>
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
                      <span className="text-xs">
                        {formatCount(channelData?.VideoViews)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <VideoCompWrapper />
          <HorizontalDivider />
          <SimilarChannel />
          <HorizontalDivider />
          <div className="w-full justify-center flex flex-col md:flex-row">
            {!isAuthenticated && <ReviewForm onSubmit={handleFormSubmission} />}
            {isAuthenticated && reviewExist && (
              <OwnReview
                ownReviewData={ownreviewsData}
                isLoadingOwnReview={isLoadingOwnReview}
                reviewExist={reviewExist}
              />
            )}
            {isAuthenticated && !reviewExist && (
              <ReviewForm onSubmit={handleFormSubmission} />
            )}
          </div>
          <HorizontalDivider />
          {reviewsData && (
            <ReviewContainer
              reviewsData={reviewsData}
              isLoadingReview={isLoadingReview}
            />
          )}
        </>
      )}
    </>
  );
}
