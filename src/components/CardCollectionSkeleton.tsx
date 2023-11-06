import { CardSkeleton } from "./CardSkeleton";

export const CardCollectionSkeleton = () => {
  const skeletonCards = 4;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-2 px-2 pb-2 md:pb-8 md:mx-16">
      {[...Array(skeletonCards)].map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};
