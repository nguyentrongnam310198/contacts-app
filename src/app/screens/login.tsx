import { View, Text, StyleSheet, Button, Alert, Keyboard } from 'react-native'
import Toast from 'react-native-toast-message';

import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TextInput } from 'react-native';
import { useState } from 'react';
import HomeScreen from '../navigation/Tab/home';
import RootStackParamList from '../../types/route';
// Đã loại bỏ AuthContext
import { TouchableWithoutFeedback } from 'react-native';




//-----------------------------------------------------------------------------------

type LoginScreenNavigationProp = NavigationProp<RootStackParamList>;
// Thêm định nghĩa kiểu cho component này (ngay trước const LoginScreen)

const LoginScreen = () => {

// Đã loại bỏ AuthContext

//useContext(AuthContext): tìm provider gần nhất (bọc trong App.tsx) --> lấy value --> gán vào auth
//AuthContext: kho dữ liệu chung (File AuthContext - không chứa dữ liệu -> chỉ là đường ống)

const navigation = useNavigation<LoginScreenNavigationProp>();
// Gán kiểu cụ thể cho navigation

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    
    const handlelogin = () => {
        if(!username || !password){
            Alert.alert('Tên đăng nhập hoặc mật khẩu không được để trống!')
            return;
        }
        
        if(username == 'nam' && password == '123'){
            Toast.show({
                type: 'success',
                text1: 'Đăng nhập thành công!',
                visibilityTime: 2000, // milliseconds
            });
            
            setTimeout(() => {
            navigation.navigate('Tab')
            }, 1000)
        }
    }
//--------------------------------------------------------------------------------------------------------------------------------------

        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <View style={styles.formBox}>
                        <Text style={styles.title}>Đăng nhập</Text>
                        <Text style={styles.subtitle}>Chào mừng đến với Nam's Project</Text>

                        <Text style={styles.label}>Tên đăng nhập</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập tên đăng nhập"
                            value={username}
                            onChangeText={setUserName}
                            keyboardType="email-address"
                            placeholderTextColor="#B0B3B8"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Mật khẩu</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TextInput
                                style={[styles.input, {flex: 1}]}
                                placeholder="Nhập mật khẩu"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                placeholderTextColor="#B0B3B8"
                            />
                            <Text style={styles.forgot} onPress={() => {}}>  {/* đang chờ */}
                                Quên mật khẩu?
                            </Text>
                        </View>

                        <View style={styles.rowBetween}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={styles.checkbox}/>
                                <Text style={styles.keepSigned}> Ghi nhớ đăng nhập </Text>
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Đăng nhập"
                                color="#1877F2"
                                onPress={handlelogin}
                            />
                        </View>

                        <Text style={styles.orText}>────────  Đăng nhập cách khác  ────────</Text>

                        <View style={styles.googleBtn}>
                            <Text style={styles.googleText}>Đăng nhập bằng tài khoản Google</Text>
                        </View>

                        <View style={styles.loginLinkContainer}>
                            <Text style={styles.loginText}>Bạn chưa có tài khoản?</Text>
                            <Text
                                style={styles.loginLink}
                                onPress={() => navigation.navigate('create_account')}
                            >
                                Tạo tài khoản tại đây
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            
        );
};
//--------------------------------------------------------------------------------------------------------------------------------------


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formBox: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'stretch',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1c1e21',
        textAlign: 'center',
        marginBottom: 12,
        marginTop: 4,
    },
    subtitle: {
        fontSize: 15,
        color: '#606770',
        textAlign: 'center',
        marginBottom: 18,
    },
    label: {
        fontSize: 15,
        color: '#606770',
        marginBottom: 4,
        marginTop: 10,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#dddfe2',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 2,
        backgroundColor: '#F7F8FA',
    },
    forgot: {
        color: '#1877F2',
        fontSize: 13,
        marginLeft: 8,
        textDecorationLine: 'underline',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1.5,
        borderColor: '#dddfe2',
        borderRadius: 4,
        backgroundColor: '#F7F8FA',
        marginRight: 6,
    },
    keepSigned: {
        color: '#606770',
        fontSize: 14,
    },
    buttonContainer: {
        marginTop: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    orText: {
        textAlign: 'center',
        color: '#B0B3B8',
        marginVertical: 18,
        fontSize: 14,
    },
    googleBtn: {
        backgroundColor: '#F0F2F5',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 10,
    },
    googleText: {
        color: '#606770',
        fontWeight: 'bold',
        fontSize: 15,
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    loginText: {
        color: '#606770',
        fontSize: 15,
    },
    loginLink: {
        color: '#1877F2',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 6,
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;