import React, { useEffect, useRef, useState } from "react";

interface RendererProps {
  value: string;
}

const Renderer = ({ value }: RendererProps) => {
  const renderRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (renderRef.current) {
      renderRef.current.innerHTML = value;
      const isEmpty = !value.replace(/<(.|\n)*?>/g, "").trim().length;
      setIsEmpty(isEmpty);
    }
    return () => {
      if (renderRef.current) {
        renderRef.current.innerHTML = "";
      }
    };
  }, [value]);

  if (isEmpty) return null;

  return (
    <div ref={renderRef} className="ql-editor ql-renderer mt-4 text-justify" />
  );
};

export default Renderer;
