import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Cities = () => {
  // State management
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [name, setName] = useState("");
  const [pic, setPic] = useState(null);
  const [text, setText] = useState("");
  const token = localStorage.getItem("tokenxon");

  // Fetch API data
  const getFunc = async () => {
    try {
      const response = await fetch(
        "https://autoapi.dezinfeksiyatashkent.uz/api/cities"
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

  const modalFunc = () => {
    setIsEditMode(false);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setPic(null);
    setText("");
    setCurrentItemId(null);
  };

  // Post API data
  const addFunc = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("You are not authorized");
      return;
    }

    if (!pic) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("images", pic);
    formData.append("text", text);

    try {
      const response = await fetch(
        "https://autoapi.dezinfeksiyatashkent.uz/api/cities",
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
    if (!token) {
      toast.error("You are not authorized");
      return;
    }

    try {
      const response = await fetch(
        `https://autoapi.dezinfeksiyatashkent.uz/api/cities/${id}`,
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
    setName(item?.name);
    setText(item?.text);
  };

  // Edit API data
  const editFunc = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("You are not authorized");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (pic) formData.append("images", pic); // Only append pic if it exists
    formData.append("text", text);

    try {
      const response = await fetch(
        `https://autoapi.dezinfeksiyatashkent.uz/api/cities/${currentItemId}`,
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
        <h1 className="text-2xl font-semibold">Cities</h1>
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
            <form onSubmit={isEditMode ? editFunc : addFunc}>
              <div className="mb-4">
                <input
                  onChange={(e) => setName(e?.target?.value)}
                  type="text"
                  placeholder="Name"
                  value={name}
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
              <div className="mb-4">
                <input
                  onChange={(e) => setText(e?.target?.value)}
                  type="text"
                  placeholder="Text"
                  value={text}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
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
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
              <th className="py-2 px-4 border-b text-left">Photo</th>
              <th className="py-2 px-4 border-b text-left">Text</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item?.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{item?.name}</td>
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
                <td className="py-2 px-4 border-b">
                  <img
                    src={
                      item?.image_src
                        ? `https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${item?.image_src}`
                        : "/path/to/fallback/image.jpg"
                    }
                    alt={item?.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="py-2 px-4 border-b">{item?.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cities;
