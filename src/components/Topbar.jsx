import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  // Logout function
  const logoutFunc = () => {
    localStorage.removeItem("tokenxon");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <button className="text-blue-900 md:hidden">
        <i className="fas fa-bars"></i>
      </button>
      <div>{/* You can add other items here */}</div>
      <div>
        <button
          onClick={logoutFunc}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Topbar;
