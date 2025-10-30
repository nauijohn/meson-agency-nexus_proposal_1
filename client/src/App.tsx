import {
  Route,
  Routes,
} from "react-router";

import { Navbar05 } from "./components/ui/shadcn-io/navbar-05";
import Admin from "./pages/Admin";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Navbar05 onNavItemClick={(item) => console.log(item)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
