import { useMemo, useState } from "react";
import { AuthContext } from "./auth-hooks";
import { getAuthToken } from "../api/client";
import { login as loginRequest, logout as logoutRequest } from "../api/adminApi";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getAuthToken());

  const login = async (username, password) => {
    const data = await loginRequest(username, password);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    logoutRequest();
    setToken(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
