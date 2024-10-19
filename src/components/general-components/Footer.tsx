import { useCurrency } from "@/providers/CurrencyContext";
import React from "react";
import CurrencySelector from "./CurrencySelector";

const Footer: React.FC = () => {
  const { currency,  } = useCurrency();

  return (
    <footer className="px-4 sm:px-6 md:px-8 lg:px-24 flex flex-col sm:flex-row justify-between items-center flex-wrap p-4 bg-gray-50 border-t border-gray-300 text-xs sm:text-sm md:text-base font-medium mt-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-2 mb-4 sm:mb-0">
        <span className="text-center sm:text-left">© 2024 Airbnb, Inc.</span>
        <div className="hidden sm:flex items-center space-x-2">
          <span>·</span>
          <p className="hover:underline cursor-pointer">Terms</p>
          <span>·</span>
          <p className="hover:underline cursor-pointer">Sitemap</p>
          <span>·</span>
          <p className="hover:underline cursor-pointer">Privacy</p>
          <span>·</span>
          <p className="hover:underline cursor-pointer">Your Privacy Choices</p>
        </div>
        <div className="flex sm:hidden space-x-2">
          <p className="hover:underline cursor-pointer">Terms</p>
          <span>·</span>
          <p className="hover:underline cursor-pointer">Privacy</p>
        </div>
        <svg width="26" height="12" fill="none" className="mt-2 sm:mt-0">
          <rect
            x="0.5"
            y="0.5"
            width="25"
            height="11"
            rx="5.5"
            fill="#fff"
          ></rect>
          <path d="M14 1h7a5 5 0 010 10H11l3-10z" fill="#06F"></path>
          <path
            d="M4.5 6.5l1.774 1.774a.25.25 0 00.39-.049L9.5 3.5"
            stroke="#06F"
            strokeLinecap="round"
          ></path>
          <path
            d="M16.5 3.5L19 6m0 0l2.5 2.5M19 6l2.5-2.5M19 6l-2.5 2.5"
            stroke="#fff"
            strokeLinecap="round"
          ></path>
          <rect
            x="0.5"
            y="0.5"
            width="25"
            height="11"
            rx="5.5"
            stroke="#06F"
          ></rect>
        </svg>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm">
        <span className="flex justify-center items-center gap-1">
          <CurrencySelector />
          <p className="">English (US)</p>
        </span>
        <span>{currency === "USD" ? "$USD" : "₪ILS"}</span>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a
            href="https://www.facebook.com/profile.php?id=100000412891557&locale=he_IL"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Navigate to Facebook"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-5 h-5 sm:w-6 sm:h-6"
              aria-hidden="true"
            >
              <path d="M30 0a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"></path>
              <path
                fill="#fff"
                d="M22.94 16H18.5v-3c0-1.27.62-2.5 2.6-2.5h2.02V6.56s-1.83-.31-3.58-.31c-3.65 0-6.04 2.21-6.04 6.22V16H9.44v4.62h4.06V32h5V20.62h3.73z"
              ></path>
            </svg>
          </a>
          <a
            href="#"
            aria-label="Navigate to Twitter"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-5 h-5 sm:w-6 sm:h-6"
              aria-hidden="true"
            >
              <path d="M32 4v24a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4z"></path>
              <path
                fill="#fff"
                d="M18.66 7.99a4.5 4.5 0 0 0-2.28 4.88A12.31 12.31 0 0 1 7.3 8.25a4.25 4.25 0 0 0 1.38 5.88c-.69 0-1.38-.13-2-.44a4.54 4.54 0 0 0 3.5 4.31 4.3 4.3 0 0 1-2 .06 4.64 4.64 0 0 0 4.19 3.13A8.33 8.33 0 0 1 5.8 23a12.44 12.44 0 0 0 19.32-11.19A7.72 7.72 0 0 0 27.3 9.5a8.3 8.3 0 0 1-2.5.75 4.7 4.7 0 0 0 2-2.5c-.87.5-1.81.87-2.81 1.06a4.5 4.5 0 0 0-5.34-.83z"
              ></path>
            </svg>
          </a>
          <a
            href="https://www.instagram.com/yuvalmaderer/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Navigate to Instagram"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-5 h-5 sm:w-6 sm:h-6"
              aria-hidden="true"
            >
              <path d="M30 0H2a2 2 0 0 0-2 2v28c0 1.1.9 2 2 2h28a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
              <path
                fill="#fff"
                d="M15.71 4h1.25c2.4 0 2.85.02 3.99.07 1.28.06 2.15.26 2.91.56.79.3 1.46.72 2.13 1.38.6.6 1.08 1.33 1.38 2.13l.02.06c.28.74.48 1.58.54 2.8l.01.4c.05 1.02.06 1.63.06 4.4v.92c0 2.6-.02 3.05-.07 4.23a8.78 8.78 0 0 1-.56 2.91c-.3.8-.77 1.53-1.38 2.13a5.88 5.88 0 0 1-2.13 1.38l-.06.02c-.74.28-1.59.48-2.8.53l-.4.02c-1.02.05-1.63.06-4.4.06h-.92a73.1 73.1 0 0 1-4.23-.07 8.78 8.78 0 0 1-2.91-.56c-.8-.3-1.53-.77-2.13-1.38a5.88 5.88 0 0 1-1.38-2.13l-.02-.06a8.84 8.84 0 0 1-.54-2.8l-.01-.37A84.75 84.75 0 0 1 4 16.29v-1c0-2.62.02-3.06.07-4.24.06-1.26.26-2.13.55-2.88l.01-.03c.3-.8.77-1.53 1.38-2.13a5.88 5.88 0 0 1 2.13-1.38l.06-.02a8.84 8.84 0 0 1 2.8-.54l.37-.01C12.39 4 12.99 4 15.71 4zm.91 2.16h-1.24c-2.3 0-2.91.01-3.81.05l-.42.02c-1.17.05-1.8.25-2.23.41-.56.22-.96.48-1.38.9-.4.41-.67.8-.88 1.35l-.03.06a6.7 6.7 0 0 0-.4 2.2l-.02.45c-.04.9-.05 1.53-.05 3.94v1.08c0 2.64.02 3.05.07 4.23v.07c.06 1.13.25 1.74.42 2.16.21.56.47.96.9 1.38.4.4.8.67 1.34.88l.06.03a6.7 6.7 0 0 0 2.2.4l.45.02c.9.04 1.53.05 3.94.05h1.08c2.64 0 3.05-.02 4.23-.07h.07a6.51 6.51 0 0 0 2.16-.42c.52-.19.99-.5 1.38-.9.4-.4.67-.8.88-1.34l.03-.06a6.7 6.7 0 0 0 .4-2.2l.02-.45c.04-.9.05-1.53.05-3.94v-1.09c0-2.63-.02-3.04-.07-4.22v-.07a6.51 6.51 0 0 0-.42-2.16c-.19-.52-.5-.99-.9-1.38a3.7 3.7 0 0 0-1.34-.88l-.06-.03a6.63 6.63 0 0 0-2.16-.4l-.46-.02c-.9-.04-1.5-.05-3.8-.05zM16 9.84a6.16 6.16 0 1 1 0 12.32 6.16 6.16 0 0 1 0-12.32zM16 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm6.4-3.85a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88z"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
