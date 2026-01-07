import React from "react";
import { StyleProp, TextStyle } from "react-native";
import { Button, Text, Spinner, ButtonProps } from "tamagui";

// Kế thừa ButtonProps của Tamagui
interface IProps extends ButtonProps {
    tittle: string;
    onPress: () => void;
    icons?: any;
    loading?: boolean;
    textStyle?: StyleProp<TextStyle>;
    backgroundColor: any;
    bg: any;
}

const AppButton = (props: IProps) => {
    const {
        tittle,
        onPress,
        icons,
        loading = false,
        textStyle,
        backgroundColor,
        bg,
        ...rest
    } = props;

    const activeBg = backgroundColor || bg || undefined;

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
                {tittle}
            </Text>
        </Button>
    )
}

export default AppButton;