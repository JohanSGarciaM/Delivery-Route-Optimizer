import { useState } from "react";
import Map from "./components/Map";
import AddressInput from "./components/AddressInput";
import DeliveryList from "./components/DeliveryList";

function App() {

  const [origin, setOrigin] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [originClearTrigger, setOriginClearTrigger] = useState(false);
  const [googleRoute, setGoogleRoute] = useState(null);
  const [optimizedOrder, setOptimizedOrder] = useState([]);

  const addDelivery = () => {
    if (deliveries.length >= 10) {
      alert ("Máximo 10 domicilios.");
      return;
    }

    setDeliveries([
      ...deliveries,
      {
        id: crypto.randomUUID(),
        place: null,
      },
    ]);
  };

  const removeDelivery = (id) => {
    setDeliveries(
      deliveries.filter((delivery) => delivery.id !== id)
    );
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
  };

  const calculateRoute = async () => {
    if (!origin) {
      alert("Debes seleccionar un origen");
      return;
    }
    if (deliveries.length === 0) {
      alert("Debes agregar al menos un domicilio");
      return;
    }
    const incompleteDelivery = deliveries.find(
      (delivery) => !delivery.place
    );
    if (incompleteDelivery) {
      alert("Debes seleccionar una dirección para cada domicilio");
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
      setGoogleRoute(result.googleRoute);
      setOptimizedOrder(result.optimization.order);

      alert("Ruta calculada correctamente.");
    } catch (error){
      console.error(
        "Error al comunicarse con el backend:",
        error
      );

      alert("No fue posible comunicarse con el backend.");
    }
  };

  return (
    <div>
      <h1>Delivery Route Optimizer</h1>

      <section>
        <h2>Origen</h2>

        <AddressInput onPlaceSelected={setOrigin} clearTrigger={originClearTrigger} />

        {origin && (
          <div>
            <strong>{origin.address}</strong>
            <button
              type="button"
              onClick={() => {
                setOrigin(null);
                setOriginClearTrigger((value) => !value);
              }}
            >❌ Eliminar origen
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

      <button
        type="button"
        onClick={calculateRoute}
      >🚚 Calcular Ruta</button>

      <Map 
        googleRoute={googleRoute}
        origin={origin}
        deliveries={deliveries}
        optimizedOrder={optimizedOrder}
      />
    </div>
  );
}

export default App;