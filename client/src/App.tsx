import {
  Route,
  Routes,
} from "react-router";

import Admin from "./pages/Admin";
import Admin2 from "./pages/Admin2";
import Home from "./pages/Home";

function App() {
  return (
    <main className="relative mx-auto px-6 w-full max-w-7xl">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin2" element={<Admin2 />} />
      </Routes>
    </main>
  );
}

export default App;
