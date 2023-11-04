import { OwnReviewCardProps } from "../types/type";
import SectionHeading from "./SectionHeading";
import ReviewCard from "./ReviewCard";
import Loading from "./Loading";

interface OwnReviewProps {
  ownReviewData: OwnReviewCardProps | undefined;
  isLoadingOwnReview: boolean;
  reviewExist: boolean;
}

export default function OwnReview({
  ownReviewData,
  isLoadingOwnReview,
  reviewExist,
}: OwnReviewProps) {
  return (
    <div className="flex flex-col gap-8 item-center md:w-1/2 px-8">
      <SectionHeading>My Review</SectionHeading>
      {isLoadingOwnReview ? (
        <Loading />
      ) : ownReviewData && reviewExist ? (
        <ReviewCard
          rating={ownReviewData.rating}
          review={ownReviewData.review}
          tags={ownReviewData.tags}
        />
      ) : (
        <div className="w-full flex justify-center">
          <span>You have not reviewed this channel yet</span>
        </div>
      )}
    </div>
  );
}
