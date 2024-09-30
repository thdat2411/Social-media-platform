"use client";
import React, { useState } from "react";
import PostModal from "./components/post-modal";
import Post from "./post";
import PostInput from "./post-input";
import MediaModal from "./components/media-modal";
import EventModal from "./components/event-modal";

const FeedMainContent = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isOpenEditMode, setIsOpenEditModal] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [draftContent, setDraftContent] = useState<string | null>(null);
  const [draftImage, setDraftImage] = useState<string | null>();

  return (
    <>
      <PostModal
        open={isPostModalOpen}
        setOpen={setIsPostModalOpen}
        image={null}
        draftImage={draftImage}
        draftContent={draftContent}
        setDraftContent={setDraftContent}
        setDraftImage={setDraftImage}
        setIsOpenEditModal={setIsOpenEditModal}
      />
      <MediaModal
        open={isOpenEditMode}
        setOpen={setIsOpenEditModal}
        setDraftContent={setDraftContent}
        setDraftImage={setDraftImage}
      />
      <EventModal open={isEventModalOpen} setOpen={setIsEventModalOpen} />
      <div className="w-1/2 mx-4">
        <PostInput
          setIsPostModalOpen={() => setIsPostModalOpen(true)}
          setIsImageModalOpen={() => {
            setIsOpenEditModal(true);
          }}
          setIsEventModalOpen={setIsEventModalOpen}
          draftContent={draftContent}
        />
        <Post />
      </div>
    </>
  );
};

export default FeedMainContent;
