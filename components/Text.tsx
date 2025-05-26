import React from "react";
import clsx from "clsx";

interface TextProps {
  size?: "sm" | "md" | "lg" | "xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
  color?: "primary" | "secondary" | "muted" | "error" | "success";
  children: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const weightClasses = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const colorClasses = {
  primary: "text-gray-900 dark:text-white",
  secondary: "text-gray-700 dark:text-gray-300",
  muted: "text-gray-500 dark:text-gray-400",
  error: "text-red-600 dark:text-red-400",
  success: "text-green-600 dark:text-green-400",
};

export const Text: React.FC<TextProps> = ({
  size = "md",
  weight = "normal",
  align = "left",
  color = "primary",
  children,
  className = "",
}) => {
  return (
    <p
      className={clsx(
        sizeClasses[size],
        weightClasses[weight],
        alignClasses[align],
        colorClasses[color],
        "leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  );
};