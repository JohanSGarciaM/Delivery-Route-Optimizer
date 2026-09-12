import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "../services/googleMaps";

function Map() {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadMap = async () => {
      const { maps } = await loadGoogleMaps();

      if (!mapRef.current) {
        return;
      }

      const { Map } = maps;

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
}

export default Map;