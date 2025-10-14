import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LPOR14Page } from "./pages/LPOR14Page";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to="/lpor14" replace />
          }
        />
        <Route
          path="/lpor14"
          element={<LPOR14Page />}
        />
        {/* Add more routes here for other forms */}
      </Routes>
    </Router>
  );
}

export default App;
