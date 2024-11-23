import getCurrentUser from "../actions/getCurrentUser";
import { getPosts } from "../actions/getPosts";
import FeedMainContent from "./main-content";
import FeedSideBar from "./sidebar";

const FeedPage = async () => {
  const user = await getCurrentUser();
  const posts = await getPosts(user!.id);
  return (
    <div className="relative flex h-full w-full justify-center">
      <div className="mt-4 flex w-[60%] justify-start max-[1669px]:w-[70%] max-[1669px]:justify-center max-[1440px]:w-[80%] max-[1000px]:w-[85%]">
        <div className="z-2 sticky top-20 flex h-fit w-1/5 flex-col space-y-4 max-[1000px]:w-1/3">
          <FeedSideBar user={user!} />
        </div>
        <FeedMainContent user={user!} posts={posts!} />
      </div>
    </div>
  );
};

export default FeedPage;
