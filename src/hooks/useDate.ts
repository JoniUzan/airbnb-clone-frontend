import { useContext } from "react";


import DateContext from "@/providers/DateContext";
import { DateRange } from "@/types";

interface DateContextType {
    checkDates: DateRange | undefined;
    setCheckDates: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  }

export const useDate = (): DateContextType => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};
