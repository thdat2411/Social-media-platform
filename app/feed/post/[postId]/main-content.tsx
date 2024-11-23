"use client";
import { user } from "@prisma/client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FeedPost, { PostwithLiked } from "../../post";

interface SinglePostMainContentProps {
  user: user;
}

const SinglePostMainContent = ({ user }: SinglePostMainContentProps) => {
  const [post, setPost] = useState<PostwithLiked | null>(null);
  const params = useSearchParams();
  const postId = params.get("postId");

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(`/api/post?postId=${postId}`);
      const { post } = res.data;
      if (res.status === 200) {
        setPost(post);
      }
    };
    getPost();
  });

  return <FeedPost post={post!} user={user} />;
};

export default SinglePostMainContent;
