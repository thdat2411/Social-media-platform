"use client";
import React, { useEffect, useState } from "react";
import PostModal, { Event } from "./components/post-modal";
import FeedPost from "./post";
import PostInput from "./post-input";
import MediaModal from "./components/media-modal";
import EventModal from "./components/event-modal";

const FeedMainContent = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [draftContent, setDraftContent] = useState<string | null>(null);
  const [draftImage, setDraftImage] = useState<string | null>();
  const [nestedMediaModal, setNestedMediaModal] = useState(false);
  const [nestedEventModal, setNestedEventModal] = useState(false);
  const [formData, setFormData] = useState<Event | undefined>(undefined);
  const [image, setImage] = useState<File | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <PostModal
        open={isPostModalOpen}
        setOpen={setIsPostModalOpen}
        image={image}
        setImage={setImage}
        draftImage={draftImage}
        draftContent={draftContent}
        setDraftContent={setDraftContent}
        setDraftImage={setDraftImage}
        setIsOpenEditModal={setIsOpenEditModal}
        setIsEventModalOpen={setIsEventModalOpen}
        setNestedEventModal={setNestedEventModal}
        setNestedMediaModal={setNestedMediaModal}
        event={formData}
        setEvent={setFormData}
        isIn={false}
      />
      <MediaModal
        open={isOpenEditModal}
        setOpen={setIsOpenEditModal}
        setDraftContent={setDraftContent}
        setDraftImage={setDraftImage}
        nestedMediaModal={nestedMediaModal}
        setNestedMediaModal={setNestedMediaModal}
        isIn={false}
      />
      <EventModal
        open={isEventModalOpen}
        setOpen={setIsEventModalOpen}
        nestedEventModal={nestedEventModal}
        setNestedEventModal={setNestedEventModal}
        formData={formData}
        setFormData={setFormData}
        isIn={false}
      />
      <div className="w-1/2 mx-4">
        <PostInput
          setIsPostModalOpen={() => setIsPostModalOpen(true)}
          setIsImageModalOpen={() => {
            setIsOpenEditModal(true);
          }}
          setIsEventModalOpen={setIsEventModalOpen}
          draftContent={draftContent}
          setFormData={setFormData}
          setNestedMediaModal={setNestedMediaModal}
          setNestedEventModal={setNestedEventModal}
        />
        <FeedPost />
      </div>
    </>
  );
};

export default FeedMainContent;
