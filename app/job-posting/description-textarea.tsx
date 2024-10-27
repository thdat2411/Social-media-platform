import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useRef, useState } from "react";

import { job_posting } from "@prisma/client";

interface JobPostingDescriptionProps {
  setFormData: (data: job_posting) => void;
  formData: job_posting;
  isError: boolean;
}

const JobPostingDescription = ({
  setFormData,
  formData,
  isError,
}: JobPostingDescriptionProps) => {
  const [quillText, setQuillText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = useCallback(() => {
    let text = "";
    if (quillRef.current) {
      text = quillRef.current.root.innerHTML;
    } else {
      text = formData.description;
    }
    setQuillText(text);
    if (text !== formData.description) {
      setFormData({ ...formData, description: text });
    }

    const plainText = text
      ?.replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, "")
      .trim();
    const charCount = plainText?.length || 0;
    setWordCount(charCount);
  }, [quillText]); // TODO: Fix "React Hook useCallback has missing dependencies: 'formData' and 'setFormData'."

  useEffect(() => {
    setIsMounted(true);
    handleTextChange();
  }, []); // TODO: Fix "React Hook useEffect has a missing dependency: 'handleTextChange'."

  useEffect(() => {
    if (isMounted && containerRef.current && !quillRef.current) {
      const options: QuillOptions = {
        theme: "snow",
        placeholder: "",
        modules: {
          toolbar: [
            ["bold", "italic"],
            [{ list: "ordered" }, { list: "bullet" }],
          ],
        },
      };
      const quill = new Quill(containerRef.current, options);
      quillRef.current = quill;
      quillRef.current.root.innerHTML = formData.description;
      handleTextChange();
    }
    return () => {
      quillRef.current?.enable(false);
      quillRef.current?.off("text-change");
      quillRef.current = null;
    };
  }, [isMounted]); // TODO: Fix "React Hook useEffect has missing dependencies: 'formData.description' and 'handleTextChange'."

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.on("text-change", () => {
        handleTextChange();
      });
    }
  }, [quillText]); // TODO: Fix "React Hook useEffect has a missing dependency: 'handleTextChange'."

  return (
    <>
      <div
        className={` ${isError ? "border border-red-500" : "border border-black"} `}
      >
        <div
          ref={containerRef}
          style={{
            height: "400px",
          }}
          className="max-[500px]:w-full min-[500px]:w-[500px] min-[600px]:w-[500px] min-[700px]:w-[600px] min-[800px]:w-[700px] min-[900px]:w-[800px]"
        />
      </div>
      <p className="mt-2 text-end text-muted-foreground max-[480px]:text-xs min-[450px]:text-sm">
        {wordCount}/10,000
      </p>
    </>
  );
};

export default JobPostingDescription;
