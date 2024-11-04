import { job_application } from "@prisma/client";
import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface CoverLetterProps {
  formData: job_application;
  setFormData: (data: job_application) => void;
}

const CoverLetter = ({ formData, setFormData }: CoverLetterProps) => {
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
      text = formData.cover_letter || "";
    }
    setQuillText(text);
    if (text !== formData.cover_letter) {
      setFormData({ ...formData, cover_letter: text });
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
            [{ font: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            [{ size: ["small", false, "large", "huge"] }],
          ],
        },
      };
      const quill = new Quill(containerRef.current, options);
      quillRef.current = quill;
      quillRef.current.root.innerHTML = formData.cover_letter || "";
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
      <div className="border border-black">
        <div
          ref={containerRef}
          style={{
            height: "300px",
          }}
          className="max-[500px]:w-full min-[500px]:w-[550px] min-[700px]:w-[550px] min-[800px]:w-[650px] min-[900px]:w-[720px]"
        />
      </div>
      <p className="mt-2 text-end text-muted-foreground max-[480px]:text-xs min-[450px]:text-sm">
        {wordCount}/2,000
      </p>
    </>
  );
};

export default CoverLetter;
