import { useState, useEffect, useContext } from "react";
import QRCodeCard from "./QRCodeCard.jsx";
import { useNavigate } from "react-router-dom";
import { AdminLoginContext } from "../Context/AdminLoginContext.jsx";

const FIREBASE_DATABASE_URL = import.meta.env.FIREBASE_DATABASE_URL;

function AllDishes() {
  const { AdminLogin, AdminLoginUpdater } = useContext(AdminLoginContext);
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${FIREBASE_DATABASE_URL}/Dishes/.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Firebase returned HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const dishesArray = data
          ? Object.keys(data).map((key) => {
              return { id: key, ...data[key] };
            })
          : [];
        setMenuData(dishesArray);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data from Firebase:", error);
        setIsLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    setMenuData(menuData.filter((dish) => dish.id !== id)); // Update the state to remove the dish
  };

  return (
    <>
      <div className="flex justify-between items-center px-6 py-4 bg-blue-100 shadow-md rounded-lg">
        <button
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-5 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
          onClick={() => navigate("/add-dish")}
        >
          ➕ Add Dish
        </button>
        <button
          className="bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold py-2 px-5 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
          onClick={() => AdminLoginUpdater()}
        >
          {AdminLogin ? "🚪 Logout" : "🔑 Login"}
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full w-full flex justify-center items-center py-12">
            <img
              className="w-64 h-64 animate-pulse"
              src="https://ik.imagekit.io/m9qnay09g/Animation%20-%201737285406045.gif?updatedAt=1737286046150"
              alt="Loading"
            />
          </div>
        ) : menuData.length > 0 ? (
          menuData.map((dish) => {
            const { dishName, id, items } = dish;
            const jsonData = JSON.stringify(dish);

            return (
              <div
                className="bg-white rounded-lg shadow-lg p-4 transform hover:scale-105 transition duration-300"
                key={id}
              >
                <QRCodeCard
                  dish={dish}
                  dishName={dishName}
                  jsonData={jsonData}
                  items={items}
                  onDelete={handleDelete}
                />
              </div>
            );
          })
        ) : (
          <div className="col-span-full w-full flex flex-col justify-center items-center py-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No dishes found in the menu.
            </p>
            <button
              className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-600 transition duration-300"
              onClick={() => navigate("/add-dish")}
            >
              Add Your First Dish
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default AllDishes;
