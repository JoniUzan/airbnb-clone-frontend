import { calculateOverallAverageRating } from "@/lib/utils";
import { IHome } from "@/types";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { Star } from "lucide-react";
import { useState } from "react";
import HomeCarousel from "../general-components/HomeCarousel";
import { useCurrency } from "@/providers/CurrencyContext";
import { useLocation } from "react-router-dom";

export type Props = { points: IHome[] | undefined };

function HomesOnMap({ points }: Props) {
  const { currency,  } = useCurrency();
  const [openId, setOpenId] = useState<string | null>(null);
  const location = useLocation();

  const isHomeDetails = location.pathname.startsWith("/homes/");

  return (
    <>
      {points?.map((point) => {
        const position = {
          lat: point.loc.lat,
          lng: point.loc.lan,
        };

        return (
          <div key={point._id}>
            <AdvancedMarker
              position={position}
              onClick={() => !isHomeDetails && setOpenId(point._id)}
            >
              <div
                className={`${
                  isHomeDetails
                    ? "rounded-full bg-primary  "
                    : "p-2 rounded-full shadow-sm text-[16px] shadow-black font-montserrat font-600 transition-transform transform hover:scale-105"
                }
                  ${
                    openId === point._id
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
              >
                {isHomeDetails ? (
                  <svg
                    className="text-white bg-primary rounded-full p-2 "
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                    style={{
                      display: "block",
                      height: "45px",
                      width: "45px",
                      fill: "currentcolor",
                    }}
                  >
                    <path d="m8.94959955 1.13115419 5.71719515 4.68049298c.2120231.18970472.3332053.46073893.3332053.74524138v7.94311145c0 .2761424-.2238576.5-.5.5h-4.5v-5.5c0-.24545989-.17687516-.44960837-.41012437-.49194433l-.08987563-.00805567h-3c-.27614237 0-.5.22385763-.5.5v5.5h-4.5c-.27614237 0-.5-.2238576-.5-.5v-7.95162536c0-.28450241.12118221-.55553661.3502077-.75978249l5.70008742-4.65820288c.55265671-.45163993 1.34701168-.45132001 1.89930443.00076492z"></path>
                  </svg>
                ) : currency === "USD" ? (
                  `$${point.price}`
                ) : (
                  `₪${Math.round(point.price * 3.7)}`
                )}{" "}
              </div>
            </AdvancedMarker>
            {openId === point._id && (
              <InfoWindow
                position={position}
                onCloseClick={() => setOpenId(null)}
              >
                <div className="font-montserrat">
                  <HomeCarousel
                    images={point.imgUrls}
                    name={point.name}
                    homeId={point._id}
                    wishlistName=""
                    isHomePage={true}
                  />
                  <div className="flex justify-between items-center">
                    <p className="font-500">{point.loc.address}</p>
                    <div className="flex items-center gap-1">
                      <Star fill="black" width="14px" />
                      <p className="text-xs font-500">
                        {calculateOverallAverageRating(point.reviews)}
                      </p>
                    </div>
                  </div>
                  <p className="font-400">
                    <span className="font-500">
                      {" "}
                      {currency === "USD"
                        ? `$${point.price}`
                        : `₪${Math.round(point.price * 3.7)}`}{" "}
                    </span>{" "}
                    night
                  </p>
                </div>
              </InfoWindow>
            )}
          </div>
        );
      })}
    </>
  );
}

export default HomesOnMap;
