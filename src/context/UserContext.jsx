import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize from localStorage (persist login)
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("user");
    if (token && userInfo) {
      return { isLoggedIn: true, ...JSON.parse(userInfo), token };
    }
    return { isLoggedIn: false, usertype: null, username: "" };
  });

  // Save user info and token on login
  const login = ({ token, ...userData }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser({ ...userData, isLoggedIn: true, token });
  };

  // Clear user info and token on logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser({ isLoggedIn: false, usertype: null, username: "", token: null });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
