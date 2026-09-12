import AddressInput from "./AddressInput";

function DeliveryList({
  deliveries,
  onAddDelivery,
  onRemoveDelivery,
  onPlaceSelected,
}) {
  return (
    <section>
      <h2>Domicilios</h2>

      {deliveries.map((delivery, index) => (
        <div key={delivery.id}>
          <span>{index + 1}. </span>

          <AddressInput
            onPlaceSelected={(place) =>
              onPlaceSelected(delivery.id, place)
            }
          />

          <button
            type="button"
            onClick={() => onRemoveDelivery(delivery.id)}
          >
            ❌
          </button>

          {delivery.place && (
            <div>
              <strong>{delivery.place.address}</strong>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={onAddDelivery}
      >
        + Agregar domicilio
      </button>
    </section>
  );
}

export default DeliveryList;