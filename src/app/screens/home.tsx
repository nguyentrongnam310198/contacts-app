import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView, Image, FlatList, TouchableOpacity, Dimensions,
  Pressable
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// navigation not needed for inline search
import axios from 'axios';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import RootStackParamList from '../../types/route';
import StorageService, { StorageKeys } from '../../utils/storage/storage';

//----------------------------------------------------------------------------------------------------------

const HomeScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const { width } = Dimensions.get('window');  


  //***Fetch danh sách users từ API
  const [users, setUsers] = useState<any[]>([]);  //liên hệ lấy từ API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
                // Load stored contacts and prepend them to API result
                const stored: any = await StorageService.getItem(StorageKeys.CONTACTS);
                if (stored && Array.isArray(stored)) {
                    setUsers([...stored, ...response.data]);
                } else {
                    setUsers(response.data);
                }
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải dữ liệu');
        console.error('Fetch users error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  //***Load danh bạ đã lưu từ AsyncStorage khi màn hình được focus lại
  useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                const stored: any = await StorageService.getItem(StorageKeys.CONTACTS);
                if (stored && Array.isArray(stored)) {
                    setUsers(prev => {
                        //*Loại bỏ các user trùng lặp (dựa trên id)
                        const prevWithoutStored = prev.filter(u => !stored.find((s: any) => String(s.id) === String(u.id)));
                        return [...stored, ...prevWithoutStored];
                    });
                }
            } catch (e) {
                console.error('Load stored contacts on focus', e);
            }
        });

        return unsubscribe;
    }, [navigation]);


  
    //***Xử lý search
    const [keyword, setKeyword] = useState('');

    //*Lọc users theo `keyword` (tên) - case insensitive
    const filteredUsers = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return users;
        return users.filter(u => (u.name || '').toLowerCase().includes(q));
    }, [users, keyword]);


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
            {/* <Text style={styles.dealTitle}>LIÊN HỆ</Text> */}
            <TouchableOpacity>
                {/* <Text style={styles.exploreMore}>THÊM</Text> */}
            </TouchableOpacity>
        </View>

                {loading ? (
                    <Text style={{ margin: 16 }}>Đang tải...</Text>
                ) : error ? (
                    <Text style={{ margin: 16, color: 'red' }}>{error}</Text>
                ) : (
                    <FlatList
                        data={filteredUsers}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => String(item.id)}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.userItem}
                                onPress={() => navigation.navigate('detail', { user: item })}
                            >
                                <Text style={styles.userName}>{item.name}</Text>
                                <Text style={styles.userEmail}>{item.email}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}

        {/* Bottom Tab (giả lập)
        <View style={styles.bottomTab}>
            <Ionicons name="home" size={24} color="#1877F2" />
            <Ionicons name="compass-outline" size={24} color="#888" />
            <FontAwesome name="newspaper-o" size={24} color="#888" />
            <Ionicons name="person-outline" size={24} color="#888" />
      </View> */}
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

storyName: { 
    fontSize: 12, 
    marginTop: 4, 
    width: 54, 
    textAlign: 'center' 
    },

bannerWrapper: { 
    height: 160, 
    marginBottom: 8
    },

bannerImage: { 
    width: Dimensions.get('window').width - 32, 
    height: 150, 
    borderRadius: 16, 
    marginHorizontal: 16
    },

storyTitle: { 
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginHorizontal: 16, 
    marginTop: 8,
    marginBottom: 6
    },

bannerTitle: { 
    fontWeight: 'bold',  //độ dày chữ
    fontSize: 16, 
    marginLeft: 16,
    marginBottom: 5
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