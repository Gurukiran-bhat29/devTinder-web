const Shimmer = () => {
  return (
    <div className="flex flex-wrap justify-center m-4">
      {Array(10)
        .fill("")
        .map((_, index) => (
          <div
            key={"shimmer-" + index}
            className="w-72 h-52 m-2 bg-gray-200 rounded-lg animate-pulse"
          ></div>
        ))}
    </div>
  );
};

export default Shimmer;
