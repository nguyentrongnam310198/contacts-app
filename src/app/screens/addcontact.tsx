import { useState } from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { View, Text, TextInput, TouchableOpacity, Image, Modal } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';  //https://ionic.io/ionicons
import { StyleSheet, Keyboard } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from "react-native-vector-icons/Ionicons";
import { Alert } from "react-native";
import { useAppContext } from '../../context-api/app.context';
import { useTheme } from '../../reusable-components/theme/themeContext';


//-----------------------------------------------------------------------------------

const AddContactScreen = () => {

    const { addContact } = useAppContext();

    const navigation = useNavigation<NavigationProp<any>>();
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const { colors } = useTheme();
    const [showImageModal, setShowImageModal] = useState(false);

    const handlePickImage = async (type: 'camera' | 'library') => {
        const options: any = { mediaType: 'photo', quality: 0.8 };
        try {
            if (type === 'library') {
                const res: any = await launchImageLibrary(options);
                const asset = res?.assets?.[0];
                if (asset?.uri) setAvatarUri(asset.uri);
            } else {
                const res: any = await launchCamera(options);
                const asset = res?.assets?.[0];
                if (asset?.uri) setAvatarUri(asset.uri);
            }
        } catch (e) {
            console.error('Image pick error', e);
            Alert.alert('Lỗi', 'Không thể lấy ảnh');
        } finally {
            setShowImageModal(false);
        }
    };

    //==Khai báo giá trị ban đầu cho form==
    const initialValues = {
        name: '',
        phonenumber: '',
        email: '',
        address: '',
        workplace: ''
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
        address: Yup.string().required('Vui lòng nhập địa chỉ'),
        workplace: Yup.string().required('Vui lòng nhập nơi làm việc'),
    });



//----------------------------------------------------------------------------------------------------------

    const themedStyles = StyleSheet.create({
        keyboard: {
            flex: 1,
            backgroundColor: colors.background,
        },
    });

    return (
        
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAwareScrollView
                style={themedStyles.keyboard}
                contentContainerStyle={styles.scrollContent}
                enableOnAndroid={true}
                extraScrollHeight={100}
            >
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        const contact = {
                            id: Date.now(),
                            name: values.name || '',
                            phonenumber: values.phonenumber || '',
                            email: values.email || '',
                            address: (values as any).adddress || (values as any).address || '',
                            workplace: (values as any).workplace || '',
                            avatar: avatarUri || null,
                        };
                        try {
                            // Lưu contact vào context
                            addContact(contact);
                            Alert.alert('Thông báo!!', 'Thông tin của bạn đã được lưu.');
                            navigation.navigate('home');
                        } catch (e) {
                            console.error('Save contact error', e);
                            Alert.alert('Lỗi', 'Không thể lưu dữ liệu');
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View style={[styles.container, { backgroundColor: colors.background }]}>
                            <View   style={[styles.header, { backgroundColor: colors.background }] }>
                                <View style={styles.backBtn}>
                                    <Ionicons
                                        name="arrow-back"
                                        size={35}
                                        color={colors.subText}
                                        onPress={() => navigation.navigate('home')}
                                    />
                                </View>
                            

                                <View style={[styles.header, { backgroundColor: colors.background }]}> 
            
                                        {avatarUri ? (
                                            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                                        ) : (
                                            <Ionicons name="person-circle" size={200} color={colors.subText} />
                                        )}

                                        <TouchableOpacity style={[styles.addPhotoBtn, { backgroundColor: colors.primary }]} onPress={() => setShowImageModal(true)}>
                                            <View style={styles.addPhotoInner}>
                                                <Icon name="camera-outline" size={18} color={colors.buttonText} />
                                                <Text style={[styles.addPhotoText, { color: colors.buttonText }]}>CHỌN ẢNH</Text>
                                            </View>
                                        </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.forminput}> 

                                    <Text style={[styles.textstyle, { color: colors.text }]}>Họ và tên:</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                                        placeholder="Nhập tên"
                                        placeholderTextColor={colors.placeholder}
                                        value={values.name}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                    />
                                {touched.name && errors.name && (
                                    <Text style={styles.errorText}>{errors.name}</Text>
                                )}


                                    <Text style={[styles.textstyle, { color: colors.text }]}>Số điện thoại:</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                                        keyboardType="phone-pad"
                                        placeholder="Nhập số điện thoại"
                                        placeholderTextColor={colors.placeholder}
                                        value={values.phonenumber}
                                        onChangeText={handleChange('phonenumber')}
                                        onBlur={handleBlur('phonenumber')} 
                                    />
                                {touched.phonenumber && errors.phonenumber && (
                                    <Text style={styles.errorText}>{errors.phonenumber}</Text>
                                )}
                                

                                    <Text style={[styles.textstyle, { color: colors.text }]}>Email:</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                                        keyboardType="email-address"
                                        placeholder="Nhập địa chỉ Email"
                                        placeholderTextColor={colors.placeholder}
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                    />
                                {touched.email && errors.email && (
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                )}


                                    <Text style={[styles.textstyle, { color: colors.text }]}>Địa chỉ:</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                                        placeholder="Nhập địa chỉ"
                                        placeholderTextColor={colors.placeholder}
                                        value={values.address}  
                                        onChangeText={handleChange('address')}  
                                        onBlur={handleBlur('address')}  
                                    />
                                {touched.address && errors.address && (
                                    <Text style={styles.errorText}>{errors.address}</Text>
                                )}

                                    <Text style={[styles.textstyle, { color: colors.text }]}>Nơi làm việc:</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                                        placeholder="Nhập nơi làm việc"
                                        placeholderTextColor={colors.placeholder}
                                        value={(values as any).workplace}
                                        onChangeText={handleChange('workplace')}
                                        onBlur={handleBlur('workplace')}
                                    />
                                {(touched as any).workplace && (errors as any).workplace && (
                                    <Text style={styles.errorText}>{(errors as any).workplace}</Text>
                                )}

                                <TouchableOpacity style={[styles.signUpBtn, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
                                    <Text style={[styles.signUpText, { color: colors.buttonText }]}>Lưu thông tin</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
                <Modal visible={showImageModal} transparent animationType="slide" onRequestClose={() => setShowImageModal(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                            <TouchableOpacity style={styles.modalOption} onPress={() => handlePickImage('library')}>
                                <Text style={[styles.modalText, { color: colors.text }]}>Chọn ảnh từ thiết bị</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalOption} onPress={() => handlePickImage('camera')}>
                                <Text style={[styles.modalText, { color: colors.text }]}>Chụp ảnh</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowImageModal(false)}>
                                <Text style={[styles.modalCancelText, { color: colors.subText }]}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );


    
}

//-----------------------------------------------------------------------------------

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 0,
        width: '100%',
    },

    header: {
        flex: 1,
        alignItems: 'center',  //căn trục chéo
        justifyContent: 'center',  //căn các phần con theo trục chính
        marginTop: 20,
        marginBottom: 5,
        paddingHorizontal: 50,
    },

    forminput:{
        flex: 3,
        width: '100%',
        paddingHorizontal: 40,
    },


    dobbox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 13,
        paddingHorizontal: 8, 
        height: 44
    },

    input: {
        width: '100%',
        borderRadius: 13,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 16,
        height: 44,
        textAlign: 'left',
        marginBottom: 5,
    },

    avatarImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginBottom: 12,
    },

    addPhotoBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },

    addPhotoInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },

    errorText: {
        color: 'red',
        marginLeft: 10,
    },

    addPhotoText: {
        fontWeight: '600',
        marginLeft: 6,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },

    modalContent: {
        padding: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },

    modalOption: {
        paddingVertical: 14,
    },

    modalText: {
        fontSize: 16,
    },

    modalCancel: {
        paddingVertical: 14,
        marginTop: 8,
    },

    modalCancelText: {
        textAlign: 'center'
    },

    backBtn: {
        position: 'absolute',
        left: 12,
        top: 40,
        zIndex: 10,
        padding: 6,
        paddingTop: 0
    },

    card: {
        width: '95%', 
        maxWidth: 400,
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
        textAlign: 'left', //Căn trái
        marginBottom: 4,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 15,
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
        
        borderRadius: 13,
        justifyContent: 'space-between',
        width: 120,
        paddingHorizontal: 6,
        
        },

    picker2: {
       flex: 1,
    },

    picker: {
        flex: 1,
        borderRadius: 13,
        borderWidth: 1,
        paddingVertical: 1,
        alignItems: 'center',
        marginHorizontal: 1,
    },
    dropdown: {
        flex: 1,
        borderRadius: 6,
        borderWidth: 1,
        paddingVertical: 10,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    dropdownText: {
        fontSize: 16
    },
    radioBtn: {
        flex: 1,
        borderRadius: 6,
        borderWidth: 1,
        paddingVertical: 10,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    radioText: {
        fontSize: 16
    },
    signUpBtn: {
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 8,
    },
    signUpText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    loginLink: {
        textAlign: 'center',
        marginTop: 8,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 32,
    },
})

export default AddContactScreen;