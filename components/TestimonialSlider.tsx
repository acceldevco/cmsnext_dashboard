import React, { useState } from "react";

interface Testimonial {
  name: string;
  comment: string;
  rating: number;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  testimonials,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      ));
  };

  return (
    <div className="bg-gray-50 py-12 px-4 rounded-lg">
      <div className="max-w-3xl mx-auto relative">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          <div className="mb-4">
            {renderStars(testimonials[currentIndex].rating)}
          </div>
          <blockquote className="text-lg italic mb-6">
            "{testimonials[currentIndex].comment}"
          </blockquote>
          <p className="font-medium">
            - {testimonials[currentIndex].name}
          </p>
        </div>
        
        <button
          onClick={prevTestimonial}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white p-2 rounded-full shadow"
          aria-label="Previous testimonial"
        >
          &lt;
        </button>
        <button
          onClick={nextTestimonial}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white p-2 rounded-full shadow"
          aria-label="Next testimonial"
        >
          &gt;
        </button>
        
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-black' : 'bg-gray-300'}`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};