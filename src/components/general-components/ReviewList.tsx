// components/ReviewList.tsx

import React from "react";
import { IReview } from "@/types";

interface ReviewListProps {
  reviews: IReview[];
  limit?: number;
  singleColumn?: boolean;
  searchTerm?: string;
  isFilterApplied?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  limit,
  singleColumn,
  searchTerm,
  isFilterApplied,
}) => {
  const displayedReviews = limit ? reviews.slice(0, limit) : reviews;

  // Utility functions
  const calculateAverageRating = (ratings: { [key: string]: number }) => {
    const total = Object.values(ratings).reduce(
      (acc, rating) => acc + rating,
      0
    );
    const count = Object.values(ratings).length;
    return count ? total / count : 0;
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex">
        {Array(fullStars)
          .fill(null)
          .map((_, index) => (
            <StarIcon key={`full-${index}`} className="w-4 h-4" />
          ))}
        {hasHalfStar && <StarIcon key="half" className="w-4 h-4" />}
        {Array(emptyStars)
          .fill(null)
          .map((_, index) => (
            <StarIcon
              key={`empty-${index}`}
              className="w-4 h-4 text-gray-300"
            />
          ))}
      </div>
    );
  };

  const highlightText = (text: string) => {
    if (!isFilterApplied || !searchTerm) return text;

    // Create a regex pattern to match the search term, case-insensitive
    const pattern = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(pattern);

    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={index} className="bg-orange-300">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={`grid ${
        singleColumn ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
      } gap-4 `}
    >
      {displayedReviews.map((review, index) => {
        const averageRating = calculateAverageRating(review.rate);
        const reviewDate = new Date(review.at);
        const month = reviewDate.toLocaleString("default", { month: "long" });
        const year = reviewDate.getFullYear();

        return (
          <div key={index} className=" p-4">
            <div className="flex gap-4 mb-2 items-center">
              <img
                src={review.by.imgUrl}
                alt={review.by.fullname}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <p className="font-semibold">{review.by.fullname}</p>
                <p className="text-xs">{`Airbnb member`}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                {renderStars(averageRating)}
              </div>
              <p className="text-sm font-500">{`${month} ${year}`}</p>
            </div>
            <p className="text-sm font-500 max-w-96">
              {highlightText(review.txt)}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2.25l2.25 4.5 4.95.72-3.57 3.48.84 4.92-4.42-2.32-4.42 2.32.84-4.92-3.57-3.48 4.95-.72L12 2.25z" />
  </svg>
);

export default ReviewList;
