type YoutubeEmbedProps = {
  videoIds: string[];
};

export default function VideoContainer({ videoIds }: YoutubeEmbedProps) {
  return (
    <div className="youtube-embed-container flex gap-8 py-4 my-4 px-2 mx-2 md:px-4 md:mx-4 flex-wrap  object-cover justify-center">
      {videoIds.map((videoId, index) => (
        <div key={index} className="w-full md:w-[27rem] ">
          <iframe
            className="w-full"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
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
