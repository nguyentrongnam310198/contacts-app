import React from 'react';
import { StyleSheet, View, Text, Pressable, StyleProp, ViewStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { APP_COLOR } from '../../utils/constants/constants';
import { useTheme } from '../theme/themeContext';

interface InforCardProps {
    icon: string;
    label: string;
    status?: string;
    onPress?: () => void;
    showChevron?: boolean;
    style?: StyleProp<ViewStyle>;
    textColor?: string;
}

const InforCard = ({
    icon, label, status, onPress,
    showChevron = true, textColor,
}: InforCardProps) => {
    const { colors } = useTheme();
    const resolvedTextColor = textColor || colors.text;
    return (
        <Pressable style={[styles.container, { borderBottomColor: colors.border, backgroundColor: colors.card }]} onPress={onPress} disabled={!onPress}>
            <View style={styles.leftContent}>
                <MaterialIcons name={icon} size={24} color={resolvedTextColor} />
                <Text style={[styles.label, { color: resolvedTextColor }]}>{label}</Text>
            </View>
            <View style={styles.rightContent}>
                {status && <Text style={[styles.status, { color: colors.subText }]}>{status}</Text>}
                {showChevron && (
                    <MaterialIcons name="chevron-right" size={20} color={resolvedTextColor} />
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    status: {
        fontSize: 12,
        color: APP_COLOR.GREY,
    },
});

export default InforCard;