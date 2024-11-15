import React from "react";

interface LorderProps {
  variant: "page" | "button";
}

function Loader({ variant = "page" }: LorderProps) {
  return (
    <div>
      <div className="w-full gap-x-2 flex justify-center items-center">
        {variant === "page" ? (
          <>
            <div className="w-5 h-5 animate-pulse bg-black rounded-full animate-bounce"></div>
            <div className="w-5 h-5 animate-pulse bg-black rounded-full animate-bounce"></div>
            <div className="w-5 h-5 animate-pulse bg-black rounded-full animate-bounce"></div>
          </>
        ) : (
          <>
            <div className="w-5 h-5 animate-pulse bg-white rounded-full animate-bounce"></div>
            <div className="w-5 h-5 animate-pulse bg-white rounded-full animate-bounce"></div>
            <div className="w-5 h-5 animate-pulse bg-white rounded-full animate-bounce"></div>
          </>
        )}
      </div>
    </div>
  );
}

export default Loader;
