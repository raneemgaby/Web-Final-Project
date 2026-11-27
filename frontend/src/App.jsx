import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import SearchResults from "./pages/SearchResults";
import "./styles/global.css";
import "./styles/search.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/results" replace />}
        />
        <Route
          path="/results"
          element={<SearchResults />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;