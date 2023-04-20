import { ReactNode, createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import {
  getToken,
  removeToken,
  saveToken,
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from "../storage/storageConfig";

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
};

type AuthContextDataProps = {
  user: UserDTO;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoading, setIsLoading] = useState(false);

  async function updateUserAndToken(user: UserDTO, token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
  }

  async function storageUserAndToken(
    user: UserDTO,
    token: string,
    refreshToken: string
  ) {
    try {
      setIsLoading(true);
      await storageUserSave(user);
      await saveToken({ token, refreshToken });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user && data.token && data.refresh_token) {
        setIsLoading(true);

        storageUserAndToken(data.user, data.token, data.refresh_token);
        updateUserAndToken(data.user, data.token);
      }
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setIsLoading(true);
      setUser({} as UserDTO);
      await storageUserRemove();
      await removeToken();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated);
      await storageUserSave(userUpdated);
    } catch (error) {
      throw error;
    }
  }

  async function loadUserData() {
    const userLogged = await storageUserGet();
    const { token } = await getToken();

    if (token && userLogged) {
      updateUserAndToken(userLogged, token);
    }
  }

  useEffect(() => {
    loadUserData;
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    return () => {
      subscribe();
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signOut, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
