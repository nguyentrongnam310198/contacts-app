import React from "react";
import { StyleProp, TextStyle } from "react-native";
import { Button, Text, Spinner, ButtonProps } from "tamagui";

// Kế thừa ButtonProps của Tamagui
interface IProps extends ButtonProps {
    title: string;
    onPress: () => void;
    icons?: any;
    loading?: boolean;
    borderWidth?: number; 
    borderColor?: string; 
    textStyle?: StyleProp<TextStyle>;
    backgroundColor: any;
    bg?: string;
    [key: string]: any; // Dòng này cho phép nhận thêm bất kỳ thuộc tính nào khác như width, height...
}

const AppButton = (props: IProps) => {
    // props nhận tất cả giá trị từ Iprops
    const {
        title,
        onPress,
        icons,
        loading = false,
        textStyle,
        backgroundColor,
        bg,
        ...rest
    } = props;  //Bóc tách: Bạn lấy các props quan trọng (title, loading, bg) ra để xử lý logic riêng ngay tại component này.

    const activeBg = backgroundColor || bg || undefined;
    // Kiểm tra backgroundColor trước.
    // Nếu không có, kiểm tra bg.
    // Nếu cả hai đều không có, để là undefined để Tamagui dùng màu mặc định của Theme.
    // Mục đích: Giúp component hoạt động ổn định dù bạn dùng tên prop đầy đủ hay viết tắt.

    return (
        <Button
            onPress={onPress}
            disabled={loading}
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap="$2"
            paddingVertical="$2"
            borderRadius="$6"
            backgroundColor={activeBg}
            pressStyle={{
                opacity: 0.8,
                backgroundColor: activeBg,
                borderWidth: 0 // Đảm bảo không bị viền lạ khi nhấn
            }}
            icon={loading ? <Spinner color="$color" /> : icons}
            {...rest}
        >
            <Text
                fontSize={16}
                fontWeight="600"
                color={"$color"}
                style={textStyle}
            >
                {title}
            </Text>
        </Button>
    )
}

export default AppButton;