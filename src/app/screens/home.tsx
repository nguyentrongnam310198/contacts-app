import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView, Image, FlatList, TouchableOpacity, Dimensions,
  Pressable
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { NavigationProp, useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import RootStackParamList from '../../types/route';
import { useAppContext } from '../../context-api/app.context';

//----------------------------------------------------------------------------------------------------------

const HomeScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { contacts, setContacts, favorites, isFavorite } = useAppContext();  // Lấy contacts và favorites từ context

    //***Fetch danh sách users từ API và merge với context
    const [apiUsers, setApiUsers] = useState<any[]>([]);  // Danh sách từ API
    const [error, setError] = useState<string | null>(null);
    const isFocused = useIsFocused();
    const route = useRoute<any>();  // Type as any để tránh lỗi TypeScript

    // Fetch API lần đầu - load vào context
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log('[Home] Fetching users from API...');
                const response = await axios.get('https://jsonplaceholder.typicode.com/users', { timeout: 5000 });
                let apiUsersData = Array.isArray(response?.data) ? response.data : [];
                console.log('[Home] API users:', apiUsersData);
                // Load API users vào context (nếu contacts rỗng)
                if (contacts.length === 0) {
                    setContacts(apiUsersData);
                }
                setError(null);
            } catch (err: any) {
                console.log('[Home] API error:', err);
                setError(err.message || 'Lỗi khi tải dữ liệu');
            }
        };
        fetchUsers();
    }, []);  // Chỉ chạy 1 lần khi component mount

    // Khi quay lại home từ addcontact, thêm user mới vào context
    useEffect(() => {
        const params: any = route.params;
        if (params?.newUser) {
            console.log('[Home] Có user mới từ params:', params.newUser);
            // Kiểm tra user đã tồn tại chưa (tránh duplicate)
            const exists = contacts.some((c: any) => c.id === params.newUser.id);
            if (!exists) {
                setContacts([params.newUser, ...contacts]);
            }
        }
    }, [route.params?.newUser]);  // Loại bỏ contacts khỏi dependency

    // Sử dụng contacts từ context trực tiếp
    const users = contacts;


    //***Reload when screen is focused (useIsFocused)
    // Xoá effect reload cũ, chỉ cần effect trên là đủ


  
    //***Xử lý search
    const [keyword, setKeyword] = useState('');

    //*Lọc users theo `keyword` (tên) - case insensitive
    const filteredUsers = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) {
            console.log('[Home] Render filteredUsers:', users);
            return users;
        }
        const filtered = users.filter(u => (u.name || '').toLowerCase().includes(q));
        console.log('[Home] Render filteredUsers (search):', filtered);
        return filtered;
    }, [users, keyword]);
    //useMemo: chỉ render lại khi 'users' hoặc 'keyword' thay đổi

//----------------------------------------------------------------------------------------------------------

  return (
    <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.logo}>LIÊN HỆ</Text>
            <View style={styles.headerIcons}>
                <Pressable onPress={() => navigation.navigate('addcontact')}>
                    <Ionicons name="person-add-outline" size={30} style={styles.headerIcon} />
                </Pressable>
                
            </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput 
                style={styles.input} 
                placeholder="Tìm kiếm" 
                value={keyword}
                onChangeText={setKeyword}
            />
            <Pressable onPress={() => { if (keyword) setKeyword(''); }}>
                <Ionicons name={keyword ? 'backspace-outline' : 'close-outline'} size={20} color="#666" />
            </Pressable>
        </View>


        {/* List */}
        <View style={styles.dealHeader}>
            <TouchableOpacity>
                {/* <Text 
                style={styles.exploreMore}
                onPress={() => navigation.navigate('addcontact')}
                >THÊM</Text> */}
            </TouchableOpacity>
        </View>

                {error ? (
                    <Text style={{ margin: 16, color: 'red' }}>{error}</Text>
                ) : filteredUsers.length === 0 ? (
                    <Text style={{ margin: 16, color: '#888' }}>Không có liên hệ nào</Text>
                ) : (
                    <>
                        {/* Debug: show user count */}
                        <Text style={{ marginLeft: 16, color: '#888', fontSize: 15 }}>Tổng số: {filteredUsers.length}</Text>
                        <FlatList
                            data={filteredUsers}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item => String(item.id)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.userItem}
                                    onPress={() => navigation.navigate('detail', { user: item })}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.userName}>{item.name}</Text>
                                            <Text style={styles.userEmail}>{item.email}</Text>
                                        </View>
                                        {isFavorite(item.id) && (
                                            <Ionicons name="star" size={20} color="#FFD700" style={{ marginLeft: 8 }} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </>
                )}

    </View>
  );
};

const styles = StyleSheet.create({
  
container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingTop: 40
    },

header: { 
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16 
    },

logo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1877F2' 
    },

headerIcons: { 
    flexDirection: 'row'
    },

headerIcon: { 
    marginLeft: 16, color: '#888'
    },

searchWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2',
    borderRadius: 12, margin: 16, paddingHorizontal: 12, height: 44,
    },

input: { 
    flex: 1, 
    marginLeft: 8, 
    fontSize: 16 
    },

storiesWrapper: { 
    flexDirection: 'row', 
    marginLeft: 16, 
    marginBottom: 8     
    },

storyItem: { 
    alignItems: 'center', 
    marginRight: 16, 
    width: 64 
    },

storyAvatar: { 
    width: 54, 
    height: 54, 
    borderRadius: 27, 
    borderWidth: 2, 
    borderColor: '#1877F2'
    },

dealHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginHorizontal: 16, 
    marginTop: 8
    },

dealTitle: { 
    fontWeight: 'bold', 
    fontSize: 16 
    },

exploreMore: { 
    color: '#1877F2', 
    fontWeight: 'bold'
    },

dealImage: { 
    width: 120, 
    height: 80, 
    borderRadius: 12, 
    margin: 8
    },

userItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        backgroundColor: '#fff'
    },

userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111'
    },

userEmail: {
        fontSize: 13,
        color: '#666',
        marginTop: 4
    },

bottomTab: {
    flexDirection: 'row', 
    justifyContent: 'space-around',  //chia đều khoảng cách giữa các icon
    alignItems: 'center',  //căn giữa theo chiều dọc
    height: 56,  
    borderTopWidth: 1, 
    borderColor: '#eee', 
    backgroundColor: '#fff', 
    marginTop: 8,
    },
});

export default HomeScreen;

// Hook	                Khi nào dùng
// useIsFocused	        Chỉ cần biết trạng thái focus (true/false)
// useFocusEffect   	Cần cleanup khi rời màn