"use client";
import CommentIconHover from "@/app/assets/comment-post-hover.png";
import CommentIcon from "@/app/assets/comment-post.png";
import LikeHoverIcon from "@/app/assets/like-hover.png";
import LikeIcon from "@/app/assets/like.png";
import JobPostImage from "@/app/assets/posting-url-container.png";
import SentIconHover from "@/app/assets/send-hover.png";
import SentIcon from "@/app/assets/send.png";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { comment, post, user } from "@prisma/client";
import { AvatarFallback } from "@radix-ui/react-avatar";
import axios from "axios";
import { debounce } from "lodash";
import { Earth } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatDate } from "../utils/utils";
import CommentInput from "./comment-input";
import PostComment from "./comments";


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
}

const FeedPost = ({ post, user }: FeedPostProps) => {
  console.log(post);
  const words = post ? post.content.split(" ") : "";
  const shouldTruncate = words.length > 20;
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
  // const handleCommentSubmit = () => {
  //   // if (commentText.trim()) {
  //   //   setComments([...comments, commentText]);
  //   //   setCommentText("");
  //   //   setShowCommentInput(false); // Optionally hide the input after submitting
  //   // }
  // };

  // const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
  //   if (event.key === "Enter" && !event.shiftKey) {
  //     event.preventDefault(); // Prevent default Enter key behavior (newline)
  //     handleCommentSubmit();
  //   }
  // };
  const handleLoadComments = async () => {
    try {
      const response = await axios.get(`/api/comment?postId=${iPost?.id}`);
      if (response.status === 200) {
        const { comments } = response.data;
        setComments(comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const debounceUpdateLike = debounce(async (postId: string) => {
    const isLike = iPost?.likedByUser;
    if (isLike === false) {
      const response = await axios.put(
        `/api/like?action=Like&postId=${postId}`
      );
      if (response.status !== 200) {
        console.log("Error updating like");
      }
    } else {
      const response = await axios.put(
        `/api/like?action=Dislike&postId=${postId}`
      );
      if (response.status !== 200) {
        console.log("Error updating dislike");
      }
    }
  }, 2000);

  const handleLikePost = () => {
    const isLike = iPost?.likedByUser;
    setIPost({
      ...post,
      likedByUser: !isLike,
      likeCount: isLike
        ? (iPost?.likeCount ?? 0) - 1
        : (iPost?.likeCount ?? 0) + 1,
    });
    if (iPost?.id) {
      debounceUpdateLike(iPost.id); // Ensure this function handles debouncing correctly
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
  }, [post]);

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
      <div className="mb-6 rounded-lg border-[1.5px] border-[#DADEE2] bg-white p-4 shadow-sm">
        <Link
          href="#"
          className="mb-4 flex cursor-pointer items-center space-x-2"
        >
          <Avatar className="size-14">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold hover:underline">{iPost?.user?.name}</h3>
            <p className="text-sm text-gray-600">{iPost?.user?.bio}</p>
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
        <p className="mb-6 text-gray-700">
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
        </p>
        {iPost?.image_url && (
          <div className="flex w-full items-center justify-center rounded-lg border shadow-sm">
            <Image
              src={iPost?.image_url ?? ""}
              alt=""
              width={300}
              height={100}
              className="object-cover"
            />
          </div>
        )}
        {review && iPost?.preview_url && (
          <Link
            href={review.url}
            className="flex w-full space-x-4 rounded-lg border bg-slate-100 p-4 shadow-md"
            target="_blank"
          >
            {review.url.includes(window.location.origin) ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex space-x-4">
                  <Image
                    src={JobPostImage}
                    alt={review.title}
                    width={60}
                    height={60}
                    className="aspect-auto rounded-lg object-contain"
                  />
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{review.title}</p>
                    <p className="text-xs">Job by {review.company_name}</p>
                    <p className="text-xs">
                      {review.location} ({review.workplace_type})
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full text-xs outline outline-1 hover:outline-2"
                >
                  View job post
                </Button>
              </div>
            ) : (
              <>
                {review.images?.length > 0 && (
                  <Image
                    src={review.images[0]}
                    alt={review.title}
                    width={200}
                    height={100}
                    className="aspect-auto rounded-lg object-contain"
                  />
                )}
                <div className="flex flex-col space-y-1">
                  <div className="font-semibold">{review.title}</div>
                  <div className="text-sm">{review.description}</div>
                </div>
              </>
            )}
          </Link>
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
              handleLoadComments();
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

        {showCommentInput && (
          <div>
            <CommentInput post={iPost} isEdit={false} setPost={setIPost} />
            {comments.length > 0 && (
              <div className="mt-6 w-full">
                <div className="flex w-full flex-col space-y-8">
                  {comments?.map((comment, index) => (
                    <div key={comment.id}>
                      <PostComment
                        user={user}
                        position={index}
                        comment={comment}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
};

export default FeedPost;
