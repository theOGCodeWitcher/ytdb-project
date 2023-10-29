import SectionHeading from "./SectionHeading";
import Card from "./Card";
import { useEffect, useState } from "react";
import fetchTrending from "../api/homePage";
import { TrendingResponse } from "../types/type";

export const TrendingSection = () => {
  const [data, setData] = useState<TrendingResponse>();
  const [error, setError] = useState<Error | unknown>();

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchTrending();
        console.log(result);

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
    <div className="mb-16">
      <SectionHeading>Trending</SectionHeading>
      <div className="flex mx-16 overflow-x-auto p-4 gap-4 no-scrollbar">
        {data?.map((item, index) => (
          <div key={index} className="">
            <Card data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};
