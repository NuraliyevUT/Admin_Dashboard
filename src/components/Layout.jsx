import React from "react";
import {Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Settings from "../pages/Settings";
import Brands from "../pages/Brands";
import Cities from "../pages/Cities";
import Locations from "../pages/Locations";
import Cars from "../pages/Cars";

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="flex-1 overflow-auto p-4">
          <main className="flex-grow">
            <Routes>
              <Route path="/settings" element={<Settings />} />   
              <Route path="/brand" element={<Brands />} />
              <Route path="/cities" element={<Cities />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/cars" element={<Cars />} />

            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
