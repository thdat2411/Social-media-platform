"use client";
import React, { useEffect, useState } from "react";
import PostModal from "./components/post-modal";
import Post from "./post";
import PostInput from "./post-input";
import MediaModal from "./components/media-modal";

const FeedMainContent = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isOpenEditMode, setIsOpenEditModal] = useState(false);
  const [draft, setDraft] = useState<string | null>("");

  useEffect(() => {
    const draftstorage = localStorage.getItem("draft");
    if (!draftstorage) {
      setDraft("");
    } else {
      setDraft(JSON.parse(draftstorage));
    }
  }, [draft]);

  const updateDraft = (newText: string) => {
    setDraft(newText);
    localStorage.setItem("draft", JSON.stringify(newText));
  };
  return (
    <>
      <PostModal
        open={isPostModalOpen}
        setOpen={setIsPostModalOpen}
        image={null}
        draft={draft}
        updateDraft={updateDraft}
      />
      <MediaModal open={isOpenEditMode} setOpen={setIsOpenEditModal} />
      <div className="w-1/2 mx-4">
        <PostInput
          setIsPostModalOpen={() => setIsPostModalOpen(true)}
          setIsImageModalOpen={() => {
            setIsOpenEditModal(true);
          }}
          draft={draft}
        />
        <Post />
      </div>
    </>
  );
};

export default FeedMainContent;
