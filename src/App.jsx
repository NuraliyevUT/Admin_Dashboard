import { Route, Routes, useNavigate } from "react-router-dom";
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
import { useEffect } from "react";

function App() {
  const navigate = useNavigate()
  const token = localStorage.getItem("tokenxon");
  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
     },[token])

  return (
    <>
        <Routes>
        <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route path="/settings" element={<Settings />} />
            <Route path="/brand" element={<Brands />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/models" element={<Models />} />
          </Route>
        </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
