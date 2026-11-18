import { createContext, useState, useContext } from "react";

const UserContext = createContext();
// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [name, setName] = useState("");

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  return useContext(UserContext);
};
