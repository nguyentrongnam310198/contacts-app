import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { APP_COLOR } from '../../utils/constants/constants';

interface UserAvatarProps {
    avatar: string;
    size?: 'small' | 'medium' | 'large';
    showCamera?: boolean;
    onCameraPress?: () => void;
}

const UserAvatar = ({
    avatar,
    size = 'large',
    showCamera = true,
    onCameraPress,
}: UserAvatarProps) => {
    const sizeConfig = {
        small: { fontSize: 32, width: 50, height: 50 },
        medium: { fontSize: 56, width: 80, height: 80 },
        large: { fontSize: 80, width: 120, height: 120 },
    };

    const config = sizeConfig[size];

    return (
        <View style={styles.container}>
            <View style={[styles.avatarContainer, { width: config.width, height: config.height }]}>
                <Text style={[styles.avatarText, { fontSize: config.fontSize }]}>
                    {avatar || '👨'}
                </Text>
                {showCamera && onCameraPress && (
                    <Pressable style={styles.cameraButton} onPress={onCameraPress}>
                        <MaterialIcons name="camera" size={16} color={APP_COLOR.WHITE} />
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarContainer: {
        position: 'relative',
        borderRadius: 999,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        textAlign: 'center',
        lineHeight: 120,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: APP_COLOR.BLUE_LIGHT,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: APP_COLOR.WHITE,
    },
});

export default UserAvatar;