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
      setError("Máximo 10 domicilios.");
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
      console.error("Error al calcular la ruta:", error);

      setGoogleRoute(null);
      setOptimizedOrder([]);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No fue posible calcular la ruta.");
      }
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="app-shell">

      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">🚚</div>

          <div>
            <h1>Route Optimizer</h1>
            <span>Delivery management</span>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          Sistema activo
        </div>
      </header>


      <main className="app-content">

        <section className="hero">
          <div>
            <span className="eyebrow">
              PLANIFICACIÓN DE ENTREGAS
            </span>

            <h2>
              Optimiza tu ruta
            </h2>

            <p>
              Organiza tus domicilios y encuentra el recorrido
              más eficiente considerando distancia y tráfico.
            </p>
          </div>
        </section>


        <section className="planning-grid">

          <div className="card">

            <div className="card-header">
              <div>
                <span className="card-icon origin-icon">
                  📍
                </span>

                <div>
                  <h3>Origen</h3>
                  <p>Punto de partida</p>
                </div>
              </div>
            </div>


            <AddressInput
              onPlaceSelected={setOrigin}
              clearTrigger={originClearTrigger}
            />


            {origin && (
              <div className="selected-place">

                <div className="selected-place-info">
                  <span>📍</span>

                  <strong>
                    {origin.address}
                  </strong>
                </div>

                <button
                  type="button"
                  className="icon-button danger"
                  onClick={() => {
                    setOrigin(null);
                    setOriginClearTrigger(
                      (value) => !value
                    );
                    setGoogleRoute(null);
                    setOptimizedOrder([]);
                    setError(null);
                  }}
                  title="Eliminar origen"
                >
                  ×
                </button>

              </div>
            )}

          </div>


          <div className="card">

            <div className="card-header">

              <div>
                <span className="card-icon delivery-icon">
                  📦
                </span>

                <div>
                  <h3>Domicilios</h3>

                  <p>
                    {deliveries.length} de 10
                    {deliveries.length === 1
                      ? " entrega"
                      : " entregas"}
                  </p>
                </div>
              </div>

            </div>


            <DeliveryList
              deliveries={deliveries}
              onAddDelivery={addDelivery}
              onRemoveDelivery={removeDelivery}
              onPlaceSelected={handlePlaceSelected}
            />

          </div>

        </section>


        {error && (
          <div
            className="error-message"
            role="alert"
          >
            <span>⚠️</span>

            <div>
              <strong>No se pudo calcular la ruta</strong>
              <p>{error}</p>
            </div>
          </div>
        )}


        <div className="calculate-container">

          <button
            type="button"
            className="calculate-button"
            onClick={calculateRoute}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <span className="spinner"></span>
                Calculando ruta...
              </>
            ) : (
              <>
                🚚
                Calcular ruta
              </>
            )}
          </button>

        </div>


        <section className="map-card">

          <div className="map-header">
            <div>
              <h3>Mapa de ruta</h3>
              <p>
                Visualización del recorrido optimizado
              </p>
            </div>
          </div>

          <Map
            googleRoute={googleRoute}
            origin={origin}
            deliveries={deliveries}
            optimizedOrder={optimizedOrder}
          />

        </section>


        <section className="summary-section">

          <RouteSummary
            googleRoute={googleRoute}
            optimizedOrder={optimizedOrder}
            deliveries={deliveries}
            origin={origin}
          />

        </section>

      </main>

    </div>
  );
}

export default App;