import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Globe } from "lucide-react";
import { useCurrency } from "@/providers/CurrencyContext";

function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [activeItem, setActiveItem] = useState("language");

  const handleClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Globe className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="max-w-6xl mb-10 max-h-[40rem] overflow-y-auto">
        <nav className="flex flex-col gap-10 text-sm p-6">
          <div className="flex gap-10 border-b">
            <p
              className={`cursor-pointer ${
                activeItem === "language"
                  ? "font-bold border-b-2 border-black pb-2"
                  : "text-gray-500 font-semibold"
              }`}
              onClick={() => handleClick("language")}
            >
              Language and region
            </p>
            <p
              className={`cursor-pointer ${
                activeItem === "currency"
                  ? "font-bold border-b-2 border-black pb-2"
                  : "text-gray-500 font-semibold"
              }`}
              onClick={() => handleClick("currency")}
            >
              Currency
            </p>
          </div>
          <div>
            {activeItem === "language" ? (
              <div className="flex flex-col gap-6">
                <div className="text-2xl font-semibold">
                  Choose a language and region
                </div>
                <div className="flex flex-col cursor-pointer hover:bg-gray-100 border border-black rounded-lg p-4 py-3 w-52">
                  <p className="font-semibold">English</p>
                  <p>United States</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="text-2xl font-semibold">Choose a currency</div>
                <div className="flex gap-4">
                  <div
                    className={`flex flex-col cursor-pointer hover:bg-gray-100 border border-black rounded-lg p-4 py-3 w-52 ${
                      currency === "USD" ? "bg-gray-200" : ""
                    }`}
                    onClick={() => {
                      setCurrency("USD");
                      window.location.reload();
                    }}
                  >
                    <p className="font-semibold">United States dollar</p>
                    <p>USD - $</p>
                  </div>
                  <div
                    className={`flex flex-col cursor-pointer hover:bg-gray-100 border border-black rounded-lg p-4 py-3 w-52 ${
                      currency === "ILS" ? "bg-gray-200" : ""
                    }`}
                    onClick={() => {
                      setCurrency("ILS");
                      window.location.reload();
                    }}
                  >
                    <p className="font-semibold">Israeli new shekel</p>
                    <p>ILS - ₪</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </DialogContent>
    </Dialog>
  );
}

export default CurrencySelector;
