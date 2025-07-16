import {createContext, useContext} from 'react';
import {ID, Models} from "react-native-appwrite"
import { account } from './appwrite';


type AuthContextType = {
    // user: Models.User<Models.Preferences> | null;
    signIn: (email: string, password: string) => Promise<void | null | string>;
    signUp: (email: string, password: string) => Promise<void | null | string>;
}

const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({children}: {children: React.ReactNode}) {

    const signUp = async (email:string, password:string) => {
        try {
            await account.create(ID.unique(), email,password)
            await signIn(email,password)
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }
            return "error has ocurred while signing up";
        }
    }

     const signIn = async (email:string, password:string) => {
       try {
            await account.createEmailPasswordSession(email,password)
            return null;
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }
            return "error has ocurred while signing in";
        }
    }
    return (
    <AuthContext.Provider value={{
        // user
        signIn,
        signUp
    }}>
        {children}
    </AuthContext.Provider>)
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}