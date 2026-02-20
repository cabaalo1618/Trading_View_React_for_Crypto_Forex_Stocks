//appcontext.jsx
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [market, setMarket] = useState("crypto");   
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [timeframe, setTimeframe] = useState("1h");

  return (
    <AppContext.Provider value={{
      market, setMarket,
      symbol, setSymbol,
      timeframe, setTimeframe
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
