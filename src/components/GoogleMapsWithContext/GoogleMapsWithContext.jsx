
import { useRef } from "react";
import "./GoogleMapsWithContext.css";
import PlacesAutocomplete from "../PlacesAutocomplete/PlacesAutocomplete";
import { useEffect } from "react";
import { useState } from "react";
import { getRandomMapPosition } from "../../utils/utils";
import { useGoogleMaps } from "../../context/GoogleMapsContext";

// Why does Google recommend that we use the "Dynamic Library Import" method rather
// than the NPM js-api-loader package and the legacy script loading tag
const GoogleMapsWithContext = () => {
  const { map, mapLoaded, init, libraryLoader, loading: isMapLoading, google } = useGoogleMaps()
  const [place, setPlace] = useState();
  const [placeMarker, setPlaceMarker] = useState();

  const infoWindow = useRef();

  useEffect(() => {
    init({
      mapContainer: document.getElementById('map'),
      mapOptions: {
        center: { lat: -25.862502608566373, lng: 28.245732330758624 },
        zoom: 10,
        mapId: "37a80a3ef5b21fc",
      }
    });
  }, []);

  useEffect(() => {
    if (place) handleMarkerChange();
  }, [place]);

  const onAddressChange = (_place) => {
    setPlace(_place);
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
        // let local = await geolocate(position);
        // title = local?.formatted_address || "No Address";
      }

      infoWindow.current.setContent(title);
    });

    return marker;
  };

  return (
    <div className="map-container">
      {(!mapLoaded) &&
        <div>Loading...</div>
      }
      <PlacesAutocomplete onAddressChange={onAddressChange} />
      <div id='map'></div>
    </div>
  );
};

export default GoogleMapsWithContext;
