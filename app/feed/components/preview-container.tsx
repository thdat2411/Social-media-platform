/* eslint-disable @typescript-eslint/no-explicit-any */
import JobPostImage from "@/app/assets/posting-url-container.png";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CommentsWithLiked } from "../post";
interface PreviewContainerProps {
  data: any;
  isComment: boolean;
  setLinkPreview?: React.Dispatch<React.SetStateAction<any>>;
  isUserComment?: boolean;
  setEditData?: React.Dispatch<React.SetStateAction<CommentsWithLiked | null>>;
}

const PreviewContainer = ({
  data,
  isComment,
  isUserComment,
  setLinkPreview,
  setEditData,
}: PreviewContainerProps) => {
  return (
    <div className="flex w-full space-x-4 rounded-lg border bg-slate-100 p-4 shadow-md">
      {data.url.includes(window.location.origin) ? (
        <Link
          className="flex w-full items-center justify-between hover:cursor-pointer"
          href={data.url}
          target="_blank"
        >
          <div className="flex space-x-4">
            <Image
              src={JobPostImage}
              alt={data.title}
              width={60}
              height={60}
              className="aspect-auto rounded-lg object-contain"
            />
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{data.title}</p>
              <p className="text-xs">Job by {data.company_name}</p>
              <p className="text-xs">
                {data.location} ({data.workplace_type})
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-full text-xs outline outline-1 hover:outline-2"
          >
            View job post
          </Button>
        </Link>
      ) : (
        <>
          <Link
            className="flex items-center space-x-4 hover:cursor-pointer"
            href={data.url}
            target="_blank"
          >
            {data.images?.length > 0 && (
              <Image
                src={data.images[0]}
                alt={data.title}
                width={200}
                height={100}
                className={`aspect-auto w-[25%] rounded-lg object-contain`}
              />
            )}
            <div className="flex flex-col space-y-1">
              <div className={`text-sm font-semibold`}>{data.title}</div>
              <div className={`text-xs`}>{data.description}</div>
            </div>
          </Link>

          {isComment && !isUserComment && (
            <Button
              variant="ghost"
              className="z-10 rounded-full p-0 text-xs"
              onClick={() => {
                setLinkPreview?.(null);
                setEditData?.((prev) => {
                  return {
                    ...prev!,
                    preview_url: null,
                  };
                });
              }}
            >
              <X className="size-5" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default PreviewContainer;
