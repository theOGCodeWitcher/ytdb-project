import { getRecommendation } from "../api/UserApi";
import { useEffect, useState } from "react";
import { ChannelCollectionResponse } from "../types/type";
import { getUserID_db } from "../context/customHooks";
import SectionHeading from "./SectionHeading";
import { MdOutlineTravelExplore } from "react-icons/md";
import Loading from "./Loading";
import CardContainer from "./CardContainer";

export default function Explore() {
  const userId = getUserID_db();
  const [exploreData, setexploreData] =
    useState<ChannelCollectionResponse | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(true);

  async function fetchWishlist() {
    if (userId) {
      try {
        setisLoading(true);
        const data = await getRecommendation(userId);
        setexploreData(data.slice(0, 15));
        setisLoading(false);
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setisLoading(false);
      }
    }
  }

  console.log(exploreData);

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  return (
    <>
      {isLoading ? (
        <>
          <SectionHeading>
            Curating a recommendation feed for you ..
          </SectionHeading>
          <Loading />
        </>
      ) : (
        <div className="mb-4  ">
          <div className="flex mx-2 px-2 py-2 my-2 md:mx-8 md:px-8items-center">
            <SectionHeading>
              {exploreData?.length !== 0
                ? `Recommendation Crafted Just For You`
                : `Please browse the website more or add some channels to your favourite's list to help us curate personalised recommendations`}
            </SectionHeading>
            {exploreData?.length !== 0 && (
              <div className="md:pt-3">
                <MdOutlineTravelExplore size={26} />
              </div>
            )}
          </div>
          {exploreData && <CardContainer data={exploreData} />}
        </div>
      )}
    </>
  );
}
