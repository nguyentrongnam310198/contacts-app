import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from '../../../context-api/app.context.tsx';
import { ThemeProvider } from '../../../reusable-components/theme/themeContext.tsx'

import { TamaguiProvider } from 'tamagui';
import '../../../i18n/i18n.ts';

import config from '../../../../tamagui.config.ts'
import RootStackParamList from '@/types/route.js';
import HomeScreen from '../../screens/home.tsx';
import AddContactScreen from '../../screens/addcontact.tsx';
import DetailScreen from '../../screens/detail.tsx';


//---------------------------------------------------------------------------------------------------------

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  return (
    <TamaguiProvider config={config}>
      <ThemeProvider> 
        <AppProvider>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  name='home'
                  component={HomeScreen}
                  options={{
                    headerShown: false
                  }}
                />

                <Stack.Screen
                  name='addcontact'
                  component={AddContactScreen}
                  options={{ headerShown: false }}
                />

                <Stack.Screen 
                  name="detail" 
                  component={DetailScreen} 
                  options={{ headerShown: false }} 
                />

              </Stack.Navigator>
            </NavigationContainer>
        </AppProvider>
      </ThemeProvider>
    </TamaguiProvider>    
  );
};

export default StackNavigation;