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
    <section className="route-summary">
      {/* =========================
          HEADER
      ========================= */}
      <div className="summary-header">
        <div>
          <span className="eyebrow">
            RESULTADO
          </span>
          <h2>
            Resumen de la ruta
          </h2>
          <p>
            Recorrido optimizado para tus entregas.
          </p>
        </div>
        <div className="route-status">
          <span className="route-status-dot"></span>
          Ruta calculada
        </div>
      </div>
      {/* =========================
          METRICS
      ========================= */}
      <div className="route-metrics">
        <div className="metric-card">
          <div className="metric-icon distance">
            ↗
          </div>
          <div>
            <span className="metric-label">
              Distancia total
            </span>
            <strong className="metric-value">
              {formatDistance(
                route.distanceMeters
              )}
            </strong>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon time">
            ◷
          </div>
          <div>
            <span className="metric-label">
              Tiempo estimado
            </span>
            <strong className="metric-value">
              {formatDuration(
                route.duration
              )}
            </strong>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon deliveries">
            #
          </div>
          <div>
            <span className="metric-label">
              Entregas
            </span>
            <strong className="metric-value">
              {optimizedOrder.length}
            </strong>
          </div>
        </div>
      </div>
      {/* =========================
          ROUTE
      ========================= */}
      <div className="route-details">
        <div className="route-details-header">
          <div>
            <h3>
              Recorrido
            </h3>
            <p>
              Orden recomendado de visita
            </p>
          </div>
          <span className="stop-count">
            {optimizedOrder.length} paradas
          </span>
        </div>
        <div className="route-timeline">
          {/* ORIGIN */}
          <div className="timeline-item">
            <div className="timeline-marker origin">
              <span></span>
            </div>
            <div className="timeline-content">
              <div className="timeline-title">
                <span>
                  Origen
                </span>
                <small>
                  INICIO
                </small>
              </div>
              {origin?.address && (
                <p>
                  {origin.address}
                </p>
              )}
            </div>
          </div>
          {/* DELIVERIES */}

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
                <div
                  key={delivery.id}
                  className="timeline-item"
                >
                  <div className="timeline-marker delivery">
                    <span>
                      {index + 1}
                    </span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">
                      <span>
                        Entrega {index + 1}
                      </span>
                      <small>
                        PARADA
                      </small>
                    </div>
                    <p>
                      {delivery.place.address}
                    </p>
                    {leg && (
                      <div className="leg-info">
                        <span>
                          ↗{" "}
                          {formatDistance(
                            leg.distanceMeters
                          )}
                        </span>
                        <span className="leg-divider">
                          •
                        </span>
                        <span>
                          ◷{" "}
                          {formatDuration(
                            leg.duration
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}

export default RouteSummary;