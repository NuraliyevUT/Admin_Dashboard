import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-blue-900 text-white w-64 h-screen p-4">
      <h2 className="text-xl font-bold mb-4">AvtozoomAdmin</h2>
      <nav>
        <ul>
          {/* <li className="mb-2">
            <Link to="/home" className="flex items-center p-2 hover:bg-blue-700 rounded">
              <span className="ml-2">Dashboard</span>
            </Link>
          </li> */}
          <li className="mb-2">
            <Link
              to="/settings"
              className="flex items-center p-2 hover:bg-blue-700 rounded"
            >
              <span className="ml-2">Settings</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/brand"
              className="flex items-center p-2 hover:bg-blue-700 rounded"
            >
              <span className="ml-2">Brands</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/cities"
              className="flex items-center p-2 hover:bg-blue-700 rounded"
            >
              <span className="ml-2">Cities</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/locations"
              className="flex items-center p-2 hover:bg-blue-700 rounded"
            >
              <span className="ml-2">Locations</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/cars"
              className="flex items-center p-2 hover:bg-blue-700 rounded"
            >
              <span className="ml-2">Cars</span>
            </Link>
          </li>
          {/* Add other links as needed */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
