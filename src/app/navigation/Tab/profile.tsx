import { useState } from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';  //https://ionic.io/ionicons
import { StyleSheet, Keyboard } from "react-native";
import { Picker } from '@react-native-picker/picker';
import HomeScreen from "../navigation/BottomTab/home";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { Alert } from "react-native";


//-----------------------------------------------------------------------------------


const ProfileScreen = () => {

    //==Khai báo giá trị ban đầu cho form==
    const initialValues = {
        name: '',
        phonenumber: '',
        email: '',
        adddress: '',
        gender: 'Nam',
        dob_day: '',
        dob_month: '',
        dob_year: '',
    };

    //==Định nghĩa quy tắc kiểm tra dữ liệu (validate) cho từng trường==
    //-->Sử dụng Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Vui lòng nhập họ tên'),
        phonenumber: Yup.string()
            .matches(/^\d{10,11}$/, 'Số điện thoại không hợp lệ')
            .required('Vui lòng nhập số điện thoại'),
        //phonenumber: là tên trường trong form, để lưu số điện thoại
        //Yup.string(): khai báo kiểu dữ liệu của trường này
        //required(): bắt buộc phải nhập, nếu để trống sẽ thông báo (' ')
        //.matches(): hàm kiểm tra, trong case này là biểu thức chính quy
        

        email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
        adddress: Yup.string().required('Vui lòng nhập địa chỉ'),
        gender: Yup.string().required('Chọn giới tính'),
        dob_day: Yup.string().matches(/^\d{2}$/, 'Ngày không hợp lệ').required('Nhập ngày'),
        dob_month: Yup.string().matches(/^\d{2}$/, 'Tháng không hợp lệ').required('Nhập tháng'),
        dob_year: Yup.string().matches(/^\d{4}$/, 'Năm không hợp lệ').required('Nhập năm'),
    });

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: '#f5f6fa' }}
                contentContainerStyle={{ flexGrow: 1 }}
                enableOnAndroid={true}
                extraScrollHeight={100}
            >
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={values => {
                        // Xử lý submit ở đây
                        Alert.alert('Thông báo!!', 'Thông tin của bạn đã được lưu.');
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View style={styles.container}>
                            <View style={styles.header}> {/* Header */}
                                <Ionicons name="person" size={120} color="#b99c9cff" />
                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 5, color: '#1c1e21' }}>
                                    Xin chào {values.name}
                                </Text>
                            </View>

                            <View style={styles.forminput}> {/* Form input */}

                                {/* Ô nhập họ và tên */}
                                    <Text style={styles.textstyle}>Họ và tên:</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập tên của bạn"
                                        value={values.name}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                    />
                                {touched.name && errors.name && (
                                    <Text style={{ color: 'red', marginLeft: 10 }}>{errors.name}</Text>
                                )}


                                {/* Ô nhập số điện thoại */}
                                    <Text style={styles.textstyle}>Số điện thoại:</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="phone-pad"
                                        placeholder="Nhập số điện thoại"
                                        value={values.phonenumber}
                                        onChangeText={handleChange('phonenumber')}
                                        onBlur={handleBlur('phonenumber')}
                                    />
                                {touched.phonenumber && errors.phonenumber && (
                                    <Text style={{ color: 'red', marginLeft: 10 }}>{errors.phonenumber}</Text>
                                )}
                                

                                {/* Ô nhập giới tính */}
                                <View style={styles.genderstyle}>
                                    <View
                                    style={{
                                        paddingBottom: 1
                                    }}
                                    >
                                    <Text style={{
                                        marginRight: 12,
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        textAlign: 'left',
                                        color: '#1c1e21',
                                        // marginBottom: 4,
                                        // marginTop: 20,
                                    }}>Giới tính:</Text>
                                    </View>
                                    <View style={styles.genderWrapper}>
                                        <Picker
                                            selectedValue={values.gender}
                                            onValueChange={itemValue => setFieldValue('gender', itemValue)}
                                            style={styles.picker2}
                                        >
                                            <Picker.Item label="Nam" value="Nam"/>
                                            <Picker.Item label="Nữ" value="Nữ"/>
                                            <Picker.Item label="Thứ 3" value="ba"/>
                                            <Picker.Item label="Thứ 4" value="bốn"/>
                                            <Picker.Item label="Thứ 5" value="năm"/>
                                        </Picker>
                                    </View>
                                </View>
                                {touched.gender && errors.gender && (
                                    <Text style={{ color: 'red', marginLeft: 10 }}>{errors.gender}</Text>
                                )}


                                {/* Ô nhập ngày tháng năm sinh */}
                                    <Text style={styles.textstyle}>Ngày tháng năm sinh:</Text>
                                    <View style={styles.dobbox}>
                                        <TextInput
                                            style={{}}
                                            placeholder="DD"
                                            keyboardType="numeric"
                                            maxLength={2}
                                            value={values.dob_day}
                                            onChangeText={handleChange('dob_day')}
                                            onBlur={handleBlur('dob_day')}
                                        />
                                        <Text>/</Text>
                                        <TextInput
                                            style={{ paddingHorizontal: 8 }}
                                            placeholder="MM"
                                            keyboardType="numeric"
                                            maxLength={2}
                                            value={values.dob_month}
                                            onChangeText={handleChange('dob_month')}
                                            onBlur={handleBlur('dob_month')}
                                        />
                                        <Text>/</Text>
                                        <TextInput
                                            style={{}}
                                            placeholder="YYYY"
                                            keyboardType="numeric"
                                            maxLength={4}
                                            value={values.dob_year}
                                            onChangeText={handleChange('dob_year')}
                                            onBlur={handleBlur('dob_year')}
                                        />
                                    </View>
                                <View style={{
                                    flexDirection: 'row', 
                                    justifyContent: 'space-between',
                                    paddingLeft: 5,
                                    paddingRight: 10
                                }}>
                                
                                {(touched.dob_day && errors.dob_day) && (
                                    <Text style={{ color: 'red', marginLeft: 10 }}>{errors.dob_day}</Text>
                                )}
                                {(touched.dob_month && errors.dob_month) && (
                                    <Text style={{ color: 'red', marginLeft: 10 }}>{errors.dob_month}</Text>
                                )}
                                {(touched.dob_year && errors.dob_year) && (
                                    <Text style={{ color: 'red', marginLeft: 10 }}>{errors.dob_year}</Text>
                                )}
                                </View>

                                {/* Ô nhập email */}
                                    <Text style={styles.textstyle}>Email:</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="email-address"
                                        placeholder="Nhập địa chỉ Email"
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                    />
                                {touched.email && errors.email && (
                                    <Text style={{ color: 'red', marginLeft: 10 }}>{errors.email}</Text>
                                )}


                                {/* Ô nhập địa chỉ */}
                                    <Text style={styles.textstyle}>Địa chỉ:</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập địa chỉ"
                                        value={values.adddress}
                                        onChangeText={handleChange('adddress')}
                                        onBlur={handleBlur('adddress')}
                                    />
                                {touched.adddress && errors.adddress && (
                                    <Text style={{ color: 'red', marginLeft: 10 }}>{errors.adddress}</Text>
                                )}


                                {/* Nút lưu */}
                                <TouchableOpacity style={styles.signUpBtn} onPress={handleSubmit}>
                                    <Text style={styles.signUpText}>Lưu thông tin</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );


    
}

//-----------------------------------------------------------------------------------

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 0,
    },

    header: {
        flex: 1,
        alignItems: 'center',  //căn trục chéo
        justifyContent: 'center',  //căn các phần con theo trục chính
        marginTop: 50,
        marginBottom: 50,
    },

    forminput:{
        flex: 3,
        width: '100%',
        paddingHorizontal: 20,

    },


    dobbox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccd0d5',
        borderRadius: 13,
        paddingHorizontal: 8, 
        height: 44,  
        backgroundColor: '#f5f6fa'
    },

    input: {
        backgroundColor: '#f5f6fa',
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#ccd0d5',
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#1c1e21',
        height: 44,
        
    },

    card: {
        width: '95%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        alignItems: 'stretch',
        marginVertical: 24,
    },
    textstyle: {
        marginRight: 12,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#1c1e21',
        marginBottom: 4,
        marginTop: 20,
        
    },
    subtitle: {
        fontSize: 15,
        color: '#606770',
        textAlign: 'center',
        marginBottom: 16,
    },
    genderstyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        borderWidth: 0,
        borderRadius: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
        marginTop: 28,
        height: 48,
    },

    label: {
        fontSize: 16,
        color: '#606770',
        flex: 1,
        height: 44,
        textAlignVertical: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },


    genderWrapper: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccd0d5',
        borderRadius: 13,
        justifyContent: 'space-between',
        width: 120,
        paddingHorizontal: 6,
        backgroundColor: '#f5f6fa',
        },

    picker2: {
       flex: 1,
    },

    picker: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#ccd0d5',
        paddingVertical: 1,
        alignItems: 'center',
        marginHorizontal: 1,
    },
    dropdown: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ccd0d5',
        paddingVertical: 10,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    dropdownText: {
        fontSize: 16,
        color: '#1c1e21',
    },
    radioBtn: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ccd0d5',
        paddingVertical: 10,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    radioText: {
        fontSize: 16,
        color: '#1c1e21',
    },
    signUpBtn: {
        backgroundColor: '#42b72a',
        borderRadius: 6,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 8,
    },
    signUpText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    loginLink: {
        color: '#1877f2',
        textAlign: 'center',
        marginTop: 8,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
})

export default ProfileScreen;