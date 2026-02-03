import { APP_COLOR } from '../../utils/constants/constants';
import { useTheme } from '../theme/themeContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { forwardRef, useState } from "react";
import { KeyboardTypeOptions, Platform, ReturnKeyTypeOptions, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import AntDesign from 'react-native-vector-icons/AntDesign';

interface IProps {
    title?: string;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
    value: any;
    setValue?: (v: any) => void;
    onChangeText?: any;
    onBlur?: any;
    error?: any;
    touched?: any;
    editable?: any;
    placeholder?: string;
    multiline?: boolean;
    numberOfLines?: number;
    style?: StyleProp<ViewStyle>;
    returnKeyType?: ReturnKeyTypeOptions; // 'next', 'done', 'go', ...
    onSubmitEditing?: () => void;         // Hàm chạy khi bấm nút enter trên phím
    blurOnSubmit?: boolean;               // Có ẩn bàn phím khi submit không?
    textColor?: string;
}

const AppInput = forwardRef<TextInput, IProps>((props, ref) => {  //forwardRef: chuyển tiếp ref từ component cha đến component con
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const { colors } = useTheme();
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const { title, keyboardType, secureTextEntry = false,
        value, setValue, onChangeText, onBlur,
        error, touched, editable = true, placeholder = "",
        multiline = false, numberOfLines, returnKeyType,
        onSubmitEditing, blurOnSubmit, textColor = APP_COLOR.BLACK,
    } = props;

    return (
        <View style={styles.inputGroup}>
            {title && (
                <Text style={[
                    styles.label,
                    { color: textColor || colors.text }
                ]}>
                    {title}
                </Text>
            )}
            <View style={styles.inputContainer}>
                <TextInput  //TextInput component
                    ref={ref}
                    editable={editable}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => {
                        if (onBlur)
                            onBlur(e);
                        setIsFocused(false);
                    }}
                    keyboardType={keyboardType}
                    placeholder={placeholder}
                    placeholderTextColor={colors.placeholder}
                    style={[
                        styles.input,
                        { borderColor: isFocused ? colors.primary : colors.border, backgroundColor: colors.inputBackground, color: textColor || colors.text },
                        isFocused && styles.inputFocused,
                        multiline && { height: 100, textAlignVertical: 'top' }
                    ]}
                    secureTextEntry={secureTextEntry && !isShowPassword}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    blurOnSubmit={blurOnSubmit}
                />
                {secureTextEntry &&  //nếu secureTextEntry=true thì hiển thị icon mắt
                    <FontAwesome
                        style={styles.eye}
                        name={isShowPassword ? "eye" : "eye-slash"}
                        size={18}
                        color={colors.subText}
                        onPress={() => setIsShowPassword(!isShowPassword)}
                    />
                }
            </View>
            {error && touched && <Text style={styles.errorText}>{error}</Text>}
        </View>
    )
});

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    inputContainer: {
        position: "relative",
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 15,
        fontSize: 16,
    },
    inputFocused: {
    },
    eye: {
        position: 'absolute',
        right: 15,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    }
})

export default AppInput;