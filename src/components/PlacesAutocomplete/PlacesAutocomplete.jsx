import { useRef } from "react";
import "./PlacesAutocomplete.css";
import { useEffect } from "react";
import { useState } from "react";
import { useGoogleMaps } from "../../context/GoogleMapsContext";

const PlacesAutocomplete = ({ onAddressChange }) => {
  const [autocomplete, setAutocomplete] = useState();
  const {map, libraryLoader, google} = useGoogleMaps()

  useEffect(() => {
    init();
  }, [libraryLoader]);

  const init = async () => {
    // const { Autocomplete } = await google.maps.importLibrary("places");
    const { Autocomplete } = await libraryLoader.importLibrary("places");

    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
    };
    const _autocomplete = new Autocomplete(
      document.getElementById("pac-input"),
      options
    );

    addListeners(_autocomplete);
    setAutocomplete(_autocomplete);
  };

  const addListeners = (_autocomplete) => {
    _autocomplete.addListener("place_changed", () => {
      onAddressChange?.(_autocomplete.getPlace());
    });
  };

  return (
    <div className="places-container">
      <input id="pac-input" type="text" placeholder="Enter a location" />
    </div>
  );
};

export default PlacesAutocomplete;
