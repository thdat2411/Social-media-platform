"use client";
import { user } from "@prisma/client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Event } from "./components/post-modal";
import FeedPost, { PostwithLiked } from "./post";
import PostInput from "./post-input";

const PostModal = dynamic(() => import("./components/post-modal"), {
  ssr: false,
});
const MediaModal = dynamic(() => import("./components/media-modal"), {
  ssr: false,
});
const EventModal = dynamic(() => import("./components/event-modal"), {
  ssr: false,
});
interface FeedMainContentProps {
  user: user;
  posts: PostwithLiked[] | null;
}

const FeedMainContent = ({ user, posts }: FeedMainContentProps) => {
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
        user={user}
      />
      <MediaModal
        open={isOpenEditModal}
        setOpen={setIsOpenEditModal}
        setDraftContent={setDraftContent}
        setDraftImage={setDraftImage}
        nestedMediaModal={nestedMediaModal}
        setNestedMediaModal={setNestedMediaModal}
        isIn={false}
        user={user}
      />
      <EventModal
        open={isEventModalOpen}
        setOpen={setIsEventModalOpen}
        nestedEventModal={nestedEventModal}
        setNestedEventModal={setNestedEventModal}
        formData={formData}
        setFormData={setFormData}
        isIn={false}
        user={user}
      />
      <div className="mx-4 w-[52%] overflow-hidden pb-6 max-[1000px]:w-[65%]">
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
          user={user}
        />
        {posts?.map((post) => (
          <FeedPost user={user} key={post.id} post={post} />
        ))}
      </div>
    </>
  );
};

export default FeedMainContent;
