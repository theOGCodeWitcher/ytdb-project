import { useEffect, useState } from "react";
import { OwnReviewCardProps } from "../types/type";
import { useParams } from "react-router-dom";
import { getReviewsByChannelIdAnduserId } from "../api/channelPageApi";
import { getUserID_db } from "../context/customHooks";
import SectionHeading from "./SectionHeading";
import ReviewCard from "./ReviewCard";
import Loading from "./Loading";

export default function OwnReview({ setdisplayReviewForm }: any) {
  const { channelId } = useParams<string>();

  const [reviewsData, setreviewsData] = useState<OwnReviewCardProps>();
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(true);
  const userId = getUserID_db();

  async function fetchReviewsByChannelIdAndUserId() {
    if (channelId && userId) {
      try {
        setIsLoadingReview(true);
        const data = await getReviewsByChannelIdAnduserId(channelId, userId);
        setreviewsData(data);
        if (typeof data === "object" && data !== null && !Array.isArray(data)) {
          setdisplayReviewForm(false);
        }
        setIsLoadingReview(false);
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setIsLoadingReview(false);
      }
    }
  }

  useEffect(() => {
    fetchReviewsByChannelIdAndUserId();
  }, [channelId, userId]);

  return (
    <div className="flex flex-col gap-8 item-center md:w-1/2 px-8">
      <SectionHeading>My Review</SectionHeading>
      {reviewsData &&
        (isLoadingReview ? (
          <Loading />
        ) : typeof reviewsData !== "string" ? (
          <ReviewCard
            rating={reviewsData.rating}
            review={reviewsData.review}
            tags={reviewsData.tags}
          />
        ) : (
          <div className="w-full flex justify-center ">
            <span>You have not reviewed this channel yet</span>
          </div>
        ))}
    </div>
  );
}
