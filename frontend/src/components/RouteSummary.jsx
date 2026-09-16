function formatDuration(duration) {
  const seconds = parseFloat(
    duration.replace("s", "")
  );

  const hours = Math.floor(seconds / 3600);

  const minutes = Math.round(
    (seconds % 3600) / 60
  );

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }

  return `${minutes} min`;
}

function formatDistance(distanceMeters) {
  const kilometers = distanceMeters / 1000;

  if (kilometers < 1) {
    return `${Math.round(distanceMeters)} m`;
  }

  return `${kilometers.toFixed(1)} km`;
}

function RouteSummary({
  googleRoute,
  optimizedOrder,
  deliveries,
  origin,
}) {
  if (!googleRoute?.routes?.[0]) {
    return null;
  }

  const route = googleRoute.routes[0];

  return (
    <section>
      <h2>Resumen de la ruta</h2>

      <div>
        <strong>Distancia total</strong>
        <p>
          {formatDistance(
            route.distanceMeters
          )}
        </p>
      </div>

      <div>
        <strong>Tiempo estimado</strong>
        <p>
          {formatDuration(
            route.duration
          )}
        </p>
      </div>

      <hr />

      <h3>Recorrido</h3>

      <div>
        <strong>🟢 Origen</strong>

        {origin?.address && (
          <p>{origin.address}</p>
        )}
      </div>

      {optimizedOrder.map(
        (pointIndex, index) => {
          const delivery =
            deliveries[pointIndex - 1];

          if (!delivery?.place) {
            return null;
          }

          const leg =
            route.legs?.[index];

          return (
            <div key={delivery.id}>
              <div>
                <strong>
                  🔵 Entrega {index + 1}
                </strong>

                <p>
                  {delivery.place.address}
                </p>
              </div>

              {leg && (
                <small>
                  {formatDistance(
                    leg.distanceMeters
                  )}
                  {" · "}
                  {formatDuration(
                    leg.duration
                  )}
                </small>
              )}

              <hr />
            </div>
          );
        }
      )}
    </section>
  );
}

export default RouteSummary;