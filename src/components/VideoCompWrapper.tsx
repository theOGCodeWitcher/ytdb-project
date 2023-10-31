import { useState } from "react";
import VideoContainer from "./VideoContainer";
import SectionHeading from "./SectionHeading";

const MOST_RECENT_VIDEO_IDS = ["wZ0edJjBXvA", "wZ0edJjBXvA", "wZ0edJjBXvA"];
const MOST_POPULAR_VIDEO_IDS = ["wZ0edJjBXvA", "wZ0edJjBXvA", "wZ0edJjBXvA"];

export default function VideoCompWrapper() {
  const [currentVideos, setCurrentVideos] = useState(MOST_RECENT_VIDEO_IDS);

  const showMostRecent = () => {
    setCurrentVideos(MOST_RECENT_VIDEO_IDS);
  };

  const showMostPopular = () => {
    setCurrentVideos(MOST_POPULAR_VIDEO_IDS);
  };

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
      <VideoContainer videoIds={currentVideos} />
    </div>
  );
}
