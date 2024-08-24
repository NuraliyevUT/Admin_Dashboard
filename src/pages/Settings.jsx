import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Settings = () => {
  // Get API data
  const [data, setData] = useState([]);
  const getFunc = async () => {
    try {
      const response = await fetch(
        "https://autoapi.dezinfeksiyatashkent.uz/api/categories"
      );
      const result = await response.json();
      setData(result?.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    getFunc();
  }, []);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  const modalFunc = () => {
    setIsEditMode(false);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    resetForm();
  };

  // Form data management
  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [pic, setPic] = useState(null);
  const token = localStorage.getItem("tokenxon");

  const resetForm = () => {
    setNameEn("");
    setNameRu("");
    setPic(null);
    setCurrentItemId(null);
  };

  // Post API data
  const addFunc = async (e) => {
    e.preventDefault();

    if (!pic) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name_en", nameEn);
    formData.append("name_ru", nameRu);
    formData.append("images", pic);

    try {
      const response = await fetch(
        "https://autoapi.dezinfeksiyatashkent.uz/api/categories",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dat = await response.json();
      if (dat?.success === true) {
        toast.success(dat?.message);
        closeModal();
        getFunc();
      } else {
        toast.error(dat?.message);
      }
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  // Delete API data
  const deleteFunc = async (id) => {
    try {
      const response = await fetch(
        `https://autoapi.dezinfeksiyatashkent.uz/api/categories/${id}`,
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
        getFunc(); // Refresh the data after deletion
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the item");
      console.error("Error:", error);
    }
  };

  // Open edit modal with existing data
  const openEditModal = (item) => {
    setIsEditMode(true);
    setOpenModal(true);
    setCurrentItemId(item?.id);
    setNameEn(item?.name_en);
    setNameRu(item?.name_ru);
  };

  // Edit API data
  const edithFunc = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name_en", nameEn);
    formData.append("name_ru", nameRu);
    if (pic) formData.append("images", pic); // Only append pic if it exists

    try {
      const response = await fetch(
        `https://autoapi.dezinfeksiyatashkent.uz/api/categories/${currentItemId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const elem = await response.json();
      if (elem?.success) {
        toast.success(elem?.message);
        closeModal();
        getFunc();
      } else {
        toast.error(elem?.message);
      }
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button
          onClick={modalFunc}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add a new item
        </button>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Item" : "Add New Item"}
            </h2>
            <form onSubmit={isEditMode ? edithFunc : addFunc}>
              <div className="mb-4">
                <input
                  onChange={(e) => setNameEn(e?.target?.value)}
                  type="text"
                  placeholder="Name (EN)"
                  value={nameEn}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  onChange={(e) => setNameRu(e?.target?.value)}
                  type="text"
                  placeholder="Name (RU)"
                  value={nameRu}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  onChange={(e) => setPic(e?.target?.files[0])}
                  accept="image/png, image/jpeg, image/jpg"
                  type="file"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required={!isEditMode} // Only required for adding new items
                />
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left">Name (EN)</th>
              <th className="py-2 px-4 border-b text-left">Name (RU)</th>
              <th className="py-2 px-4 border-b text-left">Photo</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{item?.name_en}</td>
                <td className="py-2 px-4 border-b">{item?.name_ru}</td>
                <td className="py-2 px-4 border-b">
                  <img
                    src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${item?.image_src}`}
                    alt={item?.name_en}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFunc(item?.id)}
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

export default Settings;
