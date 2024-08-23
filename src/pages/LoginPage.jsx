import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginFunc = (event) => {
    event.preventDefault();

    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phone,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.success === true) {
          localStorage.setItem(
            "tokenxon",
            data?.data?.tokens?.accessToken?.token
          );
          console.log(data?.data?.tokens?.accessToken?.token);
          toast.success(data?.message);
          navigate("/settings");
        } else {
          toast.error(data?.message);
        }
      })
      .catch((error) => {
        console.log(error?.message);
        toast.error("An error occurred during login.");
        if (error?.message === "Token expired") {
          localStorage.removeItem("tokenxon");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-900">Sign in</h1>
        <form className="mt-8 space-y-6" onSubmit={loginFunc}>
          <div className="rounded-md shadow-sm space-y-4">
            <input
              onChange={(e) => setPhone(e?.target.value)}
              type="text"
              required
              placeholder="Phone number"
              minLength={3}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <input
              onChange={(e) => setPassword(e?.target.value)}
              type="password"
              required
              placeholder="Password"
              minLength={3}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
