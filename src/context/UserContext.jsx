import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const UserContext = createContext();
const socket = io(import.meta.env.VITE_PUBLIC_API_URL);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const updateUser = (newUser) => {
    setUser(newUser);
    sessionStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    socket.emit("user-logout", { userId: user._id });
    socket.disconnect();
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);