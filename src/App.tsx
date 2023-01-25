import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import DndKitKanban from "./pages/DndKitKanban";
import DndReactKanban from "./pages/DndReactKanban";

function App() {
  return (
    <>
      <Nav />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Routes>
          <Route path="/dnd-kit-kanban" element={<DndKitKanban />} />
          <Route path="/dnd-react-kanban" element={<DndReactKanban />} />
          <Route path="*" element={<Navigate to="dnd-kit-kanban" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
