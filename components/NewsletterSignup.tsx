import React, { useState } from "react";
import { Button } from "./Button";

interface NewsletterSignupProps {
  title: string;
  description: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  title,
  description,
}) => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // در اینجا می‌توانید به API متصل شوید
    console.log("Subscribed with email:", email);
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <div className="bg-blue-50 rounded-lg p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="mb-6">{description}</p>
        
        {isSubscribed ? (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg">
            Thank you for subscribing!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="whitespace-nowrap"
            >
              Subscribe
            </Button>
          </form>
        )}
        
        <p className="text-sm text-gray-500 mt-4">
          We'll never share your email. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};