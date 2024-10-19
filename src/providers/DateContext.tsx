import React, { createContext, useState, ReactNode } from "react";
import { DateRange } from "@/types";

// Define the shape of the context
interface DateContextType {
  checkDates: DateRange | undefined;
  setCheckDates: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

// Create the context with default values
const DateContext = createContext<DateContextType | undefined>(undefined);

// Create the provider component
export const DateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [checkDates, setCheckDates] = useState<DateRange | undefined>(
    undefined
  );

  return (
    <DateContext.Provider value={{ checkDates, setCheckDates }}>
      {children}
    </DateContext.Provider>
  );
};

export default DateContext;
