import getCurrentUser from "../actions/getCurrentUser";
import FeedMainContent from "./main-content";
import FeedSideBar from "./sidebar";

const FeedPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="relative overflow-y-auto">
      <div className="mx-auto mt-4 flex w-full max-w-6xl justify-center max-[700px]:flex-col min-[1000px]:flex-1 min-[1000px]:justify-start">
        <FeedSideBar user={user!} />
        <FeedMainContent user={user!} />
      </div>
    </div>
  );
};

export default FeedPage;
