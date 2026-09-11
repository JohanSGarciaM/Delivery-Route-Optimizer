import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

function AddressInput() {
    const containerRef = useRef(null);
    const initializedRef = useRef(false);

    useEffect(() => {

        if (initializedRef.current) { return;}

        initializedRef.current = true;
        const loadPlaces = async () => {
            setOptions({
                key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                v: "weekly",
            });

            const { PlaceAutocompleteElement } = await importLibrary("places");
            
            if (!containerRef.current) { return;}

            const autocomplete = new PlaceAutocompleteElement();

            autocomplete.placeholder = "Ingresa dirección de Origen";

            containerRef.current.appendChild(autocomplete);

            autocomplete.addEventListener("gmp-select", async ({ placePrediction }) => {
                const place = placePrediction.toPlace();

                await place.fetchFields({
                    fields: ["displayName", "formattedAddress", "location", "id"],
                });

                console.log("Lugar seleccionado:", {
                    id: place.id,
                    nombre: place.displayName,
                    direccion: place.formattedAddress,
                    latitud: place.location?.lat(),
                    longitud: place.location?.lng(),
                });
            });
        };
        loadPlaces();
    }, []);

    return (
        <div ref={containerRef}
            style={{
                width: "50%",
                margin: "0 auto",
            }}
        ></div>
    );
}

export default AddressInput;