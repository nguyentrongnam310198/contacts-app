import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import vi from './locales/vi.json';
import en from './locales/en.json';

const RESOURCES = {  //Khai báo danh sách ngôn ngữ mà app hỗ trợ
                                      //translation là namespace mặc định của i18next
    vi: { translation: vi },
    en: { translation: en },
};

const LANGUAGE_DETECTOR = {
    type: 'languageDetector' as const,  //Khai báo với i18next đây là một plugin dùng để phát hiện ngôn ngữ.
    async: true,  //Cho phép thực hiện các tác vụ bất đồng bộ
    detect: async (callback: (lang: string) => void) => {  //Hàm detect: 
        try {

            const savedLanguage = await AsyncStorage.getItem('user-language');
            if (savedLanguage) {  //Kiểm tra trong máy (qua AsyncStorage) xem trước đó người dùng có lưu lựa chọn ngôn ngữ nào không (user-language).
                callback(savedLanguage);  //Nếu có: Trả về ngôn ngữ đó qua callback.
                return;
            }
            callback('vi');  
        } catch (error) {
            console.log('Error reading language', error);
            callback('vi');  //Nếu không (lần đầu mở app): Mặc định trả về tiếng Việt (vi).
        }
    },

    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {  //khi gọi i18n.changeLanguage('en')
                 //→ i18next sẽ tự động gọi cacheUserLanguage
                 //→ Lưu 'en' vào AsyncStorage
            await AsyncStorage.setItem('user-language', language);
                 //AsyncStorage: Bộ nhớ key–value cục bộ trên thiết bị
                 //hoạt động bất đồng bộ -> trả về Promises
                 //('user-language', language)  --> key, value
        } catch (error) {
            console.log('Error saving language', error);
        }
    },
};

i18n  //khởi tạo i18next 
    .use(LANGUAGE_DETECTOR) // → phát hiện ngôn ngữ
    .use(initReactI18next)  // → kết nối React
    .init({  // → cấu hình chính
        compatibilityJSON: 'v4',  //Fix lỗi format JSON cũ (đặc biệt trên Android) - i18next mặc định dùng v4
        resources: RESOURCES,  // -->Truyền danh sách ngôn ngữ đã khai báo
        fallbackLng: 'vi',  //Nếu:
                                // Không detect được ngôn ngữ
                                // Hoặc thiếu key dịch
                                    // → i18next sẽ fallback sang tiếng Việt

        interpolation: {  //React đã tự chống XSS → không cần escape
                                   //Bắt buộc set false cho React
            escapeValue: false,
        },
        react: {
            useSuspense: false  //Thêm dòng này để tránh lỗi suspense trên Android nếu có
        }
    });

export default i18n;