import ReviewCard from "./ReviewCard";
import { ReviewCardProps } from "../types/type";

import Loading from "./Loading";
import SectionHeading from "./SectionHeading";
import { useLocation } from "react-router-dom";

type ReviewContainerProps = {
  reviewsData: ReviewCardProps[];
  isLoadingReview: boolean;
};

export default function ReviewContainer({
  reviewsData,
  isLoadingReview,
}: ReviewContainerProps) {
  const location = useLocation();

  return (
    <div className="flex  flex-col">
      {isLoadingReview ? (
        <Loading />
      ) : (
        <div className="flex  flex-col justify-center gap-8 ">
          {location.pathname == "/profile" ? (
            <SectionHeading>My Reviews</SectionHeading>
          ) : (
            <SectionHeading>Community Reviews</SectionHeading>
          )}
          {reviewsData?.length != 0 ? (
            <div className="flex flex-wrap">
              {reviewsData?.map((review, index) => (
                <ReviewCard
                  key={index}
                  _id={review.review.id}
                  ytdbUsername={review.ytdbUsername}
                  userName={review.userName}
                  rating={review.review.rating}
                  review={review.review.review}
                  tags={review.review.tags}
                />
              ))}
            </div>
          ) : (
            <div className="w-full flex justify-center ">
              {location.pathname == "/profile" ? (
                <></>
              ) : (
                <span className="text-xl mb-16">
                  No reviews on this channel yet
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
