import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LPORFPage } from "./pages/LPORFPage";
import { MasterIntakePage } from "./pages/MasterIntakePage";
import { FormStateProvider } from "./contexts/FormStateContext";
import "./App.css";

function App() {
  return (
    <FormStateProvider>
      <Router>
        <Routes>
          {/* Root redirect to intake */}
          <Route
            path="/"
            element={
              <Navigate to="/intake" replace />
            }
          />

          {/* Main intake page */}
          <Route
            path="/intake"
            element={<MasterIntakePage />}
          />

          {/* Legacy LPOR-F route */}
          <Route
            path="/lpor_f"
            element={<LPORFPage />}
          />

          {/* Add more language-aware routes here for other forms */}
          {/* Example: <Route path="/:lang/other-form" element={<OtherFormPage />} /> */}
        </Routes>
      </Router>
    </FormStateProvider>
  );
}

export default App;
