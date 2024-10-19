import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface CountryData {
  dialCode: string;
  // Add other properties if needed
}

const CountryCodePhoneInput = () => {
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="">
      {/* First Input: Country Code Selector */}
      <PhoneInput
        country={"us"}
        value={countryCode}
        onChange={(value, country: CountryData) =>
          setCountryCode(`+${country.dialCode}`)
        }
        inputStyle={{
          width: "463px",
          height: "50px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          paddingLeft: "60px", // Adjust padding for flag
        }}
        buttonStyle={{
          border: "none",
          background: "transparent",
          padding: "0 15px",
        }}
        dropdownClass="rounded-lg shadow-lg"
      />

      {/* Second Input: Phone Number */}
      <input
        type="tel"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full h-12 px-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default CountryCodePhoneInput;
