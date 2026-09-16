import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "../services/googleMaps";

function Map({ 
  googleRoute,
  origin,
  deliveries,
  optimizedOrder, 
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polylineRef = useRef(null);
  const markersRef = useRef([]);

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
        mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
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

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (!origin) return;
    if (!deliveries.length) return;
    if (!optimizedOrder.length) return;

    const drawMarkers = async () => {
      const { marker } = await loadGoogleMaps();
      const { AdvancedMarkerElement } = marker;

      markersRef.current.forEach((marker) => {
        marker.map = null;
      });
      markersRef.current = [];
      
      const originContent = document.createElement("div");
      originContent.textContent = "O";
      originContent.style.fontWeight = "bold";
      originContent.style.fontSize = "16px";

      const originMarker = new AdvancedMarkerElement({
        map: mapInstanceRef.current,
        position: {
          lat: origin.latitude,
          lng: origin.longitude,
        },
        title: "Origen",
        content: originContent,
      });
      markersRef.current.push(originMarker);


      optimizedOrder.forEach(
        (pointIndex, index) => {
          const delivery =
            deliveries[pointIndex - 1];
            
          if (!delivery?.place) return;

          const markerContent = document.createElement("div");
          markerContent.textContent = String(index+1);
          markerContent.style.fontWeight = "bold";
          markerContent.style.fontSize = "16px";

          const deliveryMarker = new AdvancedMarkerElement({
            map: mapInstanceRef.current,
            position: {
              lat: delivery.place.latitude,
              lng: delivery.place.longitude,
            },
            title: delivery.place.address,
            content: markerContent,
          });
          markersRef.current.push(
            deliveryMarker
          );
        }
      );
    };

    drawMarkers();
  }, [
    origin,
    deliveries,
    optimizedOrder,
  ]);


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