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
        {/* Root redirect to English */}
        <Route
          path="/"
          element={
            <Navigate to="/en/lpor14" replace />
          }
        />

        {/* Legacy route redirect to English */}
        <Route
          path="/lpor14"
          element={
            <Navigate to="/en/lpor14" replace />
          }
        />

        {/* Language-aware routes */}
        <Route
          path="/:lang/lpor14"
          element={<LPOR14Page />}
        />

        {/* Add more language-aware routes here for other forms */}
        {/* Example: <Route path="/:lang/other-form" element={<OtherFormPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
