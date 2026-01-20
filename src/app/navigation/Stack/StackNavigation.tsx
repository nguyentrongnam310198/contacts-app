import React from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import CartScreen from '../../screens/cart.tsx';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../../../context-api/app.context.tsx';
import { ThemeProvider } from '../../../reusable-components/theme/themeContext.tsx'
// import SignUpModal from './\(auth\)/signup.modal';
// import RequestPasswordModal from './(auth)/request.password.modal';
// import ForgotPasswordModal from './(auth)/forgot.password.modal';
// import RootPage from '.';
// import VerifyPage from './(auth)/verify.modal';
import { TamaguiProvider } from 'tamagui';
// import config from '../../tamagui.config';
import '../../../i18n/i18n.ts';
import LoginScreen from '../../screens/login.tsx';
import WeatherScreen from '../../screens/weather.tsx';
import CreateAccountScreen from '../../screens/create.account.tsx';
import config from '../../../../tamagui.config.ts'
import TabNavigator from '../Tab/TabNavigation.tsx';
import SearchScreen from '@/app/screens/search.tsx';
import { RootStackParamList } from '@/types/route.js';


//---------------------------------------------------------------------------------------------------------

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  return (
    <TamaguiProvider config={config}>
      <ThemeProvider> 
        <AppProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="login">
                console.log(SearchScreen)
                <Stack.Screen
                  name='weather'
                  component={WeatherScreen}
                  options={{
                    headerShown: false
                  }}
                />

                <Stack.Screen 
                  name="login" 
                  component={LoginScreen} 
                  options={{ headerShown: false }} 
                />

                <Stack.Screen 
                  name="create_account" 
                  component={CreateAccountScreen} 
                  options={{ headerShown: false }} 
                />

                <Stack.Screen
                  name='Tab'
                  component={TabNavigator}
                  options={{
                    headerShown: false
                  }}                
                />

                <Stack.Screen
                  name='search'
                  component={SearchScreen}
                  options={{
                    headerShown: false
                  }}
                />

              </Stack.Navigator>
            </NavigationContainer>
        </AppProvider>
      </ThemeProvider>
    </TamaguiProvider>    
  );
};

export default StackNavigation;