import { View, Text, StyleSheet, Button, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TextInput } from 'react-native';
import { useState } from 'react';
import HomeScreen from '../navigation/Tab/home';
import RootStackParamList from '../../types/route';

// Đã loại bỏ AuthContext

//--------------------------------------------------------------------------------------------------------------------------------------
type CreateAccountScreenNavigationProp = NavigationProp<RootStackParamList>;

const CreateAccountScreen = () => {

const navigation = useNavigation<CreateAccountScreenNavigationProp>();

// Đã loại bỏ AuthContext

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");

    const handleCreateAccount = () => {
        if (!username || !password || !confirmpassword || !email) {
            Alert.alert('Thông tin không hợp lệ', 'Vui lòng điền đầy đủ thông tin');
            return;
        }
        
        setTimeout(() => {
            navigation.navigate('login')
        }, 2000)


    }


    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <View style={styles.formBox}>
                    <Text style={styles.title}>Tạo tài khoản mới</Text>

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholderTextColor="#B0B3B8"
                    />

                    <Text style={styles.label}>Tên đăng nhập</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tên đăng nhập"
                        value={username}  
                        onChangeText={setUserName}//người dùng nhập -> onChangeText được gọi
                                                //gọi hàm setEmail -> cập nhật email
                        placeholderTextColor="#B0B3B8"
                    />

                    <Text style={styles.label}>Mật khẩu</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#B0B3B8"
                    />

                    <Text style={styles.label}>Xác nhận mật khẩu</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập lại mật khẩu"
                        value={confirmpassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholderTextColor="#B0B3B8"
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Đăng ký"
                            color="#1877F2"
                            onPress={handleCreateAccount}
                        />
                    </View>

                    <Text style={styles.orText}>────────  hoặc  ────────</Text>

                    <View style={styles.loginLinkContainer}>
                        <Text style={styles.loginText}>Đã có tài khoản?</Text>
                        <Text
                            style={styles.loginLink}
                            onPress={() => navigation.navigate('login')}
                        >
                            Đăng nhập
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
        );


}

//Màu cho từng phần
const FB_BLUE = '#1877F2';
const FB_TEXT = '#1c1e21';
const FB_SUBTEXT = '#606770';
const FB_BORDER = '#dddfe2';
const FB_BG = '#f0f2f5';


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
        marginBottom: 18,
        marginTop: 4,
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
    buttonContainer: {
        marginTop: 18,
        borderRadius: 8,
        overflow: 'hidden',
    },
    orText: {
        textAlign: 'center',
        color: '#B0B3B8',
        marginVertical: 18,
        fontSize: 14,
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

export default CreateAccountScreen;