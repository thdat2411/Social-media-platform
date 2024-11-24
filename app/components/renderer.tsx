import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";

interface RendererProps {
  value: string;
}

const Renderer = ({ value }: RendererProps) => {
  const renderRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !renderRef.current) return;
    const container = renderRef.current;
    const quill = new Quill(document.createElement("div"), {
      theme: "snow",
    });
    quill.enable(false);
    const contents = quill.clipboard.convert({ html: value });
    quill.setContents(contents);
    const isEmpty = !value?.replace(/<(.|\n)*?>/g, "").trim().length;
    setIsEmpty(isEmpty);
    container.innerHTML = quill.root.innerHTML;
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [value]);

  if (isEmpty) return null;

  return (
    <div ref={renderRef} className="ql-editor ql-renderer mt-4 text-justify" />
  );
};

export default Renderer;
