import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import StorageService from "../utils/storage/storage";
// Định nghĩa kiểu dữ liệu User
interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    dob?: string;
    createdAt?: string;
    avatar?: string;
}

// Định nghĩa Context
interface AppContextType {
    user: UserData | null;
    setUser: (user: UserData | null) => void;
    updateUser: (updates: Partial<UserData>) => void;
    logout: () => void;
    isLoggedIn: boolean;
    appLoading: boolean; // Trạng thái đang check token
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [appLoading, setAppLoading] = useState(true); // Mặc định là đang load

    const updateUser = (updates: Partial<UserData>) => {
        if (user) {
            setUser({ ...user, ...updates });
        }
    };

    const logout = async () => {
        try {
            await StorageService.clear();
            setUser(null);
        } catch (error) {
            console.log("Logout error", error);
        }
    };

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                updateUser,
                logout,
                isLoggedIn: !!user,
                appLoading
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};