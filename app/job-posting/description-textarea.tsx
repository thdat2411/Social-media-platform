import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormDataType } from "./main-content";

interface JobPostingDescriptionProps {
  setFormData: (data: FormDataType) => void;
  formData: FormDataType;
}

const JobPostingDescription = ({
  setFormData,
  formData,
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
    console.log("text", text);

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
  }, []);

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
      <div className="border border-black">
        <div ref={containerRef} style={{ height: "400px" }} />
      </div>
      <p className="text-end text-muted-foreground mt-2 text-sm">
        {wordCount}/10,000
      </p>
    </>
  );
};

export default JobPostingDescription;
