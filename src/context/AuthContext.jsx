import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (credentials) => {
    const loginEndpoint = "/auth/login";
    try {
      console.log(credentials);
      console.log(import.meta.env.VITE_API_BASE_URL + loginEndpoint);
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + loginEndpoint,
        {
          email: credentials.email,
          password: credentials.password,
        },
      );

      console.log(response);
      if (response.status === 201 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        // Optionally, fetch user data here
        // fetchUserData(data.token);
        console.log(response.data.user);
        setUser(response.data.user); // Set user data if available
        navigate("/");
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const requestInterceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  // const fetchUserData = async (authToken) => {
  //     // Implement fetching user data using the token
  // };

  const value = {
    token,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
