import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { YOUTUBE_VIDEO_API } from "../utils/videoConstants";
import { saveVideos } from "../utils/videoSlice";
import VideoCard from "./VideoCard";
import Shimmer from "./Shimmer";

const VideoContainer = () => {
  const videos = useSelector((store) => store.video.videos);
  const dispatch = useDispatch();

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    const data = await fetch(YOUTUBE_VIDEO_API);
    const jsonData = await data.json();
    if (jsonData.items && jsonData.items.length > 0) {
      dispatch(saveVideos(jsonData.items));
    }
  };

  if (videos.length === 0) return <Shimmer />;

  return (
    <div>
      <div className="flex flex-wrap justify-center">
        {videos.map((video, index) => (
          <Link key={video.id + "-" + index} to={"/watch?v=" + video.id}>
            <VideoCard info={video} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoContainer;
