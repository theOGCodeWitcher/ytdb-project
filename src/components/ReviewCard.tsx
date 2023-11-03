export function ReviewCard({ userName, rating, review, tags }: any) {
  return (
    <div className=" p-6 rounded-lg shadow-lg max-w-md mx-auto bg-gray-100 dark:bg-gray-800 ">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, idx) => (
          <span
            key={idx}
            className={`mr-1 ${
              rating > idx ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      {review && (
        <blockquote className="italic border-l-4 border-gray-200 pl-4 mb-4">
          "{review}"
        </blockquote>
      )}
      <div className="mb-4">
        {tags &&
          tags.map((tag: any) => (
            <span
              key={tag}
              className="inline-block badge-neutral rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
            >
              {tag}
            </span>
          ))}
      </div>
      {userName && (
        <div className="text-right text-sm text-gray-500">
          Reviewed by: {userName}
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
