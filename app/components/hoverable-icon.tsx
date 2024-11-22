import React, { useEffect, useRef } from "react";

interface HoverableIconProps {
  iconHover: string;
  isHovered: boolean;
  className?: string;
}

const HoverableIcon = ({
  iconHover,
  isHovered,
  className,
}: HoverableIconProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return <video ref={videoRef} src={iconHover} muted className={className} />;
};

export default HoverableIcon;
