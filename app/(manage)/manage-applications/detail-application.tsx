import ArrowBackIcon from "@/app/assets/arrow-left.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { job_application, user } from "@prisma/client";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { format } from "date-fns";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";

interface DetailApplicationProps {
  application: (job_application & { user: user }) | null;
  setIsDetail?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Renderer = dynamic(() => import("@/app/components/renderer"), {
  ssr: false,
});

export const DetailApplication = ({
  application,
  setIsDetail,
}: DetailApplicationProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="h-[75vh] overflow-y-auto p-5">
      <div
        className="mb-10 flex cursor-pointer items-center space-x-3 hover:underline"
        onClick={() => setIsDetail?.(false)}
      >
        <Image
          src={ArrowBackIcon}
          alt="Back"
          width={20}
          height={20}
          className="size-8"
        />
        <p className="text-base text-gray-600 hover:font-medium hover:text-black">
          Back
        </p>
      </div>
      <div className="flex flex-col">
        <div className="rounded-lg border p-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <Avatar className="size-12">
              <AvatarImage
                src={application?.user?.image ?? ""}
                className="rounded-full"
              />
              <AvatarFallback className="size-12 bg-blue-300 text-lg font-medium text-white">
                {application?.user.name.split(" ").pop()?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-base font-medium">{application?.user.name}</p>
              {application?.user?.bio && (
                <p className="text-sm text-muted-foreground">
                  {application?.user.bio}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {application?.created_at
                  ? format(new Date(application.created_at), "MM/dd/yyyy")
                  : "N/A"}
              </p>
            </div>
          </div>
          <Renderer value={application?.cover_letter ?? ""} />
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Attached CV:</p>
            <div>
              {/* PDF Preview */}
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div
                  className="w-[306px] cursor-pointer"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Viewer
                    fileUrl={application?.resume_url ?? ""}
                    defaultScale={0.5}
                  />
                </div>
              </Worker>

              {/* Full-Screen Button */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="h-[90%] w-full max-w-5xl overflow-auto p-0">
                  <div className="z-10">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={application?.resume_url ?? ""}
                        defaultScale={1}
                        plugins={[defaultLayoutPluginInstance]}
                      />
                    </Worker>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailApplication;
