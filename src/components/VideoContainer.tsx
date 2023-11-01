import { formatCount } from "../lib/util";
import { VideoItemResponse } from "../types/type";
import { SlLike } from "react-icons/sl";

export default function VideoContainer({
  videos,
}: {
  videos: VideoItemResponse;
}) {
  return (
    <div className="flex md:flex-row flex-col gap-8 md:px-12 px-6 my-4 w-full">
      {videos.map((video, index) => (
        <div key={index} className="md:w-1/3">
          <iframe
            className="w-full"
            height="315"
            src={`https://www.youtube.com/embed/${video.videoId}`}
            title={`YouTube video ${index}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            rel="1"
          ></iframe>
          <div className="flex gap-2 flex-col">
            <div className="text mt-2">{video.title}</div>
            <div className="flex justify-between">
              <div className=" flex gap-2 text-sm dark:text-gray-500 text-gray-500">
                {video.likeCount}
                <div className="pt-[0.2rem]">
                  <SlLike />
                </div>
              </div>
              <div className="text-sm dark:text-gray-500 text-gray-500">
                {formatCount(Number(video.viewCount))} views
              </div>
              <div className="text-sm dark:text-gray-500 text-gray-500">
                Published: {video.publishedAtRelative}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
