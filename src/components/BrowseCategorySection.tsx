import CategoryTile from "./CategoryTile";
import SectionHeading from "./SectionHeading";
import { MdOutlineTravelExplore } from "react-icons/md";
import animal from "../assets/category/animals.jpg";
import comedy from "../assets/category/comedy.jpg";
import education from "../assets/category/education.jpg";
import entertainment from "../assets/category/entertainment.jpg";
import games from "../assets/category/games.jpg";
import music from "../assets/category/music.jpg";
import news from "../assets/category/news.jpg";
import sports from "../assets/category/sports.jpg";
import tech from "../assets/category/tech.jpg";
import travel from "../assets/category/travel.jpg";
import { fetchAccToCategory } from "../api/homePageApi";
import { ChannelCollectionResponse } from "../types/type";
import { useEffect, useState } from "react";
import { CardCollectionSkeleton } from "./CardCollectionSkeleton";
import CardContainer from "./CardContainer";

const categoryImages = [
  animal,
  comedy,
  education,
  entertainment,
  games,
  music,
  news,
  sports,
  tech,
  travel,
];

const categoryNames = [
  "Comedy",
  "Animals",
  "Education",
  "Recreation",
  "Games",
  "Music",
  "News",
  "Sports",
  "Tech",
  "Travel",
];

export const BrowseCategorySection = () => {
  const [selectedCategoryResponse, setselectedCategoryResponse] =
    useState<ChannelCollectionResponse>([]);

  const [selectedCategory, setselectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleTileClick = async (categoryName: string) => {
    try {
      if (categoryName == "recreation") {
        categoryName = "entertainment";
      }
      setIsLoading(true);
      setselectedCategory(categoryName);
      const response = await fetchAccToCategory(categoryName);
      setselectedCategoryResponse(response.slice(0, 12));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data for category:", categoryName, error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleTileClick("comedy");
  }, []);

  return (
    <>
      <div className="flex flex-col mx-2 px-2 md:mx-8 md:px-8 items-center">
        <div className="flex justify-start mb-2">
          <SectionHeading>Explore Categories</SectionHeading>
          <div className="md:pt-5">
            <MdOutlineTravelExplore size={30} />
          </div>
        </div>
        <div className="flex gap-1 px-2 justify-center mx-auto md:gap-4 mb-2 pb-2 flex-wrap">
          {categoryImages.map((imageUrl, index) => (
            <CategoryTile
              key={index}
              imageUrl={imageUrl}
              selectedCategory={selectedCategory}
              name={categoryNames[index]}
              onClick={() =>
                handleTileClick(categoryNames[index].toLowerCase())
              }
            />
          ))}
        </div>
      </div>
      {isLoading ? (
        <CardCollectionSkeleton />
      ) : (
        <CardContainer data={selectedCategoryResponse} />
      )}
    </>
  );
};
