import { useEffect, useState } from "react";
import VideoContainer from "./VideoContainer";
import SectionHeading from "./SectionHeading";
import { fetchPopularVideos, fetchRecentVideos } from "../api/VideoApi";
import { useParams } from "react-router-dom";
import { VideoItemResponse } from "../types/type";
import Loading from "./Loading";

export default function VideoCompWrapper() {
  const [currentVideos, setCurrentVideos] = useState<VideoItemResponse>();
  const { channelId } = useParams<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const showMostRecent = () => {
    if (channelId) {
      fetchVideos(channelId, "recent");
    }
  };

  const showMostPopular = () => {
    if (channelId) {
      fetchVideos(channelId, "popular");
    }
  };

  async function fetchVideos(channelId: string, type: string) {
    try {
      let response;
      setIsLoading(true);
      if (type == "popular") {
        response = await fetchPopularVideos(channelId);
      } else {
        response = await fetchRecentVideos(channelId);
      }
      setIsLoading(false);
      setCurrentVideos(response);
    } catch (error) {
      console.error("Error fetching Video data:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (channelId) {
      fetchVideos(channelId, "recent");
    }
  }, []);

  return (
    <div>
      <div className="flex justify-between  px-2 mx-8">
        <SectionHeading>Videos</SectionHeading>
        <div className="flex gap-2 md:gap-6 items-center md:pt-3">
          <div
            className="badge badge-neutral badge-xs md:badge-md p-4 cursor-pointer"
            onClick={showMostRecent}
          >
            Most Recent
          </div>
          <div
            className="badge badge-neutral badge-xs md:badge-md p-4 cursor-pointer"
            onClick={showMostPopular}
          >
            Most Popular
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        currentVideos && <VideoContainer videos={currentVideos} />
      )}
    </div>
  );
}
