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
import { Alert, Dimensions} from "react-native";
import { useAppContext } from '../../context-api/app.context';


//-----------------------------------------------------------------------------------

const AddContactScreen = () => {

    const { width } = Dimensions.get('window'); 
    

    const navigation = useNavigation<NavigationProp<any>>();
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
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
        address: ''
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
    });



//----------------------------------------------------------------------------------------------------------

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
                    onSubmit={async (values) => {
                        const contact = {
                            id: Date.now(),
                            name: values.name || '',
                            phonenumber: values.phonenumber || '',
                            email: values.email || '',
                            address: (values as any).adddress || (values as any).address || '',
                            avatar: avatarUri || null,
                        };
                        try {
                            Alert.alert('Thông báo!!', 'Thông tin của bạn đã được lưu.');
                            navigation.navigate('home', { newUser: contact });
                        } catch (e) {
                            console.error('Save contact error', e);
                            Alert.alert('Lỗi', 'Không thể lưu dữ liệu');
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View style={styles.container}>
                            <View style={styles.backBtn}>
                                <Ionicons
                                    name="arrow-back"
                                    size={40}
                                    color="#7a8a9f"
                                    onPress={() => navigation.navigate('home')}
                                />
                            </View>

                            <View style={styles.header}> 
          
                                    {avatarUri ? (
                                        <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                                    ) : (
                                        <Ionicons name="person-circle" size={200} color="#7a8a9f" />
                                    )}

                                    <TouchableOpacity style={styles.addPhotoBtn} onPress={() => setShowImageModal(true)}>
                                        <View style={styles.addPhotoInner}>
                                            <Icon name="camera-outline" size={18} color="#fff" />
                                            <Text style={styles.addPhotoText}>CHỌN ẢNH</Text>
                                        </View>
                                    </TouchableOpacity>
                            </View>

                            <View style={styles.forminput}> 

                                    <Text style={styles.textstyle}>Họ và tên:</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập tên"
                                        value={values.name}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                    />
                                {touched.name && errors.name && (
                                    <Text style={{ color: 'red', marginLeft: 10 }}>{errors.name}</Text>
                                )}


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


                                    <Text style={styles.textstyle}>Địa chỉ:</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập địa chỉ"
                                        value={values.address}  
                                        onChangeText={handleChange('address')}  
                                        onBlur={handleBlur('address')}  
                                    />
                                {touched.address && errors.address && (
                                    <Text style={{ color: 'red', marginLeft: 10 }}>{errors.address}</Text>
                                )}


                                <TouchableOpacity style={styles.signUpBtn} onPress={handleSubmit}>
                                    <Text style={styles.signUpText}>Lưu thông tin</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
                <Modal visible={showImageModal} transparent animationType="slide" onRequestClose={() => setShowImageModal(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.modalOption} onPress={() => handlePickImage('library')}>
                                <Text style={styles.modalText}>Chọn ảnh từ thiết bị</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalOption} onPress={() => handlePickImage('camera')}>
                                <Text style={styles.modalText}>Chụp ảnh</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowImageModal(false)}>
                                <Text style={styles.modalCancelText}>Hủy</Text>
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
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#1c1e21',
        height: 44,
        
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
        backgroundColor: '#7a8a9f',
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

    addPhotoText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },

    modalContent: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },

    modalOption: {
        paddingVertical: 14,
    },

    modalText: {
        fontSize: 16,
        color: '#111',
    },

    modalCancel: {
        paddingVertical: 14,
        marginTop: 8,
    },

    modalCancelText: {
        textAlign: 'center',
        color: '#888',
    },

    backBtn: {
        position: 'absolute',
        left: 12,
        top: 40,
        zIndex: 10,
        padding: 6,
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
        textAlign: 'left', //Căn trái
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
        borderRadius: 20,
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

export default AddContactScreen;