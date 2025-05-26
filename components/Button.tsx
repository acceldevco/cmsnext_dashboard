import React from "react";
import clsx from "clsx";
import Link from "next/link";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variantClasses = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-500",
  secondary:
    "bg-gray-800 hover:bg-gray-900 text-white shadow-sm focus:ring-gray-500",
  outline:
    "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-sm focus:ring-blue-500",
  ghost: "hover:bg-gray-100 text-gray-700 focus:ring-blue-500",
  link: "text-blue-600 hover:text-blue-800 focus:ring-blue-500",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  href,
  onClick,
  children,
  className = "",
  type = "button",
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
}) => {
  const baseClasses = clsx(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    variantClasses[variant],
    sizeClasses[size],
    {
      "w-full": fullWidth,
      "opacity-50 cursor-not-allowed": disabled,
      "gap-2": icon,
    },
    className
  );

  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        onClick={onClick}
        aria-disabled={disabled}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
};