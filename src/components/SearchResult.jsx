import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  YOUTUBE_SEARCH_API_PART1,
  YOUTUBE_SEARCH_API_PART2,
} from "../utils/videoConstants";
import VideoCard from "./VideoCard";
import Shimmer from "./Shimmer";

const SearchResult = () => {
  const [searchVideos, setSearchVideos] = useState([]);
  const [searchParam] = useSearchParams();

  useEffect(() => {
    getSearchResults();
  }, [searchParam]);

  const getSearchResults = async () => {
    const query = searchParam.get("search_query");
    if (!query) return;
    const response = await fetch(
      YOUTUBE_SEARCH_API_PART1 + encodeURIComponent(query) + YOUTUBE_SEARCH_API_PART2
    );
    const jsonResponse = await response.json();
    if (jsonResponse.items && jsonResponse.items.length > 0) {
      setSearchVideos(jsonResponse.items);
    }
  };

  if (searchVideos.length === 0) return <Shimmer />;

  return (
    <div className="flex flex-wrap justify-center">
      {searchVideos.map((video) => (
        <Link
          key={video.id.videoId}
          to={"/watch?v=" + video.id.videoId}
        >
          <VideoCard info={video} />
        </Link>
      ))}
    </div>
  );
};

export default SearchResult;
