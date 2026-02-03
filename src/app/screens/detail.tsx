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
import { useTheme } from '../../reusable-components/theme/themeContext';

type DetailRouteProp = RouteProp<RootStackParamList, 'detail'>;

const DetailScreen = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();
  const { contacts, setContacts, toggleFavorite, isFavorite, updateContact } = useAppContext();
  const { colors } = useTheme();

  const userFromRoute = route.params?.user as any | undefined;
  const user = contacts.find((c: any) => String(c.id) === String(userFromRoute?.id)) || userFromRoute;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setAvatar(user.avatar || null);
    setIsFav(isFavorite(user.id));
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
  }, [user?.id, isFavorite, user]);

  const handleSave = () => {
    if (!firstName && !lastName) {
      Alert.alert('Lưu thất bại', 'Vui lòng nhập tên');
      return;
    }
    const updated = {
      ...user,
      name: `${firstName} ${lastName}`.trim(),
      phonenumber: phone,
      phone,
      email,
      address,
      company: company ? { name: company } : user.company,
      avatar,
    };
    updateContact(user.id, updated);
    Alert.alert('Thông báo', 'Đã lưu');
    navigation.goBack();
  };

    return (
    <KeyboardAvoidingView style={[styles.screen, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { backgroundColor: colors.background }]}> 
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={35} color={colors.subText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>THÔNG TIN LIÊN HỆ</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={async () => { await toggleFavorite(user.id); setIsFav(isFavorite(user.id)); }} style={styles.headerBtn}>
            <Ionicons name={isFav ? 'star' : 'star-outline'} size={26} color={isFav ? '#FFD700' : colors.subText} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
            <Ionicons name="save-outline" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.list}>
        <ScrollView contentContainerStyle={[styles.container, styles.listPaddingBottom]}>
          <TouchableOpacity style={styles.avatarWrap} onPress={() => {}}>
                {avatar ? <Image source={{ uri: avatar }} style={styles.avatar} /> : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Ionicons name="camera" size={28} color={colors.buttonText} />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.rowInline}>
            <View style={styles.inputHalf}>
              <Text style={[styles.label, { color: colors.subText }]}>Tên</Text>
              <TextInput value={firstName} onChangeText={setFirstName} style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]} placeholderTextColor={colors.placeholder} />
            </View>
            <View style={styles.inputHalf}>
              <Text style={[styles.label, { color: colors.subText }]}>Họ</Text>
              <TextInput value={lastName} onChangeText={setLastName} style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]} placeholderTextColor={colors.placeholder} />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.subText }]}>Nơi làm việc</Text>
            <TextInput value={company} onChangeText={setCompany} style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]} placeholderTextColor={colors.placeholder} />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.subText }]}>Số điện thoại</Text>
            <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]} placeholderTextColor={colors.placeholder} />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.subText }]}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]} placeholderTextColor={colors.placeholder} />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.subText }]}>Địa chỉ</Text>
            <TextInput value={address} onChangeText={setAddress} style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]} placeholderTextColor={colors.placeholder} />
          </View>

        </ScrollView>
      </View>

      <View style={styles.deleteWrap}>
        <Button title="Xoá liên hệ" color="#ca3a32" onPress={() => {
          Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa liên hệ này?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Xóa', style: 'destructive', onPress: () => { setContacts(contacts.filter((c: any) => String(c.id) !== String(user.id))); navigation.goBack(); } }
          ]);
        }} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  center: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center' 
    },

  screen: { 
    flex: 1
    },

  header: {
    marginTop: 40,
    
    borderBottomWidth: 0,
    height: Platform.OS === 'ios' ? 88 : 72,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    
    zIndex: 10,
    elevation: 2,
  },

  headerBtn: { padding: 8 },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    // center the title regardless of left/right button widths
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  headerActions: { flexDirection: 'row', gap: 8 },

  list: { flex: 1 },
  container: { padding: 20, alignItems: 'center' },

  avatarWrap: { marginVertical: 12 },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    
    justifyContent: 'center',
    alignItems: 'center',
  },

  rowInline: { flexDirection: 'row', width: '100%', gap: 12 },
  inputHalf: { flex: 1 },
  field: { width: '100%', marginTop: 12 },

  label: { fontSize: 16, marginBottom: 6 },
  input: {
    
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 44,
  },

  listPaddingBottom: { paddingBottom: 90 },
  deleteWrap: { position: 'absolute', left: 20, right: 20, bottom: 100 },
});

export default DetailScreen;
