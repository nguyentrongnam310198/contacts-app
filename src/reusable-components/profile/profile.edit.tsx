import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Formik } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppInput from '../input/app.input';
import AppButton from '../button/app.button';
import { ThemeColors } from '../theme/themeContext';
import { EditProfileSchema } from '../../utils/validate/validate.chema';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface EditProfileFormProps {
    user: any;
    onSave: (values: any) => void;
    onCancel: () => void;
    colors: ThemeColors;
}

const EditProfileForm = ({ user, onSave, onCancel, colors }: EditProfileFormProps) => {
    const styles = createStyles(colors);
    const nameRef = useRef<TextInput>(null);
    const dobRef = useRef<TextInput>(null);
    const { t } = useTranslation();

    const [isDatePickerVisible, setDatePickerVisible] = useState(false); // State ẩn/hiện popup ngày

    // Hàm chuyển đổi chuỗi ngày sinh (dd/mm/yyyy) sang đối tượng Date để DatePicker hiển thị đúng
    const parseDateString = (dateString: string) => {
        if (!dateString) return new Date();
        const parts = dateString.split('/');
        // Lưu ý: Tháng trong JS Date bắt đầu từ 0
        if (parts.length === 3) {
            return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        }
        return new Date();
    };

    return (
        <Formik
            initialValues={{
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                dob: user?.dob || '',
            }}
            validationSchema={EditProfileSchema}
            onSubmit={(values) => {
                onSave(values);
            }}
        >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue, // Lấy hàm này để update giá trị ngày sinh thủ công
                values,
                errors,
                touched
            }) => (
                <View>
                    <Text style={styles.sectionTitle}>{t('profile.edit_title')}</Text>

                    {/* Input Họ */}
                    <AppInput
                        title={t('profile.first_name')}
                        value={values.firstName}
                        onChangeText={handleChange('firstName')}
                        onBlur={handleBlur('firstName')}
                        error={errors.firstName}
                        touched={touched.firstName}
                        style={styles.input}
                        returnKeyType="next"
                        onSubmitEditing={() => nameRef.current?.focus()}
                        blurOnSubmit={false}
                        textColor={colors.text}
                    />

                    {/* Input Tên */}
                    <AppInput
                        ref={nameRef}
                        title={t('profile.last_name')}
                        value={values.lastName}
                        onChangeText={handleChange('lastName')}
                        onBlur={handleBlur('lastName')}
                        error={errors.lastName}
                        touched={touched.lastName}
                        style={styles.input}
                        textColor={colors.text}
                        returnKeyType="next"
                        onSubmitEditing={() => dobRef.current?.focus()}
                        blurOnSubmit={false}
                    />

                    {/* Input Ngày sinh - Bọc trong Pressable */}
                    <Pressable onPress={() => setDatePickerVisible(true)}>
                        <View pointerEvents="none">
                            <AppInput
                                ref={dobRef}
                                title={t('profile.dob')}
                                value={values.dob}
                                editable={false} // Không cho nhập tay
                                style={styles.input} // Dùng style input thường thay vì disabled để nhìn rõ hơn
                                textColor={colors.text}
                                error={errors.dob as string}
                                touched={touched.dob as boolean}
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit as any}
                            />
                        </View>

                        <View style={styles.calendarIcon}>
                            <MaterialIcons
                                name="calendar-month"
                                size={24}
                                color={colors.subText}
                            />
                        </View>
                    </Pressable>

                    {/* Component chọn ngày */}
                    {isDatePickerVisible && (
                        <DateTimePicker
                            value={parseDateString(values.dob)}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setDatePickerVisible(false); // Ẩn picker sau khi chọn
                                if (selectedDate) {
                                    // Chuyển Date object thành chuỗi dd/mm/yyyy
                                    const formattedDate = selectedDate.toLocaleDateString('vi-VN');
                                    setFieldValue('dob', formattedDate);
                                }
                            }}
                            maximumDate={new Date()} // Không cho chọn ngày tương lai
                        />
                    )}

                    <AppInput
                        title={t('profile.email')}
                        value={values.email}
                        editable={false}
                        style={styles.inputDisabled}
                        textColor={colors.text}
                    />

                    <View style={styles.buttonGroup}>
                        <AppButton
                            title={t('common.save')}
                            onPress={() => handleSubmit()}
                            backgroundColor={colors.primary}
                            textStyle={styles.buttonText}
                        />
                        <AppButton
                            title={t('common.cancel')}
                            onPress={onCancel}
                            backgroundColor={colors.card}
                            borderWidth={1}
                            borderColor={colors.border}
                            textStyle={[styles.buttonText, styles.cancelButtonText]}
                        />
                    </View>
                </View>
            )}
        </Formik>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: colors.text,
        alignSelf: 'center'
    },
    input: {
        backgroundColor: colors.card,
        color: colors.text,
        borderColor: colors.border
    },
    inputDisabled: {
        backgroundColor: colors.card,
        color: colors.subText,
        borderColor: colors.border,
        opacity: 0.7
    },
    calendarIcon: {
        position: 'absolute',
        right: 15,
        top: 43
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
        alignSelf: 'center'
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 12
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.buttonText
    },
    cancelButtonText: {
        color: colors.text
    },
});

export default EditProfileForm;