import React from "react";
import clsx from "clsx";
import NextImage from "next/image";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  layout?: "fixed" | "fill" | "intrinsic" | "responsive";
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  priority?: boolean;
  quality?: number;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

const roundedClasses = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  layout = "responsive",
  objectFit = "cover",
  priority = false,
  quality = 85,
  rounded = "none",
}) => {
  if (layout === "fill") {
    return (
      <div className={clsx("relative", className, roundedClasses[rounded])}>
        {src ? (
          <NextImage
            src={src}
            alt={alt}
            layout="fill"
            objectFit={objectFit}
            priority={priority}
            quality={quality}
            className={roundedClasses[rounded]}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className={clsx("inline-block", className, roundedClasses[rounded])}>
      {src ? (
        <NextImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          layout={layout}
          objectFit={objectFit}
          priority={priority}
          quality={quality}
          className={roundedClasses[rounded]}
        />
      ) : null}
    </div>
  );
};
