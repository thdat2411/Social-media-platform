"use client";

import CommentIconHover from "@/app/assets/comment-post-hover.png";
import CommentIcon from "@/app/assets/comment-post.png";
import PencilIcon from "@/app/assets/edit.png";
import LikeHoverIcon from "@/app/assets/like-hover.png";
import LikeIcon from "@/app/assets/like.png";
import LinkIcon from "@/app/assets/link.png";
import SentIconHover from "@/app/assets/send-hover.png";
import SentIcon from "@/app/assets/send.png";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { comment, post, user } from "@prisma/client";
import { AvatarFallback } from "@radix-ui/react-avatar";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Earth, Ellipsis, Loader, Maximize2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { usePusher } from "../context/PusherContext";
import { formatDate } from "../utils/utils";
import CommentInput from "./comment-input";
import PostComment from "./comments";
import PreviewContainer from "./components/preview-container";

export type PostwithLiked = post & { user: user | null } & {
  commentCount: number;
  likeCount: number;
  likedByUser: boolean;
};

export type CommentsWithLiked = comment & { user: user } & {
  likeCount: number;
  likedByUser: boolean;
  replyCount: number;
};

interface FeedPostProps {
  post: PostwithLiked;
  user: user;
  setIsEditPost?: (value: boolean) => void;
  setReviewURL?: (value: any) => void;
}

const FeedPost = ({
  post,
  user,
  setIsEditPost,
  setReviewURL,
}: FeedPostProps) => {
  const url = `${window.location.href}`;
  const [currentUser, setCurrentUser] = useState<user | null>(null);
  const words = post.content ? post.content.split(" ") : "";
  const shouldTruncate = words.length > 20;
  const router = useRouter();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [iPost, setIPost] = useState<PostwithLiked | null>(post);
  const [comments, setComments] = useState<CommentsWithLiked[]>([]);
  //   const [comments, setComments] = useState([]);
  const [showFullText, setShowFullText] = useState(false);
  // const customToast = useShowToastWithCloseButton();
  const [isLikedHovered, setIsLikedHovered] = useState(false);
  const [isMesageHovered, setIsCommentHovered] = useState(false);
  const [isSentHovered, setIsSentHovered] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [review, setReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1); // Add state to track the current page
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null); // Cursor for pagination
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { subscribeToChannel, unsubscribeFromChannel, bindEvent, unbindEvent } =
    usePusher();

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const copyLink = (postId: string) => {
    const url = `${window.location.origin}/feed/post/${postId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy link to clipboard");
      });
  };

  useEffect(() => {
    if (!iPost?.id || !currentUser) return;

    const channelName = `post-${iPost.id}`;

    subscribeToChannel(channelName);

    // Bind "new-comment" event
    const handleNewComment = (data: unknown) => {
      const { comment } = data as { comment: CommentsWithLiked };
      setIPost((prev) => ({
        ...prev!,
        commentCount: prev!.commentCount + 1,
      }));
      setComments((prevComments) => [comment, ...prevComments]);
    };

    const handleNewReply = (data: unknown) => {
      setIPost((prev) => ({
        ...prev!,
        commentCount: prev!.commentCount + 1,
      }));
    };

    const handleDeleteReply = (data: unknown) => {
      setIPost((prev) => ({
        ...prev!,
        commentCount: prev!.commentCount - 1,
      }));
    };

    const handleDeleteComment = (data: unknown) => {
      const { commentId } = data as { commentId: string };

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      setIPost((prev) => ({
        ...prev!,
        commentCount: prev!.commentCount - 1,
      }));
    };

    // Bind the "handle-like" event
    const handleLike = (data: unknown) => {
      const { userId, action } = data as { userId: string; action: string };
      const likedUser = currentUser.id === userId;
      setIPost((prev) => ({
        ...prev!,
        likeCount: action !== "add" ? prev!.likeCount - 1 : prev!.likeCount + 1,
        likedByUser: !likedUser
          ? prev!.likedByUser
          : action === "add"
            ? true
            : false,
      }));
    };

    bindEvent(channelName, "new-comment", handleNewComment);
    bindEvent(channelName, "new-reply", handleNewReply);
    bindEvent(channelName, "handle-like", handleLike);
    bindEvent(channelName, "delete-comment", handleDeleteComment);
    bindEvent(channelName, "delete-reply", handleDeleteReply);

    // Cleanup: unbind events and unsubscribe from the channel
    return () => {
      unbindEvent(channelName, "new-comment");
      unbindEvent(channelName, "handle-like");
      unsubscribeFromChannel(channelName);
    };
  }, [iPost?.id, currentUser]);

  const handleLoadComments = async () => {
    if (!iPost?.id || loadingMore) return;

    setLoadingMore(true);

    try {
      const response = await axios.get(
        `/api/comment?postId=${iPost.id}&limit=3&cursor=${nextCursor || ""}`
      );

      if (response.status === 200) {
        const { comments, nextCursor: newNextCursor } = response.data;

        setComments((prevComments) => {
          // Avoid duplicates by filtering new comments
          const uniqueComments = comments?.filter(
            (comment: CommentsWithLiked) =>
              !prevComments.some((prev) => prev.id === comment.id)
          );
          // const uniqueComments = comments;
          return [...prevComments, ...uniqueComments];
        });

        // Update the cursor for the next fetch
        if (newNextCursor) {
          setNextCursor(newNextCursor);
        } else {
          setNextCursor(null); // No more comments
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (showCommentInput) {
      handleLoadComments();
    } else if (!showCommentInput) {
      setComments([]);
      setNextCursor(null);
    }
  }, [showCommentInput]);

  const handleLikePost = async () => {
    if (iPost?.id) {
      const isLike = iPost?.likedByUser;
      if (isLike === false) {
        const response = await axios.post(`/api/like?postId=${iPost.id}`);
        if (response.status !== 200) {
          console.log("Error updating like");
        }
      } else {
        const response = await axios.delete(`/api/like?postId=${iPost.id}`);
        if (response.status !== 200) {
          console.log("Error updating dislike");
        }
      }
    }
  };

  useEffect(() => {
    if (iPost?.preview_url) {
      setIsLoading?.(true);
      if (!iPost.preview_url.includes(window.location.origin)) {
        axios
          .get(`/api/fetchLinkPreview?url=${iPost.preview_url}`)
          .then((response) => {
            if (response.status === 200) {
              const { preview } = response.data;
              setReview(preview);
            }
          })
          .catch((error) => {
            console.error("Error fetching link preview:", error);
          })
          .finally(() => {
            setIsLoading?.(false);
          });
      } else {
        const jobId = iPost.preview_url.split("/").pop();
        axios
          .get(`/api/jobs/view/${jobId}`)
          .then((response) => {
            if (response.status === 200) {
              const { jobPost } = response.data;
              setReview({ ...jobPost, url: iPost.preview_url });
            }
          })
          .catch((error) => {
            console.error("Error fetching job post:", error);
          })
          .finally(() => {
            setIsLoading?.(false);
          });
      }
    }
  }, [iPost?.id]);

  if (isLoading) {
    return (
      <div className="mb-6 flex h-[250px] w-full flex-col justify-between rounded-lg border bg-gray-200 p-4">
        <div className="flex space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
          <div className="flex flex-col justify-center space-y-2">
            <Skeleton className="h-3 w-[150px] bg-gray-400" />
            <Skeleton className="h-3 w-[100px] bg-gray-400" />
          </div>
        </div>
        <div className="flex justify-around">
          <Skeleton className="h-2 w-[70px] bg-gray-400" />
          <Skeleton className="h-2 w-[70px] bg-gray-400" />
          <Skeleton className="h-2 w-[70px] bg-gray-400" />
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="mb-6 rounded-lg border-[1.5px] border-[#DADEE2] bg-white p-4 shadow-sm">
          <div className="flex justify-between">
            <Link
              href={`/in?userId=${iPost?.user_id}`}
              className="mb-4 flex cursor-pointer items-start space-x-2"
            >
              <Avatar className="size-14">
                <AvatarImage
                  src={iPost?.user?.image ?? ""}
                  className="size-14 rounded-full"
                />
                <AvatarFallback className="flex size-14 items-center justify-center bg-blue-300 text-2xl font-medium text-white">
                  {iPost?.user?.name.split(" ").pop()?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium hover:underline">
                  {iPost?.user?.name}
                </h3>
                <p className="text-xs text-gray-600">{iPost?.user?.headline}</p>
                <div className="flex items-center justify-start space-x-1">
                  <p className="text-xs text-gray-600">
                    {iPost?.created_at
                      ? formatDate(new Date(iPost.created_at))
                      : "N/A"}{" "}
                    <span className="text-lg">∙</span>
                  </p>
                  <Earth className="size-4" />
                </div>
              </div>
            </Link>
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full p-3 hover:bg-[#F4F2EE]"
                >
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute -right-6 flex w-[200px] flex-col items-center justify-start">
                {currentUser?.id === iPost?.user?.id && (
                  <Button
                    onClick={() => {
                      if (
                        url !==
                        `${window.location.origin}/feed/post/${iPost?.id}?isEdit=true`
                      ) {
                        router.push(`/feed/post/${iPost?.id}?isEdit=true`);
                      } else {
                        setIsEditPost?.(true);
                      }
                      setIsDropdownOpen(false);
                    }}
                    variant="ghost"
                    className="flex w-full items-center justify-start space-x-2"
                  >
                    <Image src={PencilIcon} alt="" className="size-5" />
                    <p>Edit</p>
                  </Button>
                )}
                <Button
                  onClick={() => {
                    copyLink(post.id);
                    setIsDropdownOpen(false);
                  }}
                  variant="ghost"
                  className="flex w-full items-center justify-start space-x-2"
                >
                  <Image src={LinkIcon} alt="" className="size-5" />
                  <p>Copy link</p>
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div
            style={{ whiteSpace: "pre-wrap" }}
            className="mb-6 text-sm text-gray-700"
          >
            {showFullText || !shouldTruncate ? (
              iPost?.content
            ) : (
              <>
                {Array.isArray(words) ? words.slice(0, 20).join(" ") : ""} ...
                <button
                  className="cursor-pointer text-gray-400 hover:text-blue-500 hover:underline"
                  onClick={() => setShowFullText(true)}
                >
                  Read more
                </button>
              </>
            )}
          </div>

          {iPost?.image_url && (
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex w-full cursor-pointer items-center justify-center rounded-lg border shadow-sm">
                  <Image
                    src={iPost?.image_url ?? ""}
                    alt=""
                    width={300}
                    height={100}
                    className="w-full object-cover"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[35%] bg-white p-0">
                <Image
                  src={iPost?.image_url ?? ""}
                  alt=""
                  width={300}
                  height={300}
                  className="z-10 w-full rounded-lg object-contain"
                />
              </DialogContent>
            </Dialog>
          )}
          {review && iPost?.preview_url && (
            <PreviewContainer data={review} isComment={false} />
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between">
            <div className="flex">
              <div className="flex size-6 items-center justify-center rounded-full bg-slate-300 text-gray-400">
                <Image src={LikeHoverIcon} className="size-4" alt="" />
              </div>
              <span className="ml-1 flex items-center text-sm">
                {iPost?.likeCount}
              </span>
            </div>
            <button
              onClick={() => setShowCommentInput(true)}
              className="cursor-pointer text-sm text-gray-400 hover:text-blue-600 hover:underline"
            >
              {iPost?.commentCount} comments
            </button>
          </div>
          <Separator className="mt-2" />
          <div className="mt-2 flex flex-wrap items-center justify-around">
            <Button
              onClick={handleLikePost}
              variant="ghost"
              className="mr-4 flex items-center transition-all duration-100 hover:scale-110"
              onMouseEnter={() => setIsLikedHovered(true)}
              onMouseLeave={() => setIsLikedHovered(false)}
            >
              {!isLikedHovered && !iPost?.likedByUser ? (
                <Image src={LikeIcon} alt="" className="size-6" />
              ) : (
                <Image src={LikeHoverIcon} className="size-7" alt="" />
              )}
              <span className="ml-1">Like</span>
            </Button>
            <Button
              onClick={() => {
                setShowCommentInput(!showCommentInput);
              }}
              variant="ghost"
              className="mr-4 flex items-center transition-all duration-100 hover:scale-110"
              onMouseEnter={() => setIsCommentHovered(true)}
              onMouseLeave={() => setIsCommentHovered(false)}
            >
              {!isMesageHovered && !showCommentInput ? (
                <Image src={CommentIcon} alt="" className="size-6" />
              ) : (
                <Image src={CommentIconHover} className="size-7" alt="" />
              )}
              <span className="ml-1">Comment</span>
            </Button>
            <Button
              onClick={() => {}}
              variant="ghost"
              className="mr-4 flex items-center transition-all duration-100 hover:scale-110"
              onMouseEnter={() => setIsSentHovered(true)}
              onMouseLeave={() => setIsSentHovered(false)}
            >
              {!isSentHovered ? (
                <Image src={SentIcon} alt="" className="size-6" />
              ) : (
                <Image src={SentIconHover} className="size-7" alt="" />
              )}
              <span className="ml-1">Send</span>
            </Button>
          </div>
          <AnimatePresence>
            {showCommentInput && (
              <div>
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CommentInput
                    post={iPost}
                    isEdit={false}
                    setPost={setIPost}
                    user={user}
                    setComments={setComments}
                  />
                </motion.div>
                <AnimatePresence>
                  {comments.length > 0 && (
                    <>
                      <motion.div
                        className="w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mt-6 w-full">
                          <div className="flex w-full flex-col space-y-8">
                            {comments?.map((comment, index) => (
                              <div key={comment?.id}>
                                <PostComment
                                  postUserId={iPost?.user?.id ?? ""}
                                  user={user}
                                  position={index}
                                  comment={comment}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                      {loadingMore ? (
                        <div className="mt-4 flex size-4 w-full items-center justify-center p-3">
                          <Loader className="size-5 animate-spin" />
                        </div>
                      ) : (
                        nextCursor && (
                          <div className="mt-4 flex items-center space-x-2">
                            <Button
                              variant={"ghost"}
                              className="text-s rounded-full bg-slate-100 p-3"
                              onClick={() => {
                                setPage(page + 1);
                                handleLoadComments();
                                setLoadingMore(true);
                              }}
                            >
                              <Maximize2 className="size-4" />
                            </Button>
                            <p
                              onClick={() => {
                                setPage(page + 1);
                                handleLoadComments();
                                setLoadingMore(true);
                              }}
                              className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium hover:bg-slate-100"
                            >
                              Load more comments
                            </p>
                          </div>
                        )
                      )}
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </div>
      </>
    );
  }
};

export default FeedPost;
