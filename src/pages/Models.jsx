import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Models = () => {
  // State to hold the list of models
  const [models, setModels] = useState([]);

  // State to hold the list of brands
  const [brands, setBrands] = useState([]);

  // State to control the visibility of the modal
  const [openModal, setOpenModal] = useState(false);

  // State to determine if the modal is in edit mode
  const [isEditMode, setIsEditMode] = useState(false);

  // State to hold the ID of the current item being edited
  const [currentItemId, setCurrentItemId] = useState(null);

  // State to hold the input values for model name and brand ID
  const [modelName, setModelName] = useState("");
  const [brandId, setBrandId] = useState("");

  // Retrieve the token from local storage
  const token = localStorage.getItem("tokenxon");

  // Function to reset the form fields
  const resetForm = () => {
    setModelName("");
    setBrandId("");
    setCurrentItemId(null);
  };

  // Function to fetch the list of models from the API
  const getModels = async () => {
    try {
      const response = await fetch(
        "https://autoapi.dezinfeksiyatashkent.uz/api/models"
      );
      const result = await response.json();
      setModels(result?.data);
    } catch (error) {
      toast.error("Failed to fetch models");
    }
  };

  // Function to fetch the list of brands from the API
  const getBrands = async () => {
    try {
      const response = await fetch(
        "https://autoapi.dezinfeksiyatashkent.uz/api/brands"
      );
      const result = await response.json();
      setBrands(result?.data);
    } catch (error) {
      toast.error("Failed to fetch brands");
    }
  };

  // Fetch models and brands when the component mounts
  useEffect(() => {
    getModels();
    getBrands();
  }, []);

  // Function to open the modal in add mode
  const modalFunc = () => {
    setIsEditMode(false);
    setOpenModal(true);
  };

  // Function to close the modal and reset the form
  const closeModal = () => {
    setOpenModal(false);
    resetForm();
  };

  // Function to handle adding a new model
  const addModel = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", modelName);
    formData.append("brand_id", brandId);

    try {
      const response = await fetch(
        "https://autoapi.dezinfeksiyatashkent.uz/api/models",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result?.success) {
        toast.success(result?.message);
        closeModal();
        getModels();
      } else {
        toast.error(result?.message);
      }
    } catch (error) {
      toast.error("Failed to add model");
    }
  };

  // Function to handle editing an existing model
  const editModel = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", modelName);
    formData.append("brand_id", brandId);

    try {
      const response = await fetch(
        `https://autoapi.dezinfeksiyatashkent.uz/api/models/${currentItemId}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result?.success) {
        toast.success(result?.message);
        closeModal();
        getModels();
      } else {
        toast.error(result?.message);
      }
    } catch (error) {
      toast.error("Failed to update model");
    }
  };

  // Function to handle deleting a model
  const deleteModel = async (id) => {
    try {
      const response = await fetch(
        `https://autoapi.dezinfeksiyatashkent.uz/api/models/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data?.success) {
        toast.success(data?.message);
        getModels();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the model");
    }
  };

  // Function to open the modal in edit mode and populate it with the selected model's data
  const openEditModal = (model) => {
    setIsEditMode(true);
    setOpenModal(true);
    setCurrentItemId(model.id);
    setModelName(model.name);
    setBrandId(model.brand_id);
  };

  return (
    <div className="p-6">
      {/* Header with Add Model button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Models</h1>
        <button
          onClick={modalFunc}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add a new model
        </button>
      </div>

      {/* Modal for adding/editing a model */}
      {openModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Model" : "Add New Model"}
            </h2>
            <form onSubmit={isEditMode ? editModel : addModel}>
              <div className="mb-4">
                <input
                  onChange={(e) => setModelName(e.target.value)}
                  type="text"
                  placeholder="Model Name"
                  value={modelName}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <select
                  onChange={(e) => setBrandId(e.target.value)}
                  value={brandId}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  {isEditMode ? "Update" : "Add"}
                </button>
                <button
                  onClick={closeModal}
                  type="button"
                  className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table displaying models */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left">Model</th>
              <th className="py-2 px-4 border-b text-left">Brand</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{model.name}</td>
                <td className="py-2 px-4 border-b">
                  {
                    brands.find((brand) => brand.id === model.brand_id)?.title
                  }
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openEditModal(model)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteModel(model.id)}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Models;
