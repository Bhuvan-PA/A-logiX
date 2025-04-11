import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { createContext } from "react";

export const UserContext = createContext<{
  userId: number | null;
  setUserId: (id: number | null) => void;
}>({
  userId: null,
  setUserId: () => {},
});

createRoot(document.getElementById("root")!).render(<App />);
