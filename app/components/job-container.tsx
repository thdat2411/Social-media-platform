import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Lists } from "../search/main-content";

interface JobContainerProps {
  label: string;
  lists: Lists[];
  index: number;
  item: Lists;
}

const JobContainer = ({ index, item, label, lists }: JobContainerProps) => {
  return (
    <Link
      key={index}
      href="#"
      className={`mr-3 flex items-start justify-between border-b-2 border-b-[#DADEE2] p-4 ${
        index === lists.length - 1 ? "border-none" : ""
      }`}
    >
      <div className="flex space-x-4">
        {label !== "Jobs" ? (
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="size-14 rounded-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <Image
            src="https://github.com/shadcn.png"
            alt="Profile picture"
            // width={64}
            // height={64}
            className="size-16"
          />
        )}
        <div className="flex flex-col space-y-1">
          <p className="text-lg font-semibold hover:underline">{item.label}</p>
          <p className="text-sm text-gray-600">{item.hiringName}</p>
          <p className="text-sm text-gray-600">{item.location}</p>
          <p className="text-sm text-gray-600">{item.createdAt}</p>
        </div>
      </div>
      <Button
        variant="outline"
        className="flex items-center rounded-full border-blue-600 font-semibold text-blue-600 hover:border-2 hover:border-blue-800 hover:text-blue-600"
      >
        Save
      </Button>
    </Link>
  );
};

export default JobContainer;
