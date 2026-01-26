import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Định nghĩa danh sách các Key (Enum) để tránh gõ sai
export enum StorageKeys {
    ACCESS_TOKEN = 'access_token',
    USER_INFO = 'user_info',
    CONTACTS = 'contacts',
    FAVORITES = 'favorites',
}
// 2. Tạo đối tượng StorageService với các hàm tiện ích
const StorageService = {
    //**Hàm lưu dữ liệu (Tự động chuyển sang chuỗi JSON)
    setItem: async (key: StorageKeys, value: any) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error(`[Storage] Lỗi lưu key ${key}:`, e);
        }
    },

    //**Hàm lấy dữ liệu (Tự động chuyển từ JSON sang Object/String gốc)
    getItem: async (key: StorageKeys) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value === null) return null;

            try {
                // Thử parse JSON
                return JSON.parse(value);
            } catch (e) {
                // Nếu lỗi parse (do dữ liệu cũ là chuỗi thô), trả về nguyên gốc
                return value;
            }
        } catch (e) {
            console.error(`[Storage] Lỗi lấy key ${key}:`, e);
            return null;
        }
    },

    //**Hàm xóa một key cụ thể
    removeItem: async (key: StorageKeys) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error(`[Storage] Lỗi xóa key ${key}:`, e);
        }
    },

    //**Hàm xóa sạch (Dùng khi Logout)
    clear: async () => {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            console.error('[Storage] Lỗi clear storage:', e);
        }
    }
};

export default StorageService;


// 👉 AsyncStorage dùng khi nào?
// Token đăng nhập (⚠️ không nhạy cảm)
// User settings
// Language
// Theme
// Cache tạm
// Form draft --> bản nháp của form (dữ liệu người dùng đang nhập nhưng CHƯA submit), (submit: nộp, đệ trình)
// Danh bạ nhỏ (như code bạn gửi)

//*** Data lớn hoặc phức tạp --> dùng DB