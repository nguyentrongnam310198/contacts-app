import { AppState, AppStateStatus } from 'react-native';

// Cấu hình để SWR lắng nghe trạng thái App (Background <-> Active)
export const swrConfig = {
    provider: () => new Map(), // Cache provider
    isVisible: () => { return true },
    initFocus(callback: () => void) {
        let appState = AppState.currentState;

        const onAppStateChange = (nextAppState: AppStateStatus) => {
            // Nếu app chuyển từ background -> active thì gọi callback (revalidate)
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                callback();
            }
            appState = nextAppState;
        };

        // Lắng nghe sự kiện
        const subscription = AppState.addEventListener('change', onAppStateChange);

        return () => {
            subscription.remove();
        };
    },
    // Các cấu hình khác
    revalidateOnFocus: true, // Tự động gọi lại API khi app focus
    revalidateOnReconnect: true, // Tự động gọi lại khi có mạng
    refreshInterval: 0, // Không poll định kỳ (tùy chọn)
};