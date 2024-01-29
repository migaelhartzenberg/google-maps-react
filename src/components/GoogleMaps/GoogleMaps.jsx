
import { useRef } from "react";
import "./GoogleMaps.css";
import PlacesAutocomplete from "../PlacesAutocomplete/PlacesAutocomplete";
import { useEffect } from "react";
import { useState } from "react";
import { getRandomMapPosition } from "../../utils/utils";

// Why does Google recommend that we use the "Dynamic Library Import" method rather
// than the NPM js-api-loader package and the legacy script loading tag
const GoogleMaps = () => {
  const map = useRef();
  const geocoder = useRef();
  const infoWindow = useRef();

  const [place, setPlace] = useState();
  const [placeMarker, setPlaceMarker] = useState();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    if (place) handleMarkerChange();
  }, [place]);

  useEffect(() => {
    panToMarker();
  }, [placeMarker]);

  const initMap = async () => {
    if (map.current) return;

    const { Map } = await google.maps.importLibrary("maps");
    await google.maps.importLibrary("marker");
    // await google.maps.importLibrary("geocoding");

    map.current = new Map(document.getElementById("map"), {
      center: { lat: -25.862502608566373, lng: 28.245732330758624 },
      zoom: 10,
      mapId: "37a80a3ef5b21fc",
    });

    // _AdvancedMarkerElement = AdvancedMarkerElement;
    infoWindow.current = new google.maps.InfoWindow({
      content: "",
      disableAutoPan: true,
    });

    geocoder.current = new google.maps.Geocoder();

    addListeners();
  };

  const addListeners = () => {
    map.current.addListener("click", (e) => {
      geolocate(e.latLng);
    });
  };

  const geolocate = async (latLng) => {
    try {
      const response = await geocoder.current.geocode({ location: latLng });
      if (!response || response.results.length === 0) return;

      setPlace(response.results[0]);
      return response.results[0];
    } catch (err) {
      console.error("geocoding failed", err);
    }
  };

  const panToMarker = () => {
    map.current?.panTo(placeMarker?.position);
  };

  const handleMarkerChange = () => {
    if (placeMarker) {
      let tmp = placeMarker;
      tmp.setMap(null);
    }
    let posi = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    map.current?.panTo(posi);
    setPlaceMarker(generateMarker(posi, place.formatted_address, "", true));
  };

  const generateMarker = (position, title, content, open) => {
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: map.current,
      position,
      collisionBehavior: google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY
    });

    if (title && open) {
      infoWindow.current.setContent(title);
      infoWindow.current.open(map.current, marker);
    }

    marker.addListener("click", async () => {
      infoWindow.current.open(map.current, marker);

      if (!title) {
        infoWindow.current.setContent("Loading Address");
        let local = await geolocate(position);
        title = local?.formatted_address || "No Address";
      }

      infoWindow.current.setContent(title);
    });

    return marker;
  };

  const onAddressChange = (_place) => {
    setPlace(_place);
  };

  const handleMultipleMarkers = (amount = 10000) => {
    let i = 0;
    let tmpMarkers = [];
    while (i < amount) {
      tmpMarkers.push(generateMarker(getRandomMapPosition(map.current)));
      i++;
    }
    if (markers)
      markers.forEach((marker) => {
        if (marker.map) marker.map = null;
      });

    setMarkers([...tmpMarkers]);
  };

  return (
    <div className="map-container">
      <PlacesAutocomplete onAddressChange={onAddressChange} />
      <button className="btn" onClick={() => handleMultipleMarkers()}>
        Add Markers
      </button>
      <div id="map"></div>
    </div>
  );
};

export default GoogleMaps;
