import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Button,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RootStackParamList from '../../types/route';
import { useAppContext } from '../../context-api/app.context';


type DetailRouteProp = RouteProp<RootStackParamList, 'detail'>;
    //RouteProp: lấy kiểu dữ liệu của route
    //RootStackParamList: quy định màn nào phải có params gì - ở đây là Route detail' có param 'user'


const DetailScreen = () => {
    const route = useRoute<DetailRouteProp>();  
    const navigation = useNavigation();
    const user = route.params?.user as any | undefined;
    const { contacts, setContacts, toggleFavorite, isFavorite } = useAppContext();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isFav, setIsFav] = useState(false);  // Track favorite status

    //***Tải dữ liệu user vào các state khi component được mount
    useEffect(() => {
        if (!user) return;
        setAvatar(user.avatar || null);
        setIsFav(isFavorite(user.id));  // Check if user is favorite
        const name = user.name || '';
        const parts = name.trim().split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
        setCompany((user.company && user.company.name) || user.company || '');
        setPhone(user.phonenumber || user.phone || '');
        setEmail(user.email || '');
        if (user.address) {
            if (typeof user.address === 'string') setAddress(user.address);
            else if (user.address.street) setAddress(`${user.address.street} ${user.address.suite || ''}`.trim());
            else setAddress(JSON.stringify(user.address));
        }
    }, [user]);

    const handleSave = () => {
        // Validate tên dữ liệu đầu vào
        if (!firstName && !lastName) {
            Alert.alert('Lưu thất bại', 'Vui lòng nhập tên');
            return;
        }  

        // Tạo object user sau khi chỉnh sửa
        const updated = {
            ...user,
            name: `${firstName} ${lastName}`.trim(),
            phonenumber: phone,
            phone: phone,
            email,
            address,
            company: company ? { name: company } : user.company,
            avatar,
        };

        // Cập nhật vào context
        const exists = contacts.findIndex((s: any) => String(s.id) === String(updated.id));
        let newList = [...contacts];
        if (exists >= 0) {
            newList[exists] = updated;
        } else {
            newList = [updated, ...contacts];
        }
        setContacts(newList);
        Alert.alert('Thông báo', 'Đã lưu');
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="close" size={26} color="#111" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>THÔNG TIN LIÊN HỆ</Text>
                
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity 
                        onPress={async () => {
                            if (!user) return;
                            await toggleFavorite(user.id);
                            setIsFav(!isFav);
                        }}
                        style={styles.headerBtn}
                    >
                        <Ionicons name={isFav ? "star" : "star-outline"} size={26} color={isFav ? "#FFD700" : "#111"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
                        <Ionicons name="checkmark" size={26} color="#1877F2" />
                    </TouchableOpacity>
                </View>
            </View>


            {/* List */}
            <View style={styles.list}>
                <ScrollView contentContainerStyle={[styles.container, styles.listPaddingBottom]}>
                    <TouchableOpacity style={styles.avatarWrap} onPress={() => {}}>
                        {avatar ? (
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="camera" size={28} color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={styles.rowInline}>
                        <View style={styles.inputHalf}>
                            <Text style={styles.label}>Tên</Text>
                            <TextInput value={firstName} onChangeText={setFirstName} placeholder="Nhập tên" style={styles.input} />
                        </View>
                        <View style={styles.inputHalf}>
                            <Text style={styles.label}>Họ</Text>
                            <TextInput value={lastName} onChangeText={setLastName} placeholder="Nhập họ" style={styles.input} />
                        </View>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Nơi làm việc</Text>
                        <TextInput value={company} onChangeText={setCompany} placeholder="Nhập nơi làm việc" style={styles.input} />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Số điện thoại</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Nhập số điện thoại"
                            keyboardType="phone-pad"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput value={email} onChangeText={setEmail} placeholder="Nhập email" keyboardType="email-address" style={styles.input} />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Địa chỉ</Text>
                        <TextInput value={address} onChangeText={setAddress} placeholder="Nhập địa chỉ" style={styles.input} />
                    </View>

                </ScrollView>
            </View>

            {/* Nút xoá liên hệ */}
            <View style={styles.deleteWrap}>
                <Button
                    title="Xoá liên hệ"
                    color="#ca3a32"
                    onPress={() => {
                        if (!user) return;
                        Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa liên hệ này?', [
                            { text: 'Hủy', style: 'cancel' },
                            { text: 'Xóa', style: 'destructive', onPress: () => {
                                try {
                                    //*Xoá khỏi context - tự động cập nhật home screen
                                    const filtered = contacts.filter((s: any) => String(s.id) !== String(user.id));
                                        //contacts: danh sách user hiện tại
                                        //filter: trả về mảng mới thoả mãn điều kiện
                                        //(s: any): mỗi phần tử trong mảng contacts
                                        //String(s.id): chuyển id sang chuỗi để so sánh
                                        //String(s.id) !== String(user.id): giữ lại những user có id khác với id của user đang xem
                                        //==> Ý nghĩa: trả về 1 mảng mới không chứa user đang xem
                                    setContacts(filtered);
                                    Alert.alert('Thông báo', 'Liên hệ đã được xóa');
                                    navigation.goBack();
                                } catch (e) {
                                    console.error('Delete contact error', e);
                                    Alert.alert('Lỗi', 'Không thể xóa liên hệ');
                                }
                            } }
                        ]);
                    }}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    header: {
        flex: 1,
        height: 56,
        paddingTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: '#fff',
        backgroundColor: '#fff',
    },
    
    list: {
        flex: 8,
    },

    headerBtn: { 
        padding: 8
    },
        
    headerTitle: {
        fontSize: 18,
        fontWeight: '600'
    },

    saveBtn: { 
        padding: 8 },

    saveText: { 
        color: '#1877F2',
        fontWeight: '800', 
        fontSize: 18
    },

    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    avatarWrap: {
        marginVertical: 12,
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
    },
    avatarPlaceholder: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#1877F2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    rowInline: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    inputHalf: { flex: 1 },
    field: { width: '100%', marginTop: 12 },

    label: { 
        paddingLeft: 8,
        fontSize: 18,
        color: '#666',
        marginBottom: 6 ,
        fontWeight: '900',
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
    listPaddingBottom: {
        paddingBottom: 90,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },
    deleteWrap: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 100
    },
});

export default DetailScreen;
