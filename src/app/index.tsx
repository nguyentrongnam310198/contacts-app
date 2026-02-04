import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import StorageService, { StorageKeys } from "../utils/storage/storage";
import { getProfileApi } from "../utils/api/api";
import { useAppContext } from '../context-api/app.context'
import { useEffect } from "react";



// 👉 index.tsx = file quyết định người dùng vào đâu khi mở app (Login - Home)
// 👉 Chỉ chạy 1 lần khi app start

//Luồng hoạt động tổng thể 🔁
// App mở
//  ↓
// index.tsx (RootPage)
//  ↓
// Có ACCESS_TOKEN ?
//  ├─ ❌ Không → /login
//  └─ ✅ Có
//       ↓
//       Gọi getProfileApi
//       ├─ ❌ Lỗi → Xóa token → /login
//       └─ ✅ OK → setUser → /(tabs)


const RootPage = () => {
    const { setUser } = useAppContext();
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        const checkAuth = async () => {
            try {
    
                const token = await StorageService.getItem(StorageKeys.ACCESS_TOKEN);
    
                if (!token) {
                    navigation.replace("login");
                    return;
                }
    
                // Có token -> Gọi API check profile
                const res = await getProfileApi();
    
                if (res && res.data) {
                    setUser(res.data);
                    navigation.replace('home');
                } else {
                    // Token hết hạn hoặc không hợp lệ -> Xóa và về Login
                    await StorageService.removeItem(StorageKeys.ACCESS_TOKEN);
                    navigation.replace("login");
                }
            } catch (e) {
                console.error('checkAuth error:', e);
                await StorageService.removeItem(StorageKeys.ACCESS_TOKEN);
                navigation.replace("login");
            }
        };
    
        checkAuth();
    }, [navigation, setUser]);

    return (
        // <View>
        //     <ActivityIndicator />
        // </View>
        <>

        </>
    );
};

export default RootPage;



