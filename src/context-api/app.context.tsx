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
    updateContact: (contactId: string | number, updates: any) => void;
    // Favorites - stored in AsyncStorage
    favorites: string[];  // Array of favorite contact IDs
    toggleFavorite: (contactId: string | number) => Promise<void>;
    isFavorite: (contactId: string | number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [appLoading, _setAppLoading] = useState(true);
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

    // Toggle favorite (compute synchronously from current state so caller can rely on updated value)
    const toggleFavorite = async (contactId: string | number) => {
        const idStr = String(contactId);
        try {
            const normalized = favorites.map(String);
            const currentlyFavorite = normalized.includes(idStr);
            const newFavorites: string[] = currentlyFavorite
                ? favorites.filter(id => String(id) !== idStr)
                : [...favorites, idStr];

            // Persist updated favorites and then update state so everything is consistent
            try {
                await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
            } catch (err) {
                console.error('AsyncStorage set favorites failed', err);
            }

            setFavorites(newFavorites);

            // Also update the contacts list so UI that depends on `contacts` updates immediately
            setContacts(prevContacts => prevContacts.map(c => {
                if (!c) return c;
                return String(c.id) === idStr ? { ...c, isFavorite: !currentlyFavorite } : c;
            }));

        } catch (error) {
            console.error('Toggle favorite error:', error);
        }
    };

    // Check nếu contact là favorite (compare as strings to avoid type mismatch)
    const isFavorite = (contactId: string | number): boolean => {
        return favorites.some(f => String(f) === String(contactId));
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

    const updateContact = (contactId: string | number, updates: any) => {
        setContacts(prev => {
            const index = prev.findIndex((c: any) => String(c.id) === String(contactId));
            if (index >= 0) {
                const newList = [...prev];
                newList[index] = { ...newList[index], ...updates };
                return newList;
            }
            return prev;
        });
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
                updateContact,
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