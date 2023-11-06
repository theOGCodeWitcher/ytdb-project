import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChannelCollectionResponse } from "../types/type";
import CardCollection from "./CardCollection";
import { getSimilarChannel } from "../api/channelPageApi";
import SectionHeading from "./SectionHeading";
import { CardCollectionSkeleton } from "./CardCollectionSkeleton";

export default function SimilarChannel() {
  const { channelId } = useParams<string>();
  const [isLoading, setIsLoading] = useState(true); // Removed the <boolean> type for simplicity.
  const [data, setData] = useState<ChannelCollectionResponse | null>(null);

  async function fetchSimilarChannel() {
    if (channelId) {
      try {
        setIsLoading(true);
        const fetchedData = await getSimilarChannel(channelId);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching similar channels data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchSimilarChannel();
  }, [channelId]);

  return (
    <>
      <div className="mb-4">
        <SectionHeading>Similar Channels </SectionHeading>{" "}
      </div>
      {isLoading ? (
        <CardCollectionSkeleton />
      ) : (
        data && <CardCollection data={data} />
      )}
    </>
  );
}
