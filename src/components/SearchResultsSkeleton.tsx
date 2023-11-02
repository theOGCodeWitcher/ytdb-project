const SearchResultsSkeleton = () => {
  return (
    <ul className="search-results-skeleton h-[15rem]">
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <li
            key={index}
            className="px-2 py-2 dark:hover:bg-gray-900 hover:bg-gray-200 transition duration-150 ease-in-out"
          >
            <div className="flex gap-4">
              <div className="flex items-center justify-center">
                <figure className="h-[2rem] w-[2rem] bg-gray-300 rounded-full animate-pulse"></figure>
              </div>
              <span className="flex items-center bg-gray-300 w-40 h-4 rounded animate-pulse mt-2"></span>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default SearchResultsSkeleton;
