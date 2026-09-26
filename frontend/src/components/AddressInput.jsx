import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "../services/googleMaps";

function AddressInput({ onPlaceSelected, clearTrigger = 0 }) {
  const containerRef = useRef(null);
  const initializedRef = useRef(false);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    const loadPlaces = async () => {
      const { places } = await loadGoogleMaps();

      if (!containerRef.current) {
        return;
      }

      const { PlaceAutocompleteElement } = places;

      const autocomplete = new PlaceAutocompleteElement();

      autocomplete.placeholder = "Ingresa una dirección";

      autocomplete.className = "address-autocomplete";

      autocompleteRef.current = autocomplete;

      containerRef.current.appendChild(autocomplete);

      autocomplete.addEventListener(
        "gmp-select",
        async ({ placePrediction }) => {
          const place = placePrediction.toPlace();

          await place.fetchFields({
            fields: [
              "displayName",
              "formattedAddress",
              "location",
              "id",
            ],
          });

          const selectedPlace = {
            placeId: place.id,
            name: place.displayName,
            address: place.formattedAddress,
            latitude: place.location?.lat(),
            longitude: place.location?.lng(),
          };

          console.log("Lugar seleccionado:", selectedPlace);

          if (onPlaceSelected) {
            onPlaceSelected(selectedPlace);
          }
        }
      );
    };

    loadPlaces();
  }, [onPlaceSelected]);

  useEffect(() => {
    if (autocompleteRef.current) {
      autocompleteRef.current.value = "";
    }
  }, [clearTrigger]);

  return (
    <div
      ref={containerRef}
      className="address-input-container"
    />
  );
}

export default AddressInput;