import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

function Map() {
    const mapRef = useRef(null);

    useEffect(() => {
    const loadMap = async () => {
      setOptions({
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        v: "weekly",
      });

      const { Map } = await importLibrary("maps");

      if (!mapRef.current) {
        return;
      }

      new Map(mapRef.current, {
        center: {
          lat: 4.711,
          lng: -74.0721,
        },
        zoom: 12,
      });
    };

    loadMap();
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "50%",
        height: "500px",
        margin: "50px auto",
      }}
    />
  );
};

export default Map;

