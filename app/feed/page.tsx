import FeedSideBar from "./sidebar";
import FeedMainContent from "./main-content";

const FeedPage = () => {
  return (
    <div className="relative overflow-y-auto">
      <div className="max-[700px]:flex-col flex  w-full max-w-6xl mt-4 mx-auto justify-center min-[1000px]:justify-start min-[1000px]:flex-1">
        <FeedSideBar />
        <FeedMainContent />
      </div>
    </div>
  );
};

export default FeedPage;
