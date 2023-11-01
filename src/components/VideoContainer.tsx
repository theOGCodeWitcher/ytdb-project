import { VideoItemResponse } from "../types/type";

export default function VideoContainer({
  videos,
}: {
  videos: VideoItemResponse;
}) {
  return (
    <div className=" flex md:flex-row flex-col gap-8 md:px-12 px-6 my-4 w-full ">
      {videos.map((video, index) => (
        <div key={index} className="md:w-1/3 ">
          <iframe
            className="w-full"
            height="315"
            src={`https://www.youtube.com/embed/${video.videoId}`}
            title={`YouTube video ${index}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            rel="1"
          ></iframe>
        </div>
      ))}
    </div>
  );
}
