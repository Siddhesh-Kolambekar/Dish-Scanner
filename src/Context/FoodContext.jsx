/* eslint-disable react/prop-types */
import  { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foodData, setFoodData] = useState(null);

  const updateFoodData = (data) => {
    setFoodData(data);
  };

  return (
    <FoodContext.Provider value={{ foodData, updateFoodData }}>
      {children}
    </FoodContext.Provider>
  );
};
