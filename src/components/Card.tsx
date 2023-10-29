import { useEffect, useState } from "react";
import { RatingComp } from "./Rating";

type CardProps = {
  imgSrc?: string;
  imgAlt?: string;
  title?: string;
  description?: string;
  Rating?: number;
  TopicCategories?: string[];
};

export default function Card({
  imgSrc,
  imgAlt,
  title,
  description,
  Rating,
  TopicCategories,
}: CardProps) {
  function clipDescription(description: string): string {
    const index = description.indexOf(".");
    if (index !== -1) {
      return description.slice(0, index + 1);
    }
    return description;
  }

  function extractCategories(urls: string[]) {
    return urls.map((url: string) => {
      const parts = url.split("/");
      return parts[parts.length - 1];
    });
  }

  const [categories, setcategories] = useState<string[]>();
  useEffect(() => {
    if (TopicCategories) {
      const categories = extractCategories(TopicCategories);
      setcategories(categories);
    }
  }, []);

  return (
    <div className="card w-[18rem] bg-base-100 shadow-xl">
      {imgSrc && (
        <figure>
          <img src={imgSrc} alt={imgAlt || "Image"} />
        </figure>
      )}
      <div className="card-body ">
        {title && <h2 className="card-title text-base">{title}</h2>}
        {Rating && <RatingComp Rating={Rating} />}
        {description && (
          <p className="text-gray-500 text-xs">
            {clipDescription(description)}
          </p>
        )}
        <div className="flex gap-1 flex-wrap">
          {categories &&
            categories.map((item, index) => (
              <div key={index} className="badge p-2 text-xs">
                {item}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
