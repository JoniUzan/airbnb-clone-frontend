import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

type CardProps = {
  title: string;
  paragraph: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  isDecrementDisabled?: boolean;
};

export const Card: React.FC<CardProps> = ({
  title,
  paragraph,
  count,
  onIncrement,
  onDecrement,
  isDecrementDisabled = false,
}) => {
  return (
    <div className="flex items-center justify-between p-4 w-full ">
      <div className="">
        <h3 className="font-500 text-lg">{title}</h3>
        <p className="text-gray-600 text-sm">{paragraph}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDecrement();
          }}
          disabled={isDecrementDisabled}
          variant="outline"
          className=" rounded-full text-xl px-[11px]"
        >
          <Minus size={"17px"} />
        </Button>
        <span className="text-lg font-[500]">{count}</span>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onIncrement();
          }}
          variant="outline"
          className=" px-[11px]  rounded-full"
        >
          <Plus size={"17px"} />
        </Button>
      </div>
    </div>
  );
};

export default Card;
