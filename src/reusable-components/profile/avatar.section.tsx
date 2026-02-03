import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UserAvatar from '../avatar/user.avatar';
import { APP_COLOR } from '../../utils/constants/constants';
import { ThemeColors } from '../../reusable-components/theme/themeContext';

interface AvatarSectionProps {
    avatar?: string;
    isEditMode: boolean;
    onPressCamera: () => void;
    colors: ThemeColors;
}

const AvatarSection = ({ avatar, isEditMode, onPressCamera, colors }: AvatarSectionProps) => {
    const styles = createStyles(colors);
    const isBase64Avatar = avatar?.startsWith('data:image');

    return (
        <View style={styles.avatarSection}>
            {isBase64Avatar ? (
                <Pressable style={styles.imageAvatarContainer} onPress={isEditMode ? onPressCamera : undefined}>
                    <Image source={{ uri: avatar }} style={styles.imageAvatar} />
                    {isEditMode && (
                        <Pressable style={styles.cameraButton} onPress={onPressCamera}>
                            <MaterialIcons name="camera" size={16} color={colors.buttonText} />
                        </Pressable>
                    )}
                </Pressable>
            ) : (
                <UserAvatar
                    avatar={avatar || '👨'}
                    size="large"
                    showCamera={isEditMode}
                    onCameraPress={onPressCamera}
                />
            )}
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 24
    },
    imageAvatarContainer: {
        position: 'relative'
    },
    imageAvatar: {
        width: 120,
        height: 120,
        borderRadius: 60
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.card,
    },
});

export default AvatarSection;