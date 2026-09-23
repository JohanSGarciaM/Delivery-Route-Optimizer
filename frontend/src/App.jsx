import { useState } from "react";
import Map from "./components/Map";
import AddressInput from "./components/AddressInput";
import DeliveryList from "./components/DeliveryList";
import RouteSummary from "./components/RouteSummary";

function App() {
  const [origin, setOrigin] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [originClearTrigger, setOriginClearTrigger] = useState(false);
  const [googleRoute, setGoogleRoute] = useState(null);
  const [optimizedOrder, setOptimizedOrder] = useState([]);

  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  const addDelivery = () => {
    if (deliveries.length >= 10) {
      alert("Máximo 10 domicilios.");
      return;
    }

    setDeliveries([
      ...deliveries,
      {
        id: crypto.randomUUID(),
        place: null,
      },
    ]);

    setError(null);
  };

  const removeDelivery = (id) => {
    setDeliveries(
      deliveries.filter((delivery) => delivery.id !== id)
    );

    setGoogleRoute(null);
    setOptimizedOrder([]);
    setError(null);
  };

  const handlePlaceSelected = (id, place) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === id
          ? {
              ...delivery,
              place,
            }
          : delivery
      )
    );

    setError(null);
  };

  const calculateRoute = async () => {
    if (isCalculating) {
      return;
    }

    setError(null);

    if (!origin) {
      setError("Debes seleccionar un origen.");
      return;
    }

    if (deliveries.length === 0) {
      setError("Debes agregar al menos un domicilio.");
      return;
    }

    const incompleteDelivery = deliveries.find(
      (delivery) => !delivery.place
    );

    if (incompleteDelivery) {
      setError(
        "Debes seleccionar una dirección para cada domicilio."
      );
      return;
    }

    const routeRequest = {
      origin: {
        placeId: origin.placeId,
        address: origin.address,
        latitude: origin.latitude,
        longitude: origin.longitude,
      },

      deliveries: deliveries.map((delivery, index) => ({
        id: delivery.id,
        order: index + 1,
        placeId: delivery.place.placeId,
        address: delivery.place.address,
        latitude: delivery.place.latitude,
        longitude: delivery.place.longitude,
      })),
    };

    console.log("Solicitud de ruta:", routeRequest);

    setIsCalculating(true);



    try {
      const response = await fetch(
        "http://localhost:3000/routes/calculate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(routeRequest),
        }
      );

      const result = await response.json();

      console.log("Respuesta del backend:", result);

      if (!response.ok) {
        const backendMessage = Array.isArray(result.message)
          ? result.message.join(", ")
          : result.message;

        throw new Error(
          backendMessage ||
            "El backend no pudo calcular la ruta."
        );
      }

      if (
        !result.googleRoute ||
        !result.optimization ||
        !result.optimization.order
      ) {
        throw new Error(
          "El backend devolvió una respuesta incompleta."
        );
      }

      setGoogleRoute(result.googleRoute);
      setOptimizedOrder(result.optimization.order);
    } catch (error) {
      console.error(
        "Error al calcular la ruta:",
        error
      );

      setGoogleRoute(null);
      setOptimizedOrder([]);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "No fue posible calcular la ruta."
        );
      }
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div>
      <h1>Delivery Route Optimizer</h1>

      <section>
        <h2>Origen</h2>

        <AddressInput
          onPlaceSelected={setOrigin}
          clearTrigger={originClearTrigger}
        />

        {origin && (
          <div>
            <strong>{origin.address}</strong>

            <button
              type="button"
              onClick={() => {
                setOrigin(null);
                setOriginClearTrigger(
                  (value) => !value
                );
                setGoogleRoute(null);
                setOptimizedOrder([]);
                setError(null);
              }}
            >
              ❌ Eliminar origen
            </button>
          </div>
        )}
      </section>

      <DeliveryList
        deliveries={deliveries}
        onAddDelivery={addDelivery}
        onRemoveDelivery={removeDelivery}
        onPlaceSelected={handlePlaceSelected}
      />

      {error && (
        <div
          role="alert"
          style={{
            marginTop: "10px",
            padding: "10px",
            border: "1px solid #cc0000",
            borderRadius: "6px",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      <button
        type="button"
        onClick={calculateRoute}
        disabled={isCalculating}
      >
        {isCalculating
          ? "⏳ Calculando ruta..."
          : "🚚 Calcular Ruta"}
      </button>

      <Map
        googleRoute={googleRoute}
        origin={origin}
        deliveries={deliveries}
        optimizedOrder={optimizedOrder}
      />

      <RouteSummary
        googleRoute={googleRoute}
        optimizedOrder={optimizedOrder}
        deliveries={deliveries}
        origin={origin}
      />
    </div>
  );
}

export default App;