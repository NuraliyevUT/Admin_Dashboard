import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Cars = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // State for form inputs
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [cityId, setCityId] = useState("");
  const [color, setColor] = useState("");
  const [year, setYear] = useState("");
  const [seconds, setSeconds] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [maxSpeed, setMaxSpeed] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [transmission, setTransmission] = useState("");
  const [motor, setMotor] = useState("");
  const [driveSide, setDriveSide] = useState("");
  const [petrol, setPetrol] = useState("");
  const [limitPerDay, setLimitPerDay] = useState("");
  const [deposit, setDeposit] = useState("");
  const [premiumProtection, setPremiumProtection] = useState("");
  const [priceInAed, setPriceInAed] = useState("");
  const [priceInUsd, setPriceInUsd] = useState("");
  const [priceInAedSale, setPriceInAedSale] = useState("");
  const [priceInUsdSale, setPriceInUsdSale] = useState("");
  const [locationId, setLocationId] = useState("");
  const [inclusive, setInclusive] = useState(false);
  const [pic1, setPic1] = useState(null);
  const [pic2, setPic2] = useState(null);

  // Fetch data for cars and related entities
  const getFunc = async () => {
    try {
      const [
        carsResponse,
        brandsResponse,
        modelsResponse,
        categoriesResponse,
        citiesResponse,
      ] = await Promise.all([
        fetch("https://autoapi.dezinfeksiyatashkent.uz/api/cars"),
        fetch("https://autoapi.dezinfeksiyatashkent.uz/api/brands"),
        fetch("https://autoapi.dezinfeksiyatashkent.uz/api/models"),
        fetch("https://autoapi.dezinfeksiyatashkent.uz/api/categories"),
        fetch("https://autoapi.dezinfeksiyatashkent.uz/api/cities"),
      ]);

      const carsData = await carsResponse.json();
      const brandsData = await brandsResponse.json();
      const modelsData = await modelsResponse.json();
      const categoriesData = await categoriesResponse.json();
      const citiesData = await citiesResponse.json();

      // Map the cars data with related names
      const mappedData = carsData.data.map((car) => ({
        ...car,
        brand_name:
          brandsData.data.find((brand) => brand.id === car.brand_id)?.title ||
          "N/A",
        model_name:
          modelsData.data.find((model) => model.id === car.model_id)?.name ||
          "N/A",
        category_name:
          categoriesData.data.find(
            (category) => category.id === car.category_id
          )?.name_en || "N/A",
        city_name:
          citiesData.data.find((city) => city.id === car.city_id)?.name ||
          "N/A",
      }));

      setData(mappedData);
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    getFunc();
  }, []);

  const filteredData = data.filter(
    (car) =>
      car.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.city_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const resetForm = () => {
    setBrandId("");
    setModelId("");
    setCityId("");
    setColor("");
    setYear("");
    setSeconds("");
    setCategoryId("");
    setMaxSpeed("");
    setMaxPeople("");
    setTransmission("");
    setMotor("");
    setDriveSide("");
    setPetrol("");
    setLimitPerDay("");
    setDeposit("");
    setPremiumProtection("");
    setPriceInAed("");
    setPriceInUsd("");
    setPriceInAedSale("");
    setPriceInUsdSale("");
    setLocationId("");
    setInclusive(false);
    setPic1(null);
    setPic2(null);
    setCurrentItemId(null);
  };

  const addFunc = async (e) => {
    e.preventDefault();

    if (!pic1 || !pic2) {
      toast.error("Please select two images");
      return;
    }

    const formData = new FormData();
    formData.append("brand_id", brandId);
    formData.append("model_id", modelId);
    formData.append("city_id", cityId);
    formData.append("color", color);
    formData.append("year", year);
    formData.append("seconds", seconds);
    formData.append("category_id", categoryId);
    formData.append("max_speed", maxSpeed);
    formData.append("max_people", maxPeople);
    formData.append("transmission", transmission);
    formData.append("motor", motor);
    formData.append("drive_side", driveSide);
    formData.append("petrol", petrol);
    formData.append("limitperday", limitPerDay);
    formData.append("deposit", deposit);
    formData.append("premium_protection", premiumProtection);
    formData.append("price_in_aed", priceInAed);
    formData.append("price_in_usd", priceInUsd);
    formData.append("price_in_aed_sale", priceInAedSale);
    formData.append("price_in_usd_sale", priceInUsdSale);
    formData.append("location_id", locationId);
    formData.append("inclusive", inclusive);
    formData.append("images", pic1);
    formData.append("images", pic2);

    try {
      const response = await fetch(
        "https://autoapi.dezinfeksiyatashkent.uz/api/cars",
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
        `https://autoapi.dezinfeksiyatashkent.uz/api/cars/${id}`,
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
    setBrandId(item?.brand_id);
    setModelId(item?.model_id);
    setCityId(item?.city_id);
    setColor(item?.color);
    setYear(item?.year);
    setSeconds(item?.seconds);
    setCategoryId(item?.category_id);
    setMaxSpeed(item?.max_speed);
    setMaxPeople(item?.max_people);
    setTransmission(item?.transmission);
    setMotor(item?.motor);
    setDriveSide(item?.drive_side);
    setPetrol(item?.petrol);
    setLimitPerDay(item?.limitperday);
    setDeposit(item?.deposit);
    setPremiumProtection(item?.premium_protection);
    setPriceInAed(item?.price_in_aed);
    setPriceInUsd(item?.price_in_usd);
    setPriceInAedSale(item?.price_in_aed_sale);
    setPriceInUsdSale(item?.price_in_usd_sale);
    setLocationId(item?.location_id);
    setInclusive(item?.inclusive);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Update API data
  const updateFunc = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("brand_id", brandId);
    formData.append("model_id", modelId);
    formData.append("city_id", cityId);
    formData.append("color", color);
    formData.append("year", year);
    formData.append("seconds", seconds);
    formData.append("category_id", categoryId);
    formData.append("max_speed", maxSpeed);
    formData.append("max_people", maxPeople);
    formData.append("transmission", transmission);
    formData.append("motor", motor);
    formData.append("drive_side", driveSide);
    formData.append("petrol", petrol);
    formData.append("limitperday", limitPerDay);
    formData.append("deposit", deposit);
    formData.append("premium_protection", premiumProtection);
    formData.append("price_in_aed", priceInAed);
    formData.append("price_in_usd", priceInUsd);
    formData.append("price_in_aed_sale", priceInAedSale);
    formData.append("price_in_usd_sale", priceInUsdSale);
    formData.append("location_id", locationId);
    formData.append("inclusive", inclusive);
    formData.append("images", pic1);
    formData.append("images", pic2);

    try {
      const response = await fetch(
        `https://autoapi.dezinfeksiyatashkent.uz/api/cars/${currentItemId}`,
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
      toast.error("Failed to update item");
    }
  };

  return (
    <div>
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">Cars</h2>

        <div className="mb-4 flex justify-between">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={modalFunc}
          >
            Add New Item
          </button>

          <input
            type="text"
            placeholder="Search..."
            className="border p-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">#</th>
              <th className="px-6 py-3 border-b">Brand</th>
              <th className="px-6 py-3 border-b">Model</th>
              <th className="px-6 py-3 border-b">Category</th>
              <th className="px-6 py-3 border-b">City</th>
              <th className="px-6 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id}>
                <td className="px-6 py-4 border-b">{index + 1}</td>
                <td className="px-6 py-4 border-b">{item.brand_name}</td>
                <td className="px-6 py-4 border-b">{item.model_name}</td>
                <td className="px-6 py-4 border-b">{item.category_name}</td>
                <td className="px-6 py-4 border-b">{item.city_name}</td>
                <td className="px-6 py-4 border-b">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => openEditModal(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => deleteFunc(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full max-h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {isEditMode ? "Edit Item" : "Add New Item"}
            </h2>

            <form onSubmit={isEditMode ? updateFunc : addFunc}>
              <div className="mb-4">
                <label className="block mb-2">Brand</label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full p-2 border"
                  required
                >
                  <option value="" disabled>
                    Select a Brand
                  </option>
                  {/* Options for brands */}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Model</label>
                <select
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  className="w-full p-2 border"
                  required
                >
                  <option value="" disabled>
                    Select a Model
                  </option>
                  {/* Options for models */}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">City</label>
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full p-2 border"
                  required
                >
                  <option value="" disabled>
                    Select a City
                  </option>
                  {/* Options for cities */}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full p-2 border"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Year</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-2 border"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Seconds</label>
                <input
                  type="text"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="w-full p-2 border"
                  required
                />
              </div>

              {/* Repeat similar fields for other input types... */}

              <div className="mb-4">
                <label className="block mb-2">Images</label>
                <input
                  type="file"
                  onChange={(e) => setPic1(e.target.files[0])}
                  className="w-full p-2 border mb-2"
                  required
                />
                <input
                  type="file"
                  onChange={(e) => setPic2(e.target.files[0])}
                  className="w-full p-2 border"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {isEditMode ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;
