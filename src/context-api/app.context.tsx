import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    // Contacts stored in memory (no AsyncStorage) -- local contacts added by user
    contacts: any[];
    setContacts: (c: any[]) => void;
    addContact: (c: any) => void;
    // Favorites - stored in AsyncStorage
    favorites: string[];  // Array of favorite contact IDs
    toggleFavorite: (contactId: string | number) => Promise<void>;
    isFavorite: (contactId: string | number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [appLoading, setAppLoading] = useState(true);
    const [contacts, setContacts] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load favorites từ AsyncStorage khi app khởi động
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const stored = await AsyncStorage.getItem('favorites');
                if (stored) {
                    setFavorites(JSON.parse(stored));
                }
            } catch (error) {
                console.error('Load favorites error:', error);
            }
        };
        loadFavorites();
    }, []);

    // Toggle favorite
    const toggleFavorite = async (contactId: string | number) => {
        try {
            const idStr = String(contactId);
            let newFavorites: string[];
            
            if (favorites.includes(idStr)) {
                newFavorites = favorites.filter(id => id !== idStr);
            } else {
                newFavorites = [...favorites, idStr];
            }
            
            setFavorites(newFavorites);
            await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
        } catch (error) {
            console.error('Toggle favorite error:', error);
        }
    };

    // Check nếu contact là favorite
    const isFavorite = (contactId: string | number): boolean => {
        return favorites.includes(String(contactId));
    };

    const updateUser = (updates: Partial<UserData>) => {
        if (user) {
            setUser({ ...user, ...updates });
        }
    };

    const logout = async () => {
        // Chỉ logout trên provider (bỏ clear toàn bộ AsyncStorage để không xóa danh bạ/token)
        try {
            setUser(null);
        } catch (error) {
            console.log("Logout error", error);
        }
    };

    const addContact = (c: any) => {
        // prepend new contact so it appears first in lists
        setContacts(prev => [c, ...prev]);
    };

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                updateUser,
                logout,
                isLoggedIn: !!user,
                appLoading,
                contacts,
                setContacts,
                addContact,
                favorites,
                toggleFavorite,
                isFavorite
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