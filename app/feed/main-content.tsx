"use client";
import { user } from "@prisma/client";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
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
}

const FeedMainContent = ({ user }: FeedMainContentProps) => {
  const [drafContent, setDraftContent] = useState<string | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [nestedMediaModal, setNestedMediaModal] = useState(false);
  const [nestedEventModal, setNestedEventModal] = useState(false);
  const [formData, setFormData] = useState<Event | undefined>(undefined);
  const [image, setImage] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<user | null>(null);
  const [posts, setPosts] = useState<PostwithLiked[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const content = sessionStorage.getItem("draftContent");
    if (content) {
      setDraftContent(content);
    } else {
      setDraftContent(null);
    }
  }, [isPostModalOpen]);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const fetchPosts = async () => {
    if (isLoading || !hasMore) return; // Prevent fetching if already loading or no more posts

    setIsLoading(true);
    try {
      const response = await axios.get(`/api/posts?page=${page}`);
      if (response.status === 200) {
        const { posts: fetchedPosts } = response.data;

        // Check if there are new posts and update state
        if (fetchedPosts.length > 0) {
          setPosts((prevPosts) => {
            const existingIds = new Set(prevPosts.map((post) => post.id));
            const newPosts = fetchedPosts.filter(
              (post: PostwithLiked) => !existingIds.has(post.id)
            );
            return [...prevPosts, ...newPosts];
          });
        } else {
          setHasMore(false); // No more posts to fetch
        }
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        rootMargin: "150px",
      }
    );

    const currentObserverRef = observerRef.current;

    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasMore, isLoading]);

  return (
    <>
      <PostModal
        open={isPostModalOpen}
        setOpen={setIsPostModalOpen}
        image={image}
        setImage={setImage}
        setIsOpenEditModal={setIsOpenEditModal}
        setIsEventModalOpen={setIsEventModalOpen}
        setNestedEventModal={setNestedEventModal}
        setNestedMediaModal={setNestedMediaModal}
        event={formData}
        setEvent={setFormData}
        isIn={false}
        user={currentUser!}
        isEdit={false}
      />
      <MediaModal
        open={isOpenEditModal}
        setOpen={setIsOpenEditModal}
        nestedMediaModal={nestedMediaModal}
        setNestedMediaModal={setNestedMediaModal}
        isIn={false}
        user={currentUser!}
      />
      <EventModal
        open={isEventModalOpen}
        setOpen={setIsEventModalOpen}
        nestedEventModal={nestedEventModal}
        setNestedEventModal={setNestedEventModal}
        formData={formData}
        setFormData={setFormData}
        isIn={false}
        user={currentUser!}
      />
      <div className="mx-4 w-[52%] overflow-hidden pb-6 max-[1000px]:w-[65%]">
        <PostInput
          draftContent={drafContent}
          setIsPostModalOpen={() => setIsPostModalOpen(true)}
          setIsImageModalOpen={() => {
            setIsOpenEditModal(true);
          }}
          setIsEventModalOpen={setIsEventModalOpen}
          setFormData={setFormData}
          setNestedMediaModal={setNestedMediaModal}
          setNestedEventModal={setNestedEventModal}
          user={currentUser!}
        />
        {posts?.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FeedPost user={currentUser!} key={post.id} post={post} />
          </motion.div>
        ))}
        <div ref={observerRef} />
        {isLoading && hasMore && (
          <div className="flex w-full items-center justify-center">
            <Loader className="size-14 animate-spin p-3" />
          </div>
        )}
      </div>
    </>
  );
};

export default FeedMainContent;
