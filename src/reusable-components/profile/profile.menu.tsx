import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Modal, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCode from 'react-native-qrcode-svg';
import InforCard from '../card/info.card';
import AppButton from '../button/app.button';
import { APP_COLOR } from '../../utils/constants/constants';
import { ThemeColors } from '../theme/themeContext';
import { useTranslation } from 'react-i18next';

interface ProfileMenuProps {
    user: any;
    onEditPress: () => void;
    isDarkTheme: boolean;
    toggleTheme: () => void;
    onLogout: () => void;
    colors: ThemeColors;
}

const ProfileMenu = ({ user, onEditPress, isDarkTheme, toggleTheme, onLogout, colors }: ProfileMenuProps) => {
    const styles = createStyles(colors);
    const [isQrModalVisible, setQrModalVisible] = useState(false);
    const [qrData, setQrData] = useState('');
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <View>
            <View style={styles.userNameSection}>
                <Pressable
                    style={({ pressed }) => [
                        styles.qrIconBtn,
                        { opacity: pressed ? 0.5 : 1 }
                    ]}
                    onPress={() => {
                        // Lấy thông tin từ props user
                        const userData = {
                            firstName: user?.firstName,
                            lastName: user?.lastName,
                            email: user?.email,
                            dob: user?.dob,
                        };
                        setQrData(JSON.stringify(userData));
                        setQrModalVisible(true);
                    }}
                >
                    <MaterialIcons
                        name="qrcode-scan"
                        size={24}
                        color={colors.text} // Icon đổi màu theo theme
                    />
                </Pressable>

                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </View>
            </View>

            <View style={styles.menuSection}>
                <InforCard
                    icon="pencil"
                    label={t('profile.edit_title')}
                    onPress={onEditPress}
                    textColor={colors.text}
                />
                <View style={styles.themeRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="theme-light-dark" size={24} color={colors.text} style={{ marginRight: 15 }} />
                        <Text style={{ fontSize: 16, color: colors.text }}>{t('profile.dark_mode')}</Text>
                    </View>
                    <Switch
                        value={isDarkTheme}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: colors.primary }}
                        thumbColor={'#f4f3f4'}
                    />
                </View>

                <View style={styles.themeRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="translate" size={24} color={colors.text} style={{ marginRight: 15 }} />
                        <Text style={{ fontSize: 16, color: colors.text }}>
                            {i18n.language === 'vi' ? 'Ngôn ngữ' : 'Language'}
                        </Text>
                    </View>
                    <View style={styles.langSwitchContainer}>
                        <TouchableOpacity
                            onPress={() => changeLanguage('vi')}
                            style={[
                                styles.langBtn,
                                i18n.language === 'vi' && { backgroundColor: colors.primary }
                            ]}
                        >
                            <Text style={[styles.langText, i18n.language === 'vi' && { color: colors.buttonText }]}>VI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => changeLanguage('en')}
                            style={[
                                styles.langBtn,
                                i18n.language === 'en' && { backgroundColor: colors.primary }
                            ]}
                        >
                            <Text style={[styles.langText, i18n.language === 'en' && { color: colors.buttonText }]}>EN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


            <AppButton
                title={t('profile.logout')}
                onPress={onLogout}
                backgroundColor={colors.primary}
                textStyle={{ fontWeight: 'bold', color: colors.buttonText }}
            />

            <Modal
                transparent={true}
                visible={isQrModalVisible}
                onRequestClose={() => setQrModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setQrModalVisible(false)}
                >
                    <Pressable
                        style={styles.modalContent}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <Text style={styles.modalTitle}>{t('qr.modal_title')}</Text>

                        <View style={styles.qrContainer}>
                            {qrData ? (
                                <QRCode
                                    value={qrData}
                                    size={180}
                                    color={colors.text}
                                    backgroundColor={colors.card}
                                />
                            ) : (
                                <Text>{t('qr.no_data')}</Text>
                            )}
                        </View>

                        <Text style={styles.modalNote}>{t('qr.scan_hint')}</Text>

                        <AppButton
                            title={t('common.close')}
                            onPress={() => setQrModalVisible(false)}
                            backgroundColor={APP_COLOR.BLUE_LIGHT}
                            textStyle={{ fontWeight: 'bold', color: 'white' }}
                            width='50%'
                            marginTop={10}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    userNameSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative', // Để định vị icon QR
        minHeight: 50, // Đảm bảo đủ chiều cao cho icon
    },
    qrIconBtn: {
        position: 'absolute',
        right: 0, // Sát lề phải
        top: 0,   // Sát lề trên (hoặc chỉnh top: 10 nếu muốn thấp xuống)
        padding: 8, // Tăng vùng bấm
        zIndex: 1,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
        textAlign: 'center'
    },
    userEmail: {
        fontSize: 14,
        color: colors.subText,
        textAlign: 'center'
    },
    menuSection: {
        marginBottom: 24,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card
    },
    themeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.card
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.text,
        textAlign: 'center',
    },
    qrContainer: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 15,
        elevation: 2,
    },
    modalNote: {
        fontSize: 12,
        color: colors.subText,
        marginBottom: 20,
        textAlign: 'center',
    },
    langSwitchContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        overflow: 'hidden',
    },
    langBtn: {
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    langText: {
        fontWeight: 'bold',
        color: colors.subText,
        fontSize: 12,
    },
});

export default ProfileMenu;