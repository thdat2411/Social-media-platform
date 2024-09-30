import CategoryListSidebar from "./category-list-sidebar";
import SearchMainContent from "./main-content";

const SearchPage = () => {
  return (
    <div className="relative">
      <div className="flex w-full max-w-6xl mt-4 mx-auto">
        <CategoryListSidebar />
        <SearchMainContent />
      </div>
    </div>
  );
};

export default SearchPage;
