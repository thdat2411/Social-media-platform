import CompanyImage from "@/app/assets/company.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { job_posting } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "../utils/utils";

interface JobContainerProps {
  label: string;
  lists: job_posting[];
  index: number;
  item: job_posting;
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
        {label !== "job" ? (
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="size-14 rounded-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <Image
            src={CompanyImage}
            alt=""
            width={64}
            height={64}
            className="size-14"
          />
        )}
        <div className="flex flex-col space-y-1">
          <p className="text-lg font-semibold hover:underline">{item.title}</p>
          <p className="text-sm text-gray-600">{item.company_name}</p>
          <p className="text-sm text-muted-foreground">
            {item.location} (
            {item.workplace_type === "On-site" ? "On-site" : ""})
          </p>
          <p className="text-sm text-gray-600">
            {item.created_at ? formatDate(item.created_at) : "N/A"}
          </p>
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
