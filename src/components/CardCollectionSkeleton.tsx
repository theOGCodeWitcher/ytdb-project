import { CardSkeleton } from "./CardSkeleton";

export const CardCollectionSkeleton = () => {
  const skeletonCards = 4;

  return (
    <div className="flex mx-2 px-2 pb-2  md:pb-8 md:mx-16 overflow-x-auto gap-3 md:p-4 md:gap-8 no-scrollbar">
      {[...Array(skeletonCards)].map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};
