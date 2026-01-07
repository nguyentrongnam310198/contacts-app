import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from './profile';
import HomeScreen from './home';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { t } = useTranslation();
    return (
        <Tab.Navigator
            // #Thuộc tính dùng chung cho các tab
            screenOptions={({ route }) => ({
                //tham số route: route object của React Navigation cung cấp thông tin dịnh danh của màn hình đó được khai báo trong <Tab.Screen />

                headerShown: false,
                tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5 },
                // #Logic hiển thị icon động
                tabBarIcon: ({ focused, color, size }) => {  
                    //focused: biến boolean, sẽ là true nếu user đang ở tab đó
                    //color: giá trị mặc định của React Navigation (active --> xanh, không active --> xám)
                    let iconName = '';

                    if (route.name === 'home') {
                        iconName = focused ? 'home' : 'home-outline';
                        //toán tử 3 ngôi: nếu focused = true --> lấy 'home' và ngược lại

                        return (
                            // <MaterialCommunityIcons
                            //     name={iconName}
                            //     size={size}
                            //     color={color}
                            // />
                            <Ionicons 
                                name={iconName} 
                                size={size} 
                                color={color}
                            />
                        );
                    } else if (route.name === 'profile') {
                        iconName = focused ? 'person' : 'person-outline';
                        return (
                            // <MaterialCommunityIcons
                            //     name={iconName}
                            //     size={size}
                            //     color={color}
                            // />
                            <Ionicons 
                                name={iconName} 
                                size={size} 
                                color={color}
                            />
                        );
                    }
                },
            })}
        >
            <Tab.Screen
                name="home"
                component={HomeScreen}
                options={{
                    title: t('tabs.home_tab')
                }}
            />

            <Tab.Screen
                name="profile"
                component={ProfileScreen}
                options={{
                    title: t('tabs.profile_tab')
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;