/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { useContext } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { createContext } from 'react';

import { Loader } from "@googlemaps/js-api-loader"
import { useEffect } from 'react';

const GoogleMapsContext = createContext();

export function GoogleMapsContextProvider({ apiKey, libraries, children }) {

    const [loading, setLoading] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const [google, setGoogle] = useState(null);

    useEffect(() => {
      setMapLoaded(true)
    }, [map])

    const libraryLoader = useMemo(() => {
        return new Loader({
            apiKey,
            version: "weekly",
            libraries
        })
    }, [apiKey, libraries])  ;

    const init = useCallback(({ mapContainer, mapOptions, onMapLoad }) => {
        if(!apiKey) {
            throw new Error('Google Maps API key is required')
        } else if(!mapContainer) {
            throw new Error('mapContainer is required')
        }

        setLoading(true)

        libraryLoader.load().then(async (google) => {
            const { Map } = await libraryLoader.importLibrary("maps");
            const newMap = new Map(mapContainer, mapOptions)
            setMap(newMap)
            setGoogle(google)
            setLoading(false)
            onMapLoad?.({
                newMap,
                google,
                libraryLoader
            })
        })

    },[])

  const providedValues = useMemo(
    () => ({ map, mapLoaded, init, loading, google, libraryLoader }),
    [map, mapLoaded, init, loading, google, libraryLoader]
  )
    return <GoogleMapsContext.Provider value={providedValues}>{children}</GoogleMapsContext.Provider>
}

export function useGoogleMaps() {
    const context = useContext(GoogleMapsContext);
    if (!context) {
      throw new Error(
        'useGoogleMaps must be used within a GoogleMapsContextProvider'
      );
    }
    return context;
  }