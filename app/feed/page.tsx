import FeedSideBar from "./sidebar";
import FeedMainContent from "./main-content";

const FeedPage = () => {
  return (
    <div className="relative">
      <div className="flex w-full max-w-6xl mt-4 mx-auto">
        <FeedSideBar />
        <FeedMainContent />
      </div>
    </div>
  );
};

export default FeedPage;
