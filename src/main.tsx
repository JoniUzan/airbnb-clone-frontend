import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { DayPickerProvider, DayPickerProps } from "react-day-picker";
import { AuthProvider } from "./providers/user.context.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { GuestProvider } from "./providers/Guest-Context.tsx";
import { DateProvider } from "./providers/DateContext.tsx";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/http.ts";
import { CurrencyProvider } from "./providers/CurrencyContext.tsx";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
script.async = true;
script.defer = true;
document.head.appendChild(script);

const dayPickerProps: DayPickerProps = {
  // Add any initial DayPicker props you need here
};

const googleId: string = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!googleId) {
  console.error("Google Client ID is not defined");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DayPickerProvider initialProps={dayPickerProps}>
        <AuthProvider>
          <GuestProvider>
            <DateProvider>
              <CurrencyProvider>
                <GoogleOAuthProvider clientId={googleId}>
                  <QueryClientProvider client={queryClient}>
                    <App />
                    <Toaster />
                  </QueryClientProvider>
                </GoogleOAuthProvider>
              </CurrencyProvider>
            </DateProvider>
          </GuestProvider>
        </AuthProvider>
      </DayPickerProvider>
    </BrowserRouter>
  </StrictMode>
);
