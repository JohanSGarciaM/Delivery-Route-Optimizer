import Map from "./components/Map";
import AddressInput from "./components/AddressInput";

function App() {
  return (
    <div>
      <h1>Delivery Route Optimizer</h1>
      <AddressInput/>
      <Map />
    </div>
  );
}

export default App;