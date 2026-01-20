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
import StorageService, { StorageKeys } from '../../utils/storage/storage';

type DetailRouteProp = RouteProp<RootStackParamList, 'detail'>;

const DetailScreen = () => {
    const route = useRoute<DetailRouteProp>();
    const navigation = useNavigation();
    const user = route.params?.user as any | undefined;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        setAvatar(user.avatar || null);
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

    const handleSave = async () => {
        if (!firstName && !lastName) {
            Alert.alert('Lưu thất bại', 'Vui lòng nhập tên');
            return;
        }

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

        try {
            const stored: any = await StorageService.getItem(StorageKeys.CONTACTS) || [];
            let newList: any[] = [];
            if (Array.isArray(stored) && stored.length) {
                const exists = stored.findIndex((s: any) => String(s.id) === String(updated.id));
                if (exists >= 0) {
                    newList = [...stored];
                    newList[exists] = updated;
                } else {
                    newList = [updated, ...stored];
                }
            } else {
                newList = [updated];
            }
            await StorageService.setItem(StorageKeys.CONTACTS, newList);
            Alert.alert('Thông báo', 'Đã lưu');
            navigation.goBack();
        } catch (e) {
            console.error('Save detail error', e);
            Alert.alert('Lỗi', 'Không thể lưu dữ liệu');
        }
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
                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                    <Text style={styles.saveText}>Lưu</Text>
                </TouchableOpacity>
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
                    onPress={async () => {
                        if (!user) return;
                        Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa liên hệ này?', [
                            { text: 'Hủy', style: 'cancel' },
                            { text: 'Xóa', style: 'destructive', onPress: async () => {
                                try {
                                    const stored: any = await StorageService.getItem(StorageKeys.CONTACTS) || [];
                                    const filtered = Array.isArray(stored) ? stored.filter((s: any) => String(s.id) !== String(user.id)) : [];
                                    await StorageService.setItem(StorageKeys.CONTACTS, filtered);
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
