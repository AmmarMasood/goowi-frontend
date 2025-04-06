import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../libs/axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        logout();
      } else {
        setUser({ email: payload.email, role: payload.role });
        getUserDetails();
      }
    }
    setLoading(false);
  }, []);

  const getUserDetails = async () => {
    const { data } = await axiosInstance.get("/auth/me");
    setUserDetails({
      ...data.user,
      userId: data.user._id,
      _id: data.profileId,
      profileExists: data.profileExists,
      profilePicture: data.profilePicture,
    });
  };

  const login = async (email, password) => {
    const { data } = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    getUserDetails();
  };

  const register = async (userDetails) => {
    const { data } = await axiosInstance.post("/auth/register", userDetails);
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    getUserDetails();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setUserDetails(null);
  };

  const resendVerificationEmail = async () => {
    await axiosInstance.get("auth/resent-verify-email");
  };

  const updateProfileExists = async (exists) => {
    setUserDetails((prev) => ({ ...prev, profileExists: exists }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userDetails,
        resendVerificationEmail,
        login,
        register,
        logout,
        updateProfileExists,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
