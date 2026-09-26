import AddressInput from "./AddressInput";

function DeliveryList({
  deliveries,
  onAddDelivery,
  onRemoveDelivery,
  onPlaceSelected,
}) {
  return (
    <div className="delivery-list">

      {deliveries.length === 0 ? (
        <div className="empty-deliveries">

          <div className="empty-icon">
            📦
          </div>

          <strong>
            Aún no hay domicilios
          </strong>

          <p>
            Agrega las direcciones que deseas incluir
            en tu ruta.
          </p>

        </div>
      ) : (
        <div className="delivery-items">

          {deliveries.map((delivery, index) => (
            <div
              key={delivery.id}
              className="delivery-item"
            >

              <div className="delivery-number">
                {String(index + 1).padStart(2, "0")}
              </div>


              <div className="delivery-content">

                <AddressInput
                  onPlaceSelected={(place) =>
                    onPlaceSelected(
                      delivery.id,
                      place
                    )
                  }
                />


                {delivery.place && (
                  <div className="delivery-selected">

                    <span className="location-icon">
                      📍
                    </span>

                    <span>
                      {delivery.place.address}
                    </span>

                  </div>
                )}

              </div>


              <button
                type="button"
                className="delivery-remove"
                onClick={() =>
                  onRemoveDelivery(
                    delivery.id
                  )
                }
                title="Eliminar domicilio"
                aria-label={`Eliminar domicilio ${
                  index + 1
                }`}
              >
                ×
              </button>

            </div>
          ))}

        </div>
      )}


      {deliveries.length < 10 && (
        <button
          type="button"
          className="add-delivery-button"
          onClick={onAddDelivery}
        >
          <span>＋</span>
          Agregar domicilio
        </button>
      )}

    </div>
  );
}

export default DeliveryList;