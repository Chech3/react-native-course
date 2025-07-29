import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

type AuthContextType = {
  loadingUser: boolean;
  user: Models.User<Models.Preferences> | null;
  signIn: (email: string, password: string) => Promise<void | null | string>;
  signUp: (email: string, password: string) => Promise<void | null | string>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  const getUser = async () => {
    try {
      const session = await account.get();
      setUser(session);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      await signIn(email, password);
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "error has ocurred while signing up";
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser(session);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "error has ocurred while signing in";
    }
  };

  const signOut = async() => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        signOut,
        loadingUser,
        user,
        signIn,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null || undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
