export const CardSkeleton = () => {
  return (
    <div className="card  h-[32rem] w-[16rem] md:w-[18rem] md:h-[32rem] overflow-hidden">
      <div className="h-[12rem] bg-gray-200 dark:bg-gray-300 animate-pulse"></div>{" "}
      {/* Banner Placeholder */}
      <div className="card-body p-[0.8rem]">
        <div className="h-4 bg-gray-200 dark:bg-gray-300  rounded w-3/4 mb-4 animate-pulse"></div>{" "}
        {/* Title Placeholder */}
        <div className="h-4 bg-gray-200  dark:bg-gray-300 rounded w-1/2 mb-4 animate-pulse"></div>{" "}
        {/* Rating Placeholder */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-300  rounded animate-pulse"></div>{" "}
          {/* Description line 1 Placeholder */}
          <div className="h-3 bg-gray-200  dark:bg-gray-300 rounded w-5/6 animate-pulse"></div>{" "}
          {/* Description line 2 Placeholder */}
          <div className="h-3 bg-gray-200 dark:bg-gray-300  rounded w-4/6 animate-pulse"></div>{" "}
          {/* Description line 3 Placeholder */}
        </div>
        <div className="flex gap-1 flex-wrap mt-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-300  rounded w-12 animate-pulse"></div>{" "}
          {/* Category 1 Placeholder */}
          <div className="h-3 bg-gray-200 dark:bg-gray-300  rounded w-12 animate-pulse"></div>{" "}
          {/* Category 2 Placeholder */}
          {/* More categories can be added if needed */}
        </div>
        <div className="flex justify-between gap-1 m-2 px-2 mt-4">
          <div className="w-14 h-10 bg-gray-200 dark:bg-gray-300  rounded animate-pulse"></div>{" "}
          {/* Subscribers Placeholder */}
          <div className="w-14 h-10 bg-gray-200  dark:bg-gray-300 rounded animate-pulse"></div>{" "}
          {/* Uploads Placeholder */}
        </div>
      </div>
    </div>
  );
};
