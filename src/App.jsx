//app.jsx

import Chart from "./components/Chart";
import Controls from "./components/Controls";



export default function App() {
  return (
    <div style={{ background: "#0b0e11", minHeight: "100vh" }}>
      <Controls />
      <Chart />
    </div>
  );
}
