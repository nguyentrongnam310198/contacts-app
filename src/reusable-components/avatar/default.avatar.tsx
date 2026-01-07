import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

interface AvatarProps {
  uri?: string;          // link ảnh
  size?: number;         // kích thước avatar
  borderColor?: string;  // viền avatar
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 48,
  borderColor = '#ddd',
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
        },
      ]}
    >
      <Image
        source={
          uri
            ? { uri }
            : require('../assets/avatar-default.png') // ảnh mặc định
        }
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});
