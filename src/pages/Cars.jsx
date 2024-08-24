import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Cars = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState([]);
  const [model, setModel] = useState([]);
  const [location, setLocation] = useState([]);
  const [brand, setBrand] = useState([]);
  const [city, setCity] = useState([]);

  // Close modal with esc
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

  const [formData, setFormData] = useState({
    brandId: "",
    modelId: "",
    cityId: "",
    color: "",
    year: "",
    seconds: "",
    categoryId: "",
    maxSpeed: "",
    maxPeople: "",
    transmission: "",
    motor: "",
    driveSide: "",
    petrol: "",
    limitPerDay: "",
    deposit: "",
    premiumProtection: "",
    priceInAed: "",
    priceInUsd: "",
    priceInAedSale: "",
    priceInUsdSale: "",
    locationId: "",
    inclusive: false,
    pic1: null,
    pic2: null,
    coverPic: null,
  });
  console.log(formData, "datttaaass");

  const getFunc = async () => {
    try {
      const [
        carsResponse,
        brandsResponse,
        modelsResponse,
        categoriesResponse,
        citiesResponse,
        locationsResponse,
      ] = await Promise.all([
        fetch("https://autoapi.dezinfeksiyatashkent.uz/api/cars"),
        fetch("https://autoapi.dezinfeksiyatashkent.uz/api/brands"),
        fetch("https://autoapi.dezinfeksiyatashkent.uz/api/models"),
        fetch("https://autoapi.dezinfeksiyatashkent.uz/api/categories"),
        fetch("https://autoapi.dezinfeksiyatashkent.uz/api/cities"),
        fetch("https://autoapi.dezinfeksiyatashkent.uz/api/locations"),
      ]);

      const carsData = await carsResponse.json();
      const brandsData = await brandsResponse.json();
      const modelsData = await modelsResponse.json();
      const categoriesData = await categoriesResponse.json();
      const citiesData = await citiesResponse.json();
      const locationsData = await locationsResponse.json();

      setBrand(brandsData.data);
      setModel(modelsData.data);
      setCategory(categoriesData.data);
      setCity(citiesData.data);
      setLocation(locationsData.data);

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
        location_name:
          locationsData.data.find((location) => location.id === car.location_id)
            ?.name || "N/A", // Added location name mapping
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

  const token = localStorage.getItem("tokenxon");

  const resetForm = () => {
    setFormData({
      brandId: "",
      modelId: "",
      cityId: "",
      color: "",
      year: "",
      seconds: "",
      categoryId: "",
      maxSpeed: "",
      maxPeople: "",
      transmission: "",
      motor: "",
      driveSide: "",
      petrol: "",
      limitPerDay: "",
      deposit: "",
      premiumProtection: "",
      priceInAed: "",
      priceInUsd: "",
      priceInAedSale: "",
      priceInUsdSale: "",
      locationId: "",
      inclusive: false,
      pic1: null,
      pic2: null,
      coverPic: null,
    });
    setCurrentItemId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files[0],
    }));
  };

  const addFunc = async (e) => {
    e.preventDefault();

    if (!formData.pic1 || !formData.pic2 || !formData.coverPic) {
      toast.error("Please select three images");
      return;
    }

    const submitData = new FormData();
    submitData.append("brand_id", formData.brandId);
    submitData.append("model_id", formData.modelId);
    submitData.append("city_id", formData.cityId);
    submitData.append("color", formData.color);
    submitData.append("year", formData.year);
    submitData.append("seconds", formData.seconds);
    submitData.append("category_id", formData.categoryId);
    submitData.append("max_speed", formData.maxSpeed);
    submitData.append("max_people", formData.maxPeople);
    submitData.append("transmission", formData.transmission);
    submitData.append("motor", formData.motor);
    submitData.append("drive_side", formData.driveSide);
    submitData.append("petrol", formData.petrol);
    submitData.append("limitperday", formData.limitPerDay);
    submitData.append("deposit", formData.deposit);
    submitData.append("premium_protection", formData.premiumProtection);
    submitData.append("price_in_aed", formData.priceInAed);
    submitData.append("price_in_usd", formData.priceInUsd);
    submitData.append("price_in_aed_sale", formData.priceInAedSale);
    submitData.append("price_in_usd_sale", formData.priceInUsdSale);
    submitData.append("location_id", formData.locationId);
    submitData.append("inclusive", formData.inclusive);
    submitData.append("images", formData.pic1);
    submitData.append("images", formData.pic2);
    submitData.append("cover", formData.coverPic);

    try {
      const response = await fetch(
        "https://autoapi.dezinfeksiyatashkent.uz/api/cars",
        {
          method: "POST",
          body: submitData,
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
        getFunc();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the item");
      console.error("Error:", error);
    }
  };

  const openEditModal = (item) => {
    setIsEditMode(true);
    setOpenModal(true);
    setCurrentItemId(item?.id);
    setFormData({
      brandId: item?.brand_id,
      modelId: item?.model_id,
      cityId: item?.city_id,
      color: item?.color,
      year: item?.year,
      seconds: item?.seconds,
      categoryId: item?.category_id,
      maxSpeed: item?.max_speed,
      maxPeople: item?.max_people,
      transmission: item?.transmission,
      motor: item?.motor,
      driveSide: item?.drive_side,
      petrol: item?.petrol,
      limitPerDay: item?.limitperday,
      deposit: item?.deposit,
      premiumProtection: item?.premium_protection,
      priceInAed: item?.price_in_aed,
      priceInUsd: item?.price_in_usd,
      priceInAedSale: item?.price_in_aed_sale,
      priceInUsdSale: item?.price_in_usd_sale,
      locationId: item?.location_id,
      inclusive: item?.inclusive,
      pic1: null,
      pic2: null,
      coverPic: null,
    });
  };

  const editFunc = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("brand_id", formData.brandId);
    submitData.append("model_id", formData.modelId);
    submitData.append("city_id", formData.cityId);
    submitData.append("color", formData.color);
    submitData.append("year", formData.year);
    submitData.append("seconds", formData.seconds);
    submitData.append("category_id", formData.categoryId);
    submitData.append("max_speed", formData.maxSpeed);
    submitData.append("max_people", formData.maxPeople);
    submitData.append("transmission", formData.transmission);
    submitData.append("motor", formData.motor);
    submitData.append("drive_side", formData.driveSide);
    submitData.append("petrol", formData.petrol);
    submitData.append("limitperday", formData.limitPerDay);
    submitData.append("deposit", formData.deposit);
    submitData.append("premium_protection", formData.premiumProtection);
    submitData.append("price_in_aed", formData.priceInAed);
    submitData.append("price_in_usd", formData.priceInUsd);
    submitData.append("price_in_aed_sale", formData.priceInAedSale);
    submitData.append("price_in_usd_sale", formData.priceInUsdSale);
    submitData.append("location_id", formData.locationId);
    submitData.append("inclusive", formData.inclusive);

    // Adding images if they are selected
    if (formData.pic1) {
      submitData.append("images", formData.pic1);
    }
    if (formData.pic2) {
      submitData.append("images", formData.pic2);
    }
    if (formData.coverPic) {
      submitData.append("cover", formData.coverPic);
    }

    try {
      const response = await fetch(
        `https://autoapi.dezinfeksiyatashkent.uz/api/cars/${currentItemId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: submitData,
        }
      );
      const elem = await response.json();
      if (elem?.success) {
        toast.success(elem?.message);
        closeModal();
        getFunc(); // Refresh the data after successful edit
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
        <h1 className="text-2xl font-semibold">Cars</h1>
        <div className="flex space-x-4">
          <button
            onClick={modalFunc}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add a new item
          </button>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full max-h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {isEditMode ? "Edit Item" : "Add New Item"}
            </h2>
            <form onSubmit={isEditMode ? editFunc : addFunc}>
              <select
                name="categoryId"
                id=""
                defaultValue={1}
                onChange={handleChange}
                className="block w-full px-4 py-2 mb-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
              >
                <option value="1" disabled>
                  Select category
                </option>
                {category &&
                  category.map((category, index) => (
                    <option key={index} value={category.id}>
                      {category.name_en}
                    </option>
                  ))}
              </select>

              <select
                name="brandId"
                id=""
                defaultValue={1}
                onChange={handleChange}
                className="block w-full px-4 py-2 mb-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
              >
                <option value="1" disabled>
                  Select brand
                </option>
                {brand &&
                  brand.map((brand, index) => (
                    <option key={index} value={brand.id}>
                      {brand.title}
                    </option>
                  ))}
              </select>

              <select
                name="modelId"
                id=""
                defaultValue={1}
                onChange={handleChange}
                className="block w-full px-4 py-2 mb-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
              >
                <option value="1" disabled>
                  Select model
                </option>
                {model &&
                  model.map((model, index) => (
                    <option key={index} value={model.id}>
                      {model.name}
                    </option>
                  ))}
              </select>

              <select
                name="locationId"
                id=""
                defaultValue={1}
                onChange={handleChange}
                className="block w-full px-4 py-2 mb-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
              >
                <option value="1" disabled>
                  Select location
                </option>
                {location &&
                  location.map((location, index) => (
                    <option key={index} value={location.id}>
                      {location.name}
                    </option>
                  ))}
              </select>

              <select
                name="cityId"
                id=""
                defaultValue={1}
                onChange={handleChange}
                className="block w-full px-4 py-2 mb-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
              >
                <option value="1" disabled>
                  Select city
                </option>
                {city &&
                  city.map((city, index) => (
                    <option key={index} value={city.id}>
                      {city.name}
                    </option>
                  ))}
              </select>

              {/* Form inputs as before */}
              <div className="mb-4">
                <label className="block text-gray-700 ">
                  <span className="text-red-600">*</span> Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Year
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Seconds
                </label>
                <input
                  type="text"
                  name="seconds"
                  value={formData.seconds}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Max Speed
                </label>
                <input
                  type="text"
                  name="maxSpeed"
                  value={formData.maxSpeed}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Max People
                </label>
                <input
                  type="text"
                  name="maxPeople"
                  value={formData.maxPeople}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Transmission
                </label>
                <input
                  type="text"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Motor
                </label>
                <input
                  type="text"
                  name="motor"
                  value={formData.motor}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Drive Side
                </label>
                <input
                  type="text"
                  name="driveSide"
                  value={formData.driveSide}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Petrol
                </label>
                <input
                  type="text"
                  name="petrol"
                  value={formData.petrol}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Limit Per Day
                </label>
                <input
                  type="text"
                  name="limitPerDay"
                  value={formData.limitPerDay}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Deposit
                </label>
                <input
                  type="text"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Premium Protection
                </label>
                <input
                  type="text"
                  name="premiumProtection"
                  value={formData.premiumProtection}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Price in AED
                </label>
                <input
                  type="text"
                  name="priceInAed"
                  value={formData.priceInAed}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Price in USD
                </label>
                <input
                  type="text"
                  name="priceInUsd"
                  value={formData.priceInUsd}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Price in AED (Sale)
                </label>
                <input
                  type="text"
                  name="priceInAedSale"
                  value={formData.priceInAedSale}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  <span className="text-red-600">*</span> Price in USD (Sale)
                </label>
                <input
                  type="text"
                  name="priceInUsdSale"
                  value={formData.priceInUsdSale}
                  onChange={handleChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Inclusive</label>
                <input
                  type="checkbox"
                  name="inclusive"
                  checked={formData.inclusive}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Upload Image 1</label>
                <input
                  type="file"
                  name="pic1"
                  onChange={handleFileChange}
                  className="block w-full mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Upload Image 2</label>
                <input
                  type="file"
                  name="pic2"
                  onChange={handleFileChange}
                  className="block w-full mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  Upload Cover Image
                </label>
                <input
                  type="file"
                  name="coverPic"
                  onChange={handleFileChange}
                  className="block w-full mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              >
                {isEditMode ? "Save Changes" : "Add Item"}
              </button>
            </form>

            <button
              onClick={closeModal}
              className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Display the table of cars */}
      <table className="w-full bg-white border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left border-b font-medium">Brand</th>
            <th className="px-4 py-2 text-left border-b font-medium">Model</th>
            <th className="px-4 py-2 text-left border-b font-medium">
              Category
            </th>
            <th className="px-4 py-2 text-left border-b font-medium">City</th>
            
            <th className="px-4 py-2 text-left border-b font-medium">Color</th>
            <th className="px-4 py-2 text-left border-b font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((car) => (
            <tr key={car.id} className="">
              <td className="px-4 py-2 text-left border-b">{car.brand_name}</td>
              <td className="px-4 py-2 text-left border-b">{car.model_name}</td>
              <td className="px-4 py-2 text-left border-b">
                {car.category_name}
              </td>
              <td className="px-4 py-2 text-left border-b">{car.city_name}</td>
              
              <td className="px-4 py-2 text-left border-b">{car.color}</td>
              <td className="px-4 py-2 text-left border-b space-x-2 flex items-center justify-start">
                <button
                  onClick={() => openEditModal(car)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232a3 3 0 010 4.242l-7.07 7.07a1 1 0 01-.293.21l-3 1a1 1 0 01-1.27-1.27l1-3a1 1 0 01.21-.293l7.07-7.07a3 3 0 014.242 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 3.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-10 10a1 1 0 01-.293.21l-3 1a1 1 0 01-1.27-1.27l1-3a1 1 0 01.21-.293l10-10z"
                    ></path>
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => deleteFunc(car.id)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cars;
