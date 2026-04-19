const VideoCard = ({ info }) => {
  const { snippet, statistics } = info;
  const { channelTitle, title, thumbnails } = snippet;

  return (
    <div className="p-2 m-2 shadow-lg w-72 sm:w-72 md:w-64 lg:w-72 xl:w-80 rounded-lg hover:shadow-xl transition-shadow">
      <img
        className="rounded-lg w-full"
        alt="thumbnail"
        src={thumbnails.medium.url}
      />
      <ul className="mt-2">
        <li className="font-bold py-1 line-clamp-2">{title}</li>
        <li className="text-sm text-gray-600">{channelTitle}</li>
        {statistics && statistics.viewCount && (
          <li className="text-sm text-gray-500">
            {Number(statistics.viewCount).toLocaleString()} views
          </li>
        )}
      </ul>
    </div>
  );
};

export default VideoCard;
