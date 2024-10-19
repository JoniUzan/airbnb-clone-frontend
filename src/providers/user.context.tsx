import { useToast } from "@/components/ui/use-toast";
import api from "@/services/api.service";
import { useLocalStorage } from "@uidotdev/usehooks";
import { AxiosError } from "axios";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  FC,
} from "react";
import { useNavigate } from "react-router-dom";

interface IWhishlist {
  title: string;
  list: string[];
}

interface User {
  user: {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthday: Date;
    reviews: string[];
    wishlists: IWhishlist[];
    picture?: string;
    phoneNumber?: string;
  };
}

interface AuthContextType {
  loggedInUser: User | null | undefined;
  login: (userData: LoginData) => Promise<LoginResponse>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  handleGoogleSuccess: (credentialResponse: {
    credential: string;
  }) => Promise<void>;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

interface LoginResponse {
  token: string;
  user: User; // Changed from `object` to `User`
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null | undefined>(
    undefined
  );
  const [token, setToken] = useLocalStorage<string | null>("token", null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoggedInUser(null);
      return;
    }

    async function fetchUser() {
      try {
        const response = await api.get("/auth/loggedInUser");
        setLoggedInUser(response.data);
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          console.error("Invalid token, logging out");
          logout();
        } else if (axiosError.response?.status === 404) {
          console.error("User not found, logging out");
          logout();
        } else {
          console.error("Error fetching user data:", error);
        }
      }
    }

    fetchUser();
  }, [token]);

  const logout = () => {
    setToken(null);
    setLoggedInUser(null);
    navigate("/");
    toast({
      title: "Logout",
      description: "You have been logged in",
    });
  };

  const login = async (userData: LoginData): Promise<LoginResponse> => {
    try {
      const response = await api.post("/auth/login", userData);

      setToken(response.data.token);
      setLoggedInUser(response.data.user); // Ensure the user is set correctly
      window.location.reload();

      toast({
        title: "Success!",
        description: "You have been logged in",
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Error logging in:", error);
      toast({
        title: "Failed",
        description: "Username or password incorrect",
      });
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      await api.post("/auth/register", userData);
      toast({
        title: "Success",
        description: "You have registered successfully",
      });
      window.location.reload();
    } catch (error: unknown) {
      console.error("Error registering:", error);
      toast({
        title: "Failed",
        description: "There was an error while registered",
      });
      throw error;
    }
  };

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }): Promise<void> => {
    const { credential } = credentialResponse;

    if (!credential) {
      console.error("Credential is undefined");
      return;
    }
    try {
      const response = await api.post("/auth/google", { credential });
      setToken(response.data.token);
      setLoggedInUser(response.data.user);
      toast({
        title: "Success!",
        description: "You have been logged in",
      });
      window.location.reload();
    } catch (error: unknown) {
      console.error("Google login failed:", error);
      toast({
        title: "Failed",
        description: "Username or password incorrect",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ loggedInUser, login, register, logout, handleGoogleSuccess }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
