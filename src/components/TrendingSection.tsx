import SectionHeading from "./SectionHeading";
import Card from "./Card";
import { useEffect, useState } from "react";
import fetchTrending from "../api/homePage";
import { TrendingResponse } from "../types/type";
import { FaFireAlt } from "react-icons/fa";

export const TrendingSection = () => {
  const [data, setData] = useState<TrendingResponse>();
  const [error, setError] = useState<Error | unknown>();

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchTrending();
        setData(result);
      } catch (err) {
        setError(err);
      }
    }

    loadData();
  }, []);

  if (error) {
    return <div>Error loading trending data.</div>;
  }

  return (
    <div className="mb-4 pb-8 shadow-lg">
      <div className="flex mx-2 px-2 py-2 my-2 md:mx-8 md:px-8 items-center">
        <SectionHeading>Trending</SectionHeading>
        <div className="md:pt-3">
          <FaFireAlt size={26} />
        </div>
      </div>
      <div className="flex mx-2 px-2 pb-2 md:pb-8 md:mx-16 overflow-x-auto gap-3 md:p-4 md:gap-8 no-scrollbar">
        {data?.map((item, index) => (
          <div key={index} className="">
            <Card data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};
