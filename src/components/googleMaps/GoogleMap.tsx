import { useState } from "react";
import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
import HomesOnMap from "./PointsOnMap";
import { IHome } from "@/types";

const googleApiKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface GoogleMapProps {
  homes: IHome[] | undefined;
  position: { lat: number; lng: number };
  zoom?: number;
  width?: string;
  scroll?: string;
}

export default function GoogleMap({
  homes,
  position,
  zoom = 11,
  width = "60%",
  scroll = "greedy",
}: GoogleMapProps) {
  const [open, setOpen] = useState(false);

  if (!googleApiKey) return;

  return (
    <APIProvider apiKey={googleApiKey}>
      <div
        className="h-[75vh] sticky top-[200px] hidden sm:hidden md:hidden lg:block"
        style={{ width: width }} // Use inline style for dynamic width
      >
        <Map
          defaultZoom={zoom}
          defaultCenter={position}
          mapId={"aa21e74a7cd52a60"}
          fullscreenControl={false}
          gestureHandling={scroll}
        >
          {open && (
            <InfoWindow
              position={position}
              onCloseClick={() => setOpen(false)}
            ></InfoWindow>
          )}
          <HomesOnMap points={homes} />
        </Map>
      </div>
    </APIProvider>
  );
}
