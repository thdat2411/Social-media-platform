import FeedSideBar from "./sidebar";
import FeedMainContent from "./main-content";
import getCurrentUser from "../actions/getCurrentUser";

const FeedPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="relative overflow-y-auto">
      <div className="max-[700px]:flex-col flex  w-full max-w-6xl mt-4 mx-auto justify-center min-[1000px]:justify-start min-[1000px]:flex-1">
        <FeedSideBar user={user!} />
        <FeedMainContent user={user!} />
      </div>
    </div>
  );
};

export default FeedPage;
