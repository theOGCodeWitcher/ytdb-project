import ReviewCard from "./ReviewCard";
import { ReviewCardProps } from "../types/type";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReviewsByChannelId } from "../api/channelPageApi";
import Loading from "./Loading";

export default function ReviewContainer() {
  const [reviewsData, setreviewsData] = useState<ReviewCardProps[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { channelId } = useParams<string>();

  async function fetchReviews() {
    if (channelId) {
      try {
        setIsLoading(true);
        const data = await getReviewsByChannelId(channelId);
        setreviewsData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-4 flex flex-wrap gap-8">
      {isLoading ? (
        <Loading />
      ) : (
        reviewsData &&
        reviewsData.map((review, index) => (
          <ReviewCard
            key={index}
            _id={review.review.id}
            ytdbUsername={review.ytdbUsername}
            userName={review.userName}
            rating={review.review.rating}
            review={review.review.review}
            tags={review.review.tags}
          />
        ))
      )}
    </div>
  );
}
