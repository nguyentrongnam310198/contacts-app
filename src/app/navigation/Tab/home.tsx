import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView, Image, FlatList, TouchableOpacity, Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import BottomTabs from '../navigation/bottom_tabs';
import { useNavigation } from '@react-navigation/native';


//----------------------------------------------------------------------------------------------------------


const product_type = [
  { id: '1', name: 'Ronaldo', image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2025/2/4/1458351/Ronaldo-1.jpg' },
  { id: '2', name: 'Rooney', image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSYsnONLouYuoYaq0CNWTJvvi_ZaseMgdRwPk62pcQ0tf6RnTJR' },
  { id: '3', name: 'Beckham', image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcSatFNVfJIUiBzfPpgumwcyxMLkzFMpCAJ7lpmSmJEYD6ugOcR-hKclNP_gS6biMLczI36mICBnK1NTPVg' },
  { id: '4', name: 'Casillas', image: 'https://icdn.dantri.com.vn/qBmhJ8qjBodls0C2KN9J8PNJuaavPM/Image/2015/07/Porto120715-8999f.jpg' },
];

const banners = [
  { id: '1', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBWsuevZFmT4ZHMmNjV8QFuugBcc2v7ecwQw&s' },
  { id: '2', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQj2mgAhnefBNNhFyWq84qDVIm4Aqkpx_Hlg&s' },
  { id: '3', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb1gPwfLcNkRCmT2E0Z6gI16BV6dAXyvGIjA&s' },
  { id: '4', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs9BwOH2b1Z9iDBQnoW-Yz9sldv6QHW3tORg&s' },

];

const deals = [
  { id: '1', image: 'data:image/jpeg;base64,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' },
  { id: '2', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF2PmggAcoPJcgbEaitHxzLSxKMFZFt8xKiw&sS' },
  { id: '3', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSWYHYKCMe2i3vX8DTd8OaYO--el5rrjywTQ&s' },
  { id: '4', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLMaU6aELRvnDHsGUJPw0LHtwQa1wKIf4EoA&s' },
  { id: '5', image: 'https://inkythuatso.com/uploads/images/2022/01/banner-do-an-inkythuatso-14-09-12-48.jpg' },

  
];



const HomeScreen = () => {

  const navigation = useNavigation();


  const { width } = Dimensions.get('window');  //Lấy kích thước màn hình: Cung cấp chiều rộng và chiều cao thực tế của "window" (vùng cửa sổ ứng dụng) và "screen" (toàn bộ màn hình thiết bị).

  const scrollRef = useRef<ScrollView>(null);  
  const [bannerIndex, setBannerIndex] = useState(0);

  // Auto scroll banner
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (bannerIndex + 1) % banners.length;
      setBannerIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    }, 3000);
    return () => clearInterval(timer);
  }, [bannerIndex]);

//----------------------------------------------------------------------------------------------------------

  return (
    <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.logo}>Logo</Text>
            <View style={styles.headerIcons}>
                <Ionicons name="cart-outline" size={22} style={styles.headerIcon} />
            </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput style={styles.input} placeholder="Tìm kiếm" />
            <Ionicons name="options-outline" size={20} color="#666" />
        </View>

        {/* Stories */}
        <Text
          style={styles.storyTitle}>
            CỬA HÀNG BẠN ĐANG THEO DÕI
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesWrapper}>
            {product_type.map(product => (
                <View key={product.id} style={styles.storyItem}>
                <Image source={{ uri: product.image }} style={styles.storyAvatar} />
                    <Text style={styles.storyName} numberOfLines={1}>{product.name}</Text>
                </View>
            ))}
        </ScrollView>

        {/* Banner */}
        <Text
          style={styles.bannerTitle}>
            TẶNG BẠN THÁNG 12 NÀY
        </Text>
        <ScrollView
            ref={scrollRef}
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            style={styles.bannerWrapper}
        >
        {banners.map(banner => (  //lặp qua mảng banners để hiển thị ảnh --> gán vào banner --> gọi banner.id và banner.image (obj)
            <Image key={banner.id} source={{ uri: banner.image }} style={styles.bannerImage} />
        ))}
        
        </ScrollView>

        {/* Deals */}
        <View style={styles.dealHeader}>
            <Text style={styles.dealTitle}>KÈO THƠM CHO BẠN</Text>
            <TouchableOpacity>
                <Text style={styles.exploreMore}>THÊM</Text>
            </TouchableOpacity>

        </View>
            <FlatList
                data={deals}
                horizontal showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                <Image source={{ uri: item.image }} style={styles.dealImage} />
            )}
      />

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