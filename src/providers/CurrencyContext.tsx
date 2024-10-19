import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Define types for context value
interface CurrencyContextType {
  currency: "USD" | "ILS";
  setCurrency: (newCurrency: "USD" | "ILS") => void;
}

// Create the context with default values
const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize currency from localStorage or default to "USD"
  const [currency, setCurrency] = useState<"USD" | "ILS">(() => {
    return (localStorage.getItem("currency") as "USD" | "ILS") || "USD";
  });

  // Save currency to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use the Currency context
export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
