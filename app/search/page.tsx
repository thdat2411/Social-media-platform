import CategoryListSidebar from "./category-list-sidebar";
import SearchMainContent from "./main-content";

const SearchPage = () => {
  return (
    <div className="relative">
      <div className="mx-auto mt-4 flex w-full max-w-6xl">
        <CategoryListSidebar />
        <SearchMainContent />
      </div>
    </div>
  );
};

export default SearchPage;
