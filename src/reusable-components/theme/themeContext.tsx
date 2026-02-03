import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_COLOR } from '../../utils/constants/constants';
type ThemeType = 'light' | 'dark';

export interface ThemeColors {
    background: string;
    text: string;
    subText: string;
    primary: string;
    secondary: string;
    border: string;
    card: string;
    buttonText: string;
    inputBackground: string;
    placeholder: string; // Thêm màu placeholder
}

interface ThemeContextType {
    theme: ThemeType;
    toggleTheme: () => void;
    colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

//***Light Theme
const lightColors: ThemeColors = {  //instance của ThemeColors để dùng từng Screen
    background: '#F2F2F7',     
    text: '#000000',
    subText: '#6C6C6C',
    primary: APP_COLOR.BLUE,
    secondary: APP_COLOR.BLUE_LIGHT,
    border: '#D1D1D6',
    card: '#FFFFFF',
    buttonText: '#FFFFFF',
    inputBackground: '#FFFFFF',
    placeholder: '#C7C7CD'
};

//***Dark Theme
const darkColors: ThemeColors = {
    background: '#000000',
    text: '#F2F2F7',
    subText: '#8E8E93',
    primary: '#0A84FF',
    secondary: '#303030',
    border: '#38383A',
    card: '#1C1C1E',
    buttonText: '#FFFFFF',
    inputBackground: '#2C2C2E',
    placeholder: '#636366'
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemScheme = useColorScheme();  //useColorScheme(); hàm trả về giao diện của user (light hoặc dark)
    const [theme, setTheme] = useState<ThemeType>('light');

    useEffect(() => {
        const loadTheme = async () => {  //hàm lấy theme từ AsyncStorage
            const savedTheme = await AsyncStorage.getItem('app_theme');  //lấy theme đã lưu gán vào savedTheme
            if (savedTheme === 'light' || savedTheme === 'dark') {
                setTheme(savedTheme);
            } else if (systemScheme === 'light' || systemScheme === 'dark') {
                setTheme(systemScheme);
            }
        };
        loadTheme();
    }, [systemScheme]);  //---> hàm này để đồng bộ giao diện app với giao diện hệ thống (điện thoại user)

    //==Hàm chuyển đổi theme==
    const toggleTheme = async () => {  
        const newTheme = theme === 'light' ? 'dark' : 'light';  //nếu theme hiện tại là light thì chuyển sang dark, ngược lại chuyển sang light
        setTheme(newTheme);
        await AsyncStorage.setItem('app_theme', newTheme);  //lưu theme mới vào AsyncStorage
    };

    const colors = theme === 'light' ? lightColors : darkColors;  //nếu theme là light thì lấy lightColors, ngược lại lấy darkColors

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>  
            {children} 
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};