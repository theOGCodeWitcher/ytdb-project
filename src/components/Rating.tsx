type RatingCompProps = {
  Rating: number;
};

export function RatingComp({ Rating }: RatingCompProps) {
  const validRating = Math.max(1, Math.min(5, Rating));

  return (
    <div className="tooltip tooltip-right w-[5rem]" data-tip={validRating}>
      <div className="rating rating-sm ">
        {Array.from({ length: 5 }).map((_, index) => (
          <input
            key={index}
            type="radio"
            name="rating-2"
            className="mask mask-star-2 bg-orange-400 cursor-default"
            checked={index + 1 <= validRating}
            disabled={true}
          />
        ))}
      </div>
    </div>
  );
}
