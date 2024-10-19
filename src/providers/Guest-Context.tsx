import React, { createContext, useContext, useState, ReactNode } from "react";

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface GuestContextProps {
  guestCounts: GuestCounts;
  setGuestCounts: React.Dispatch<React.SetStateAction<GuestCounts>>;
}

const GuestContext = createContext<GuestContextProps | undefined>(undefined);

export const GuestProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });

  return (
    <GuestContext.Provider value={{ guestCounts, setGuestCounts }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuestContext = (): GuestContextProps => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error("useGuestContext must be used within a GuestProvider");
  }
  return context;
};
