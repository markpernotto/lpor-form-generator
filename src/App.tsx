import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LPORFPage } from "./pages/LPORFPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Root redirect to English */}
        <Route
          path="/"
          element={
            <Navigate to="/en/lpor_f" replace />
          }
        />

        {/* Legacy route redirect to English */}
        <Route
          path="/lpor_f"
          element={
            <Navigate to="/en/lpor_f" replace />
          }
        />

        {/* Language-aware routes */}
        <Route
          path="/:lang/lpor_f"
          element={<LPORFPage />}
        />

        {/* Add more language-aware routes here for other forms */}
        {/* Example: <Route path="/:lang/other-form" element={<OtherFormPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
