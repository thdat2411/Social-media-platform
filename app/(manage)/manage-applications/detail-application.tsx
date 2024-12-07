import { application } from "@/app/my-items/my-application/main-content";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import dynamic from "next/dynamic";
import React, { useState } from "react";

interface ManageDetailApplicationProps {
  application: application;
}

const Renderer = dynamic(() => import("@/app/components/renderer"), {
  ssr: false,
});

const ManageDetailApplication = ({
  application,
}: ManageDetailApplicationProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="h-[75vh] overflow-y-auto">
      <div className="flex flex-col">
        <div className="rounded-lg border p-6 shadow-sm">
          <Renderer value={application?.cover_letter ?? ""} />
          <div className="mt-6">
            <p className="mb-2 text-base font-medium">Attached CV:</p>
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

export default ManageDetailApplication;
