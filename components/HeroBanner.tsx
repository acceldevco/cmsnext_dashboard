import React from "react";
import { Button } from "@measured/puck/components";
import Image from "next/image";

interface HeroBannerProps {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  image,
  ctaText,
  ctaUrl,
}) => {
  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl mb-6">{subtitle}</p>
          <Button href={ctaUrl} variant="primary">
            {ctaText}
          </Button>
        </div>
        <div className="md:w-1/2">
          <Image
            src={image}
            alt={title}
            width={800}
            height={500}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
};