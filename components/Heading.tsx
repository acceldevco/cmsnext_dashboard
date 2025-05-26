import React from "react";
import clsx from "clsx";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps {
  as?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

const sizeClasses = {
  h1: "text-4xl md:text-5xl font-extrabold",
  h2: "text-3xl md:text-4xl font-bold",
  h3: "text-2xl md:text-3xl font-semibold",
  h4: "text-xl md:text-2xl font-medium",
  h5: "text-lg md:text-xl font-medium",
  h6: "text-base md:text-lg font-medium",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const Heading: React.FC<HeadingProps> = ({
  as = "h2",
  children,
  className = "",
  align = "left",
}) => {
  const Tag = as;

  return (
    <Tag
      className={clsx(
        sizeClasses[as],
        alignClasses[align],
        "mb-4 text-gray-900 dark:text-white",
        className
      )}
    >
      {children}
    </Tag>
  );
};