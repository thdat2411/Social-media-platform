/* eslint-disable @typescript-eslint/no-explicit-any */
import LikeImage from "@/app/assets/like-hover.png";
import PencilIcon from "@/app/assets/pencil.png";
import TrashIcon from "@/app/assets/trash.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { user } from "@prisma/client";
import axios from "axios";
import { debounce } from "lodash";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { formatDate, transformDateString } from "../utils/utils";
import CommentInput from "./comment-input";
import PreviewContainer from "./components/preview-container";
import { CommentsWithLiked } from "./post";

interface CommentProps {
  postUserId?: string;
  comment: CommentsWithLiked | null;
  user: user;
  position: number;
  setIsReplied?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostComment = ({ comment, user, position, postUserId }: CommentProps) => {
  const [iComment, setIComment] = useState<CommentsWithLiked | null>(comment);
  const [preview, setPreview] = useState<any>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [replies, setReplies] = useState<CommentsWithLiked[]>([]);
  const [isReplied, setIsReplied] = useState(false);
  /*----------------------------------------------------------------*/
  const debounceUpdateLike = debounce(async (commentId: string) => {
    const isLike = iComment?.likedByUser;
    if (isLike === false) {
      const response = await axios.post(`/api/like?commentId=${commentId}`);
      if (response.status !== 200) {
        console.log("Error updating like");
      }
    } else {
      const response = await axios.delete(`/api/like?commentId=${commentId}`);
      if (response.status !== 200) {
        console.log("Error updating dislike");
      }
    }
  }, 2000);
  /*----------------------------------------------------------------*/
  const handleLikePost = () => {
    const isLike = iComment?.likedByUser;
    setIComment({
      ...iComment!,
      likedByUser: !isLike,
      likeCount: isLike
        ? (iComment?.likeCount ?? 0) - 1
        : (iComment?.likeCount ?? 0) + 1,
    });
    if (iComment?.id) {
      debounceUpdateLike(iComment.id);
    }
  };
  /*----------------------------------------------------------------*/
  const handleLoadReplies = async () => {
    try {
      const response = await axios.get(`/api/comment?commentId=${comment?.id}`);
      if (response.status === 200) {
        const { comments } = response.data;
        setReplies(comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  /*----------------------------------------------------------------*/
  useEffect(() => {
    const fetchPreview = async () => {
      if (iComment?.preview_url) {
        setIsLoading(true);
        if (iComment?.preview_url.includes(window.location.origin)) {
          const jobId = iComment?.preview_url.split("/").pop();
          const response = await axios.get(`/api/jobs/view/${jobId}`);
          const { jobPost } = response.data;
          setPreview({ ...jobPost, url: iComment?.preview_url });
        } else {
          const response = await axios.get(
            `/api/fetchLinkPreview?url=${iComment?.preview_url}`
          );
          const { preview } = response.data;
          setPreview(preview);
        }
        setIsLoading(false);
      }
    };
    fetchPreview();
  }, [iComment]);
  if (isLoading) {
    return (
      <div className="w-full">
        {position % 2 === 0 ? (
          <div className="flex items-start space-x-2">
            <Skeleton className="h-10 w-10 rounded-full bg-slate-300" />
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-10 w-[400px] rounded-full bg-slate-300" />
              <div className="flex space-x-2">
                <Skeleton className="h-2 w-[50px] bg-slate-300" />
                <Skeleton className="h-2 w-[50px] bg-slate-300" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start space-x-2">
            <Skeleton className="h-10 w-10 rounded-full bg-slate-300" />
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-20 w-[400px] bg-slate-300" />
              <div className="flex space-x-2">
                <Skeleton className="h-2 w-[50px] bg-slate-300" />
                <Skeleton className="h-2 w-[50px] bg-slate-300" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="flex w-full items-start space-x-3">
        <Avatar className="size-10">
          <AvatarImage
            src={iComment?.user.image ?? ""}
            className="rounded-full"
          />
          <AvatarFallback className="bg-blue-300 text-lg text-white">
            {iComment?.user.name.split(" ").pop()?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex w-full flex-col">
          <div className="flex justify-between">
            <div className="flex flex-col justify-center">
              <div className="flex items-center">
                <p className="text-sm font-medium">{iComment?.user.name}</p>
                {iComment?.user.id === postUserId && (
                  <p className="ml-2 rounded-md bg-slate-500 px-2 text-xs font-semibold text-white">
                    Author
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500">Bio</p>
            </div>
            {!isEdit && (
              <div className="flex items-center space-x-2">
                {iComment?.updated_at &&
                  iComment?.created_at &&
                  iComment.updated_at > iComment.created_at &&
                  comment?.user_id === user.id && (
                    <p className="text-xs text-gray-500">(edited)</p>
                  )}
                {iComment?.user_id === user.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="rounded-full p-3 hover:bg-[#F4F2EE]"
                      >
                        <Ellipsis className="size-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="absolute -right-6 flex w-[200px] flex-col items-center justify-start">
                      <Button
                        onClick={() => setIsEdit(true)}
                        variant="ghost"
                        className="flex w-full items-center justify-start space-x-2"
                      >
                        <Image src={PencilIcon} alt="" className="size-4" />
                        <p>Edit</p>
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex w-full items-center justify-start space-x-2"
                      >
                        <Image src={TrashIcon} alt="" className="size-4" />
                        <p>Delete</p>
                      </Button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <p className="text-xs text-gray-500">
                  {iComment?.created_at
                    ? transformDateString(formatDate(iComment?.created_at))
                    : "N/A"}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {!isEdit ? (
              <>
                <p className="my-2 text-sm">{iComment?.content}</p>
                {iComment?.preview_url && preview && (
                  <PreviewContainer
                    data={preview}
                    isComment={true}
                    isUserComment={isEdit ? false : true}
                  />
                )}
                <div className="mt-2 flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <p
                      onClick={handleLikePost}
                      className={`cursor-pointer rounded-md p-1 text-xs font-semibold hover:bg-slate-100 ${iComment?.likedByUser ? "text-black" : "text-gray-600"}`}
                    >
                      {iComment?.likedByUser ? "Liked" : "Like"}
                    </p>
                    {(iComment?.likeCount ?? 0) > 0 && (
                      <>
                        <div className="border-1 size-1 rounded-full border bg-gray-600"></div>
                        <Image src={LikeImage} alt="" width={16} height={16} />
                        <p className="text-xs text-gray-600">
                          {iComment?.likeCount}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="border-1 h-5 w-[2px] border"></div>
                  <div className="flex space-x-2">
                    <p
                      className="cursor-pointer rounded-md p-1 text-xs font-semibold text-gray-600 hover:bg-slate-100"
                      onClick={() => {
                        setIsReply(!isReply);
                        handleLoadReplies();
                      }}
                    >
                      Reply
                    </p>
                    {(iComment?.replyCount ?? 0) > 0 && (
                      <>
                        <div className="border-1 size-1 rounded-full border bg-gray-600"></div>
                        <p className="text-xs text-gray-600">
                          {iComment?.replyCount}
                          {""}
                          {(iComment?.replyCount ?? 0) > 1
                            ? "replies"
                            : "reply"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <CommentInput
                comment={iComment}
                isEdit={true}
                setIsEdit={setIsEdit}
                setComment={setIComment}
              />
            )}
          </div>
          {isReply && (
            <>
              {!isReplied && (
                <CommentInput
                  comment={iComment}
                  setComment={setIComment}
                  isEdit={false}
                  isReply={isReply}
                  setIsReply={setIsReply}
                  setIsReplied={setIsReplied}
                  userId={user.id}
                />
              )}
              {replies.length > 0 && (
                <div className="mt-6 w-full">
                  <div className="flex w-full flex-col space-y-8">
                    {replies?.map((reply, index) => (
                      <PostComment
                        key={reply.id}
                        postUserId={postUserId}
                        user={user}
                        setIsReplied={setIsReplied}
                        position={index}
                        comment={reply}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
};

export default PostComment;
