import React from 'react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ImageSliderProps {
  title?: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
  autoplay?: boolean;
  interval?: number;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  title,
  images,
  autoplay = true,
  interval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoplay && images.length > 1) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoplay, images.length, interval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % images.length
    );
  };

  if (!images || images.length === 0) {
    return <div className="text-center p-4 text-gray-500">No images to display</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto relative rounded-2xl shadow-lg bg-white/80 backdrop-blur-md p-4 md:p-6">
      {title && <h3 className="text-2xl font-extrabold mb-4 text-center text-blue-700 drop-shadow-sm">{title}</h3>}
      <div className="relative overflow-hidden rounded-xl group">
        <div
          className="flex transition-transform duration-700 ease-in-out h-56 sm:h-72 md:h-96"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
              <div className="w-full h-56 sm:h-72 md:h-96 relative">
                {image.src ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-contain object-center rounded-xl shadow-md"
                    priority={index === currentIndex}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-blue-100 p-2 md:p-3 rounded-full shadow-lg z-10 transition-colors duration-200 border border-blue-200"
          aria-label="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-blue-100 p-2 md:p-3 rounded-full shadow-lg z-10 transition-colors duration-200 border border-blue-200"
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        {/* Gradient overlays for better contrast */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/80 to-transparent"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent"></div>
      </div>
      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="flex justify-center mt-5 gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full border-2 border-blue-300 transition-all duration-200 ${currentIndex === index ? 'bg-blue-600 scale-110 shadow-lg' : 'bg-gray-200 hover:bg-blue-200'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
