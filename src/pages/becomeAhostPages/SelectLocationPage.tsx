import { useEffect, useState } from "react";
import LocationForm from "@/components/becomeAhostComponents/LocationForm";
import LocationMap from "@/components/becomeAhostComponents/LocationMap";
import { LatLng } from "use-places-autocomplete";
import {
  useSearchParams,
} from "react-router-dom"
function SelectLocationPage() {
  const [address, setAddress] = useState<string>("");
  const [country, setCountry] = useState<string>("US");
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [selected, setSelected] = useState<LatLng | null>(null);
  const [, setSearchParams] = useSearchParams({ step: "" });

  useEffect(() => setSearchParams({ step: "" }), []);

  const setLocationData = (address: string, locationData: any) => {
    setAddress(address);
    const countryComponent = locationData.find((comp: any) =>
      comp.types.includes("country")
    );
    const cityComponent = locationData.find((comp: any) =>
      comp.types.includes("locality")
    );
    const streetComponent = locationData.find((comp: any) =>
      comp.types.includes("route")
    );

    if (countryComponent) setCountry(countryComponent.short_name);
    if (cityComponent) setCity(cityComponent.long_name);
    if (streetComponent) setStreet(streetComponent.long_name);
  };

  return (
    <div className="h-screen grid place-items-center pb-[400px] mb-[200px] p-8">
      <div className=" space-y-10 w-full h-full max-w-[660px] max-h-[600px] ">
        <div>
          <h1 className="text-3xl font-[500]">Where's your place located?</h1>
          <p className="text-lg text-[#9d9d9d] mb-10">
            Your address is only shared with guests after they’ve made a
            reservation.
          </p>
        </div>
        {selected && (
          <LocationForm
            address={address}
            setAddress={setAddress}
            country={country}
            setCountry={setCountry}
            street={street}
            setStreet={setStreet}
            city={city}
            setCity={setCity}
          />
        )}
        <LocationMap
          selected={selected}
          setSelected={setSelected}
          setLocationData={setLocationData}
        />
      </div>
    </div>
  );
}

export default SelectLocationPage;
