import { job_posting } from "@prisma/client";
import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useRef, useState } from "react";

interface JobPostingDescriptionProps {
  setFormData: (data: job_posting) => void;
  formData: job_posting;
  isError: boolean;
  triggerTypingAnimation: boolean;
  setTriggerTypingAnimation: (value: boolean) => void;
  setIsAILoading: (value: boolean) => void;
}

const JobPostingDescription = ({
  setFormData,
  formData,
  isError,
  triggerTypingAnimation,
  setTriggerTypingAnimation,
  setIsAILoading,
}: JobPostingDescriptionProps) => {
  console.log("Init: ", formData);
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const formDataRef = useRef(formData);

  const [isExecuting, setIsExecuting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const isTypingRef = useRef(false);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const updateFormData = useCallback(
    (text: string) => {
      setFormData({
        ...formDataRef.current,
        description: text,
      });
      console.log("Check: ", formDataRef.current);
    },
    [setFormData]
  );

  // Calculate word count
  const calculateWordCount = useCallback((text: string) => {
    const plainText = text
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, "")
      .trim();
    return plainText.length || 0;
  }, []);

  // Setup Quill editor
  useEffect(() => {
    if (isMounted && containerRef.current && !quillRef.current) {
      const options: QuillOptions = {
        theme: "snow",
        placeholder: "",
        modules: {
          toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, 3, 4, 5, 6] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link"],
            [{ size: ["small", "large", "huge"] }],
          ],
        },
      };

      const quill = new Quill(containerRef.current, options);
      quillRef.current = quill;

      quillRef.current.root.innerHTML = formData.description;

      quillRef.current.on("text-change", () => {
        if (quillRef.current) {
          const currentText = quillRef.current.root.innerHTML;

          if (!isTypingRef.current) {
            const count = calculateWordCount(currentText);
            setWordCount(count);

            updateFormData(currentText);
          }
        }
      });
    }

    return () => {
      quillRef.current?.off("text-change");
      quillRef.current?.enable(false);
      quillRef.current = null;
    };
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const startTypingAnimation = useCallback(() => {
    if (
      isExecuting ||
      !quillRef.current ||
      !formData.description ||
      hasAnimated
    )
      return;

    isTypingRef.current = true;
    setIsExecuting(true);
    setHasAnimated(true);

    const description = formData.description;
    const linesToType = description.split("\n");

    let lineIndex = 0;
    let wordIndex = 0;
    let typingIndex = 0;

    quillRef.current.root.innerHTML = ""; // Clear the editor initially

    const typeNextWord = () => {
      if (lineIndex < linesToType.length) {
        const line = linesToType[lineIndex];
        const isListItem = line.startsWith("*");
        const formattedLine = isListItem ? line.slice(1).trim() : line;
        const wordsInLine = formattedLine.split(" ");

        if (wordIndex < wordsInLine.length) {
          const currentWord = wordsInLine[wordIndex];
          quillRef.current?.insertText(
            typingIndex,
            currentWord + " ",
            isListItem ? { list: "bullet" } : {}
          );
          typingIndex += currentWord.length + 1;
          wordIndex++;
          setTimeout(typeNextWord, 50);
        } else {
          quillRef.current?.insertText(
            typingIndex,
            "\n",
            isListItem ? { list: "bullet" } : {}
          );
          typingIndex += 1;
          lineIndex++;
          wordIndex = 0;
          setTimeout(typeNextWord, 50);
        }
      } else {
        isTypingRef.current = false;
        setIsExecuting(false);
        setTriggerTypingAnimation(false);

        // Update word count and form data after animation
        if (quillRef.current) {
          const finalText = quillRef.current.root.innerHTML;
          const count = calculateWordCount(finalText);
          setWordCount(count);
          updateFormData(finalText);
        }
      }
    };

    typeNextWord();
  }, [isExecuting, formData, hasAnimated, setTriggerTypingAnimation]);

  useEffect(() => {
    if (triggerTypingAnimation && !isExecuting && !hasAnimated) {
      startTypingAnimation();
      setIsAILoading(true);
    } else if (!triggerTypingAnimation) {
      setHasAnimated(false);
      setIsAILoading(false);
    }
  }, [triggerTypingAnimation, startTypingAnimation, isExecuting, hasAnimated]);

  return (
    <>
      <div
        className={` ${isError ? "border border-red-500" : "border border-black"} `}
      >
        <div
          ref={containerRef}
          style={{
            height: "350px",
          }}
          className="w-full"
        />
      </div>
      <p className="mt-2 text-end text-muted-foreground max-[480px]:text-xs min-[450px]:text-sm">
        {wordCount}/10,000
      </p>
    </>
  );
};

export default JobPostingDescription;
