import { CATEGORY_LIST } from "../utils/videoConstants";

const ButtonList = () => {
  return (
    <div className="flex overflow-x-auto py-2 px-2 no-scrollbar">
      {CATEGORY_LIST.map((name, index) => (
        <button
          key={`cat-${index}`}
          className="px-4 py-1 m-1 bg-gray-200 rounded-full whitespace-nowrap text-sm hover:bg-gray-300 transition-colors"
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default ButtonList;
