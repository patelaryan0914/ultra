import { Routes, Route } from "react-router-dom";
import { Rag } from "./components/Rag";

function App() {
  return (
    <Routes>
      <Route path="/rag" element={<Rag />} />
    </Routes>
  );
}

export default App;
