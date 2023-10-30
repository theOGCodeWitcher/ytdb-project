import SectionHeading from "./SectionHeading";
import CardCollection from "./CardCollection";
import { useEffect, useState } from "react";
import { fetchTrending } from "../api/homePageApi";
import { ChannelCollectionResponse } from "../types/type";
import { FaFireAlt } from "react-icons/fa";

export const TrendingSection = () => {
  const [data, setData] = useState<ChannelCollectionResponse | null>(null);
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
    <div className="mb-4  ">
      <div className="flex mx-2 px-2 py-2 my-2 md:mx-8 md:px-8 items-center">
        <SectionHeading>Trending</SectionHeading>
        <div className="md:pt-3">
          <FaFireAlt size={26} />
        </div>
      </div>
      {data && <CardCollection data={data} />}
    </div>
  );
};
