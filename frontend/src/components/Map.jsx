import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "../services/googleMaps";

function Map({ googleRoute }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    const loadMap = async () => {
      const { maps } = await loadGoogleMaps();

      if (!mapRef.current) {
        return;
      }

      const { Map } = maps;

      mapInstanceRef.current = new Map(mapRef.current, {
        center: { lat: 4.711, lng: -74.0721 },
        zoom: 12,
      });
    };
      loadMap();
    },[]);

    useEffect(() => {
      if (!googleRoute) return;
      if (!mapInstanceRef.current) return;

      const drawRoute = async () => {
        const { maps,core, geometry } = await loadGoogleMaps();
        const route = googleRoute.routes?.[0];
        if (!route) {
          console.warn("No se encontró una ruta.");
          return;
        }
        const encodedPolyline = route.polyline?.encodedPolyline;

        if(!encodedPolyline) { console.warn("No se encontró encodedPolyline.");
          return;
        }

        console.log("Encoded Polyline:",encodedPolyline);

        const path = geometry.encoding.decodePath(encodedPolyline);
        console.log("Puntos de la ruta:", path);

        if (polylineRef.current){
          polylineRef.current.setMap(null);
        }

        polylineRef.current =
          new maps.Polyline({
            path,
            geodesic: true,
            strokeOpacity: 1.0,
            strokeWeight: 5,
            map: mapInstanceRef.current,
          });

        const bounds = new core.LatLngBounds();

        path.forEach((point) => {
          bounds.extend(point);
        });

        mapInstanceRef.current.fitBounds(bounds);
      };

      drawRoute();
    }, [googleRoute]);


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