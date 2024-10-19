import React, { useCallback, useEffect, useState } from "react";
import { IReview } from "@/types";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Star } from "lucide-react";
import ReviewList from "./ReviewList";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReviewsSectionProps {
  reviews: IReview[];
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  isDialogOpen,
  onDialogOpenChange,
}) => {
  const [sortingOption, setSortingOption] = useState<string>("Most recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReviews, setFilteredReviews] = useState<IReview[]>(reviews);
  const [mentionCount, setMentionCount] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsFilterApplied(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFilters();
      setIsFilterApplied(true);
    }
  };

  const calculateRatingForReview = useCallback((review: IReview): number => {
    const totalRatings = Object.values(review.rate).reduce(
      (acc, rating) => acc + rating,
      0
    );
    return totalRatings / Object.keys(review.rate).length;
  }, []);

  const sortReviews = useCallback(
    (reviewsToSort: IReview[], option: string) => {
      let sortedReviews: IReview[];

      switch (option) {
        case "Most recent":
          sortedReviews = [...reviewsToSort].sort(
            (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
          );
          break;
        case "Highest rated":
          sortedReviews = [...reviewsToSort].sort(
            (a, b) => calculateRatingForReview(b) - calculateRatingForReview(a)
          );
          break;
        case "Lowest rated":
          sortedReviews = [...reviewsToSort].sort(
            (a, b) => calculateRatingForReview(a) - calculateRatingForReview(b)
          );
          break;
        default:
          sortedReviews = [...reviewsToSort];
      }

      return sortedReviews;
    },
    [calculateRatingForReview]
  );

  const applyFilters = () => {
    // Filter reviews based on the search term
    const filtered = reviews.filter((review) =>
      review.txt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredReviews(sortReviews(filtered, sortingOption));
    setMentionCount(filtered.length); // Update mention count state
  };

  useEffect(() => {
    // Apply filters when sorting option changes or reviews change
    applyFilters();
  }, [sortingOption, reviews]);

  const handleSelectChange = (value: string) => {
    setSortingOption(value);
    setIsFilterApplied(false);
  };

  const limitedReviews = reviews.slice(0, 6);
  const totalReviews = reviews.length;

  const ratingCategories: { [key: string]: string } = {
    Cleanliness: "Cleanliness",
    Accuracy: "Accuracy",
    "Check-in": "Check-in",
    Communication: "Communication",
    Location: "Location",
    Value: "Value",
  };

  const initialRatings = {
    Cleanliness: 0,
    Accuracy: 0,
    "Check-in": 0,
    Communication: 0,
    Location: 0,
    Value: 0,
  };

  const totalRatings = { ...initialRatings };
  let reviewCount = 0;

  reviews.forEach((review) => {
    reviewCount++;
    Object.keys(totalRatings).forEach((key) => {
      totalRatings[key as keyof typeof totalRatings] +=
        review.rate[key as keyof typeof totalRatings];
    });
  });

  const averageRatings = Object.keys(totalRatings).reduce(
    (acc, key) => {
      acc[key as keyof typeof acc] = reviewCount
        ? totalRatings[key as keyof typeof totalRatings] / reviewCount
        : 0;
      return acc;
    },
    { ...initialRatings }
  );

  const calculateOverallAverageRating = () => {
    return (
      Object.values(totalRatings).reduce((acc, rating) => acc + rating, 0) /
      (reviewCount * Object.keys(initialRatings).length)
    );
  };

  return (
    <div className="mt-8">
      {/* Display reviews outside the dialog */}
      <ReviewList reviews={limitedReviews} />

      {totalReviews && (
        <div className="mt-4">
          <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
            <DialogContent className="max-w-5xl mb-10 overflow-y-auto px-12 ">
              <div className="flex">
                <div className="flex lg:w-1/3 gap-10">
                  {/* First Card - Rating Breakdown */}
                  <div className="mt-10 ">
                    <ScrollArea className="h-96">
                      <div className="flex items-center gap-1 mt-2 px-4">
                        <div className="flex items-center gap-2 mb-10">
                          <Star fill="black" className="w-8 h-8" />
                          <p className="text-4xl font-semibold">
                            {Number(calculateOverallAverageRating()).toFixed(1)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-col gap-4">
                          <div className="text-sm font-500 mr-6 mb-20 px-4">
                            Overall rating
                          </div>
                          {Object.entries(ratingCategories).map(
                            ([key, label], index) => (
                              <div
                                key={key}
                                className={`flex items-center px-4 mr-2 gap-4 w-72  ${
                                  index !==
                                  Object.entries(ratingCategories).length - 1
                                    ? "border-b border-gray-300 pb-3 px-6"
                                    : ""
                                }`}
                              >
                                {/* SVG for each category */}
                                <svg
                                  className=""
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 32 32"
                                  aria-hidden="true"
                                  role="presentation"
                                  focusable="false"
                                  style={{
                                    display: "block",
                                    height: "24px",
                                    width: "24px",
                                    fill: "currentColor",
                                  }}
                                >
                                  {/* Replace paths based on category */}
                                  {key === "Cleanliness" && (
                                    <path d="M24 0v6h-4.3c.13 1.4.67 2.72 1.52 3.78l.2.22-1.5 1.33a9.05 9.05 0 0 1-2.2-5.08c-.83.38-1.32 1.14-1.38 2.2v4.46l4.14 4.02a5 5 0 0 1 1.5 3.09l.01.25.01.25v8.63a3 3 0 0 1-2.64 2.98l-.18.01-.21.01-12-.13A3 3 0 0 1 4 29.2L4 29.02v-8.3a5 5 0 0 1 1.38-3.45l.19-.18L10 12.9V8.85l-4.01-3.4.02-.7A5 5 0 0 1 10.78 0H11zm-5.03 25.69a8.98 8.98 0 0 1-6.13-2.41l-.23-.23A6.97 6.97 0 0 0 6 21.2v7.82c0 .51.38.93.87 1H7l11.96.13h.13a1 1 0 0 0 .91-.88l.01-.12v-3.52c-.34.04-.69.06-1.03.06zM17.67 2H11a3 3 0 0 0-2.92 2.3l-.04.18-.01.08 3.67 3.1h2.72l.02-.1a4.29 4.29 0 0 1 3.23-3.4zM30 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-3-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-5 0h-2.33v2H22zm8-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM20 20.52a3 3 0 0 0-.77-2l-.14-.15-4.76-4.61v-4.1H12v4.1l-5.06 4.78a3 3 0 0 0-.45.53 9.03 9.03 0 0 1 7.3 2.34l.23.23A6.98 6.98 0 0 0 20 23.6z" />
                                  )}
                                  {key === "Accuracy" && (
                                    <path d="M16 1a15 15 0 1 1 0 30 15 15 0 0 1 0-30zm0 2a13 13 0 1 0 0 26 13 13 0 0 0 0-26zm7 7.59L24.41 12 13.5 22.91 7.59 17 9 15.59l4.5 4.5z" />
                                  )}
                                  {key === "Check-in" && (
                                    <path d="M16.84 27.16v-3.4l-.26.09c-.98.32-2.03.51-3.11.55h-.7A11.34 11.34 0 0 1 1.72 13.36v-.59A11.34 11.34 0 0 1 12.77 1.72h.59c6.03.16 10.89 5.02 11.04 11.05V13.45a11.3 11.3 0 0 1-.9 4.04l-.13.3 7.91 7.9v5.6H25.7l-4.13-4.13zM10.31 7.22a3.1 3.1 0 1 1 0 6.19 3.1 3.1 0 0 1 0-6.2zm0 2.06a1.03 1.03 0 1 0 0 2.06 1.03 1.03 0 0 0 0-2.06zM22.43 25.1l4.12 4.13h2.67v-2.67l-8.37-8.37.37-.68.16-.3c.56-1.15.9-2.42.96-3.77v-.64a9.28 9.28 0 0 0-9-9h-.55a9.28 9.28 0 0 0-9 9v.54a9.28 9.28 0 0 0 13.3 8.1l.3-.16 1.52-.8v4.62z" />
                                  )}
                                  {key === "Communication" && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 32 32"
                                      aria-hidden="true"
                                      role="presentation"
                                      focusable="false"
                                      style={{
                                        display: "block",
                                        height: "32px",
                                        width: "32px",
                                        stroke: "#333",
                                        strokeWidth: "2.66667",
                                      }}
                                    >
                                      <path
                                        d="M26 3a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-6.32L16 29.5 12.32 25H6a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z"
                                        fill="none"
                                      />
                                    </svg>
                                  )}
                                  {key === "Location" && (
                                    <path d="M30.95 3.81a2 2 0 0 0-2.38-1.52l-7.58 1.69-10-2-8.42 1.87A1.99 1.99 0 0 0 1 5.8v21.95a1.96 1.96 0 0 0 .05.44 2 2 0 0 0 2.38 1.52l7.58-1.69 10 2 8.42-1.87A1.99 1.99 0 0 0 31 26.2V4.25a1.99 1.99 0 0 0-.05-.44zM12 4.22l8 1.6v21.96l-8-1.6zM3 27.75V5.8l-.22-.97.22.97 7-1.55V26.2zm26-1.55-7 1.55V5.8l7-1.55z" />
                                  )}
                                  {key === "Value" && (
                                    <path d="M16.17 2a3 3 0 0 1 1.98.74l.14.14 11 11a3 3 0 0 1 .14 4.1l-.14.14L18.12 29.3a3 3 0 0 1-4.1.14l-.14-.14-11-11A3 3 0 0 1 2 16.37l-.01-.2V5a3 3 0 0 1 2.82-3h11.35zm0 2H5a1 1 0 0 0-1 .88v11.29a1 1 0 0 0 .2.61l.1.1 11 11a1 1 0 0 0 1.31.08l.1-.08L27.88 16.7a1 1 0 0 0 .08-1.32l-.08-.1-11-11a1 1 0 0 0-.58-.28L16.17 4zM9 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                  )}
                                </svg>
                                <p className="text-sm font-500 flex-1">
                                  {label}
                                </p>
                                <p className="text-xs font-semibold">
                                  {averageRatings[
                                    key as keyof typeof averageRatings
                                  ].toFixed(1)}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex w-full">
                      <div className="mt-[3rem] flex justify-between w-full">
                        <p className="text-2xl font-semibold">
                          {reviews.length} review
                          {reviews.length > 1 ? "s" : ""}
                        </p>
                        <Select onValueChange={handleSelectChange}>
                          <SelectTrigger className="rounded-3xl text-xs font-semibold w-32">
                            <SelectValue placeholder={sortingOption} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Most recent">
                              Most recent
                            </SelectItem>
                            <SelectItem value="Highest rated">
                              Highest rated
                            </SelectItem>
                            <SelectItem value="Lowest rated">
                              Lowest rated
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center border rounded-3xl p-2 shadow-sm w-[36rem] focus-within:border-black focus-within:border-2">
                      <Search className="w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search reviews"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        className="ml-2 outline-none border-none bg-transparent flex-grow text-sm"
                      />
                    </div>
                    {/* Display reviews inside the dialog */}
                    <ScrollArea className="h-64">
                      <div className="h-32">
                        {filteredReviews.length > 0 ? (
                          <>
                            <div className="mb-4">
                              {mentionCount > 0 &&
                                mentionCount < reviews.length && (
                                  <p className="text-sm font-semibold px-4 mt-8">
                                    {mentionCount} review
                                    {mentionCount > 1 ? "s" : ""} mentioned "
                                    {searchTerm}"
                                  </p>
                                )}
                            </div>

                            <ReviewList
                              reviews={filteredReviews}
                              searchTerm={searchTerm}
                              singleColumn={true}
                              isFilterApplied={isFilterApplied}
                            />
                          </>
                        ) : (
                          <div className="mt-4 flex flex-col gap-6 px-2">
                            <p className="text-sm font-600">
                              There are no results for '{searchTerm}'
                            </p>
                            <p className="text-sm text-gray-600">
                              Reviews translated from another language will not
                              appear. You can search in the original language.
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant={"outline"}
            className="mt-8 hover:bg-gray-50 p-6 border-black text-sm font-semibold"
            aria-label={`Show all ${totalReviews} reviews`}
            onClick={() => onDialogOpenChange(true)}
          >
            Show all {totalReviews} reviews
          </Button>
        </div>
      )}
      <hr className="mt-10 mb-10" />
    </div>
  );
};

export default ReviewsSection;
