import { useSearchParams } from "react-router-dom";

const WatchPage = () => {
  const [searchParam] = useSearchParams();

  return (
    <div className="w-full flex justify-center px-2 sm:px-4 md:px-10 py-5 md:py-10">
      <iframe
        className="w-full max-w-5xl aspect-video rounded-lg"
        src={"https://www.youtube.com/embed/" + searchParam.get("v")}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

export default WatchPage;
