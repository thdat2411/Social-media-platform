import { useEffect, useRef, useState } from "react";

interface RendererProps {
  value: string;
}

const Renderer = ({ value }: RendererProps) => {
  const renderRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const currentRef = renderRef.current;
    if (currentRef) {
      currentRef.innerHTML = value;
      const isEmpty = !value?.replace(/<(.|\n)*?>/g, "").trim().length;
      setIsEmpty(isEmpty);
    }
    return () => {
      if (currentRef) {
        currentRef.innerHTML = "";
      }
    };
  }, [value]);

  if (isEmpty) return null;

  return (
    <div ref={renderRef} className="ql-editor ql-renderer mt-4 text-justify" />
  );
};

export default Renderer;
