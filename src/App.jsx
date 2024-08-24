import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import Settings from "./pages/Settings";
import Brands from "./pages/Brands";
import Cities from "./pages/Cities";
import Locations from "./pages/Locations";
import Cars from "./pages/Cars";
import Models from "./pages/Models";

function App() {

  const token = localStorage.getItem("tokenxon");
  

  return (
    <>
      {token?.length > 0 ? (
        <Routes>
          {/* <Route path="/" element={<LoginPage />} /> */}
          <Route path="/" element={<Layout />} >
          <Route path="/settings" element={<Settings />} />
          <Route path="/brand" element={<Brands />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/models" element={<Models />} />

          {/* <Route path="*" element={<NotFoundPage />} /> Optional */}
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      )}

      <ToastContainer />
    </>
  );
}

export default App;
