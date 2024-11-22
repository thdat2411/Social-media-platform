import { user } from "@prisma/client";
import React from "react";
import PostComment from "./comments";
import { CommentsWithLiked } from "./post";
interface CommentsContainerProps {
  comments: CommentsWithLiked[] | null;
  user: user;
}

const CommentsContainer = ({ comments, user }: CommentsContainerProps) => {
  return (
    <div className="flex w-full flex-col space-y-8">
      {comments?.map((comment, index) => (
        <div key={comment.id}>
          <PostComment user={user} position={index} comment={comment} />
        </div>
      ))}
    </div>
  );
};

export default CommentsContainer;
