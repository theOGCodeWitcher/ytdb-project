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

export const BrowseCategorySection = () => {
  return (
    <>
      <div className="flex flex-col mx-2 px-2 md:mx-8 md:px-8 items-center">
        <div className="flex justify-start ">
          <SectionHeading>Explore Categories</SectionHeading>
          <div className="pt-3">
            <MdOutlineTravelExplore size={36} />
          </div>
        </div>
        <div className="flex gap-4">
          {categoryImages.map((imageUrl, index) => (
            <CategoryTile key={index} imageUrl={imageUrl} />
          ))}
        </div>
      </div>
    </>
  );
};
