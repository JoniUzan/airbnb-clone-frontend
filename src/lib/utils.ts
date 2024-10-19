import { IReview } from "@/types";
import { type ClassValue, clsx } from "clsx"
import { SetURLSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const updateSearchParams = (
  newParams: Record<string, string | undefined>,
  searchParams: URLSearchParams,
  setSearchParams: SetURLSearchParams
) => {
  const currentParams = Object.fromEntries(searchParams.entries());
  const mergedParams = { ...currentParams, ...newParams };

  // Remove any keys with undefined values (optional)
  Object.keys(mergedParams).forEach(
    (key) => mergedParams[key] === undefined && delete mergedParams[key]
  );

  // Compare the current and merged parameters excluding the "page" key
  const currentParamsWithoutPage = Object.fromEntries(
    Object.entries(currentParams).filter(([key]) => key !== 'page')
  );
  const mergedParamsWithoutPage = Object.fromEntries(
    Object.entries(mergedParams).filter(([key]) => key !== 'page')
  );
  

  // Check if the "page" parameter is present and skip if so
  if (
    Number(mergedParams.page) > 1 &&
    JSON.stringify(currentParamsWithoutPage) !== JSON.stringify(mergedParamsWithoutPage)
  ) {
    mergedParams.page = "1";
  }

  // Convert mergedParams back to URLSearchParams
  const searchParamsObject = new URLSearchParams(
    mergedParams as Record<string, string>
  );

  setSearchParams(searchParamsObject);
};


export const calculateOverallAverageRating = (reviews: IReview[]) => {
  let totalRating = 0;
  const numCategories = 6;
  reviews.forEach((review) => {
    totalRating += review.rate.Accuracy;
    totalRating += review.rate["Check-in"];
    totalRating += review.rate.Cleanliness;
    totalRating += review.rate.Communication;
    totalRating += review.rate.Location;
    totalRating += review.rate.Value;
  });
  const overallAverage = (
    totalRating /
    (numCategories * reviews.length)
  ).toFixed(1);
  return overallAverage;
};