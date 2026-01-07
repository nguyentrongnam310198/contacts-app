import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView, Image, FlatList, TouchableOpacity, Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import BottomTabs from '../navigation/bottom_tabs';
import { useNavigation } from '@react-navigation/native';



const CartScreen = () => {
  const navigation = useNavigation();       


    return (    
        <View style={styles.container}>
            <Text>Cart Screen</Text>
        </View>
    );
}       

const styles = StyleSheet.create({
    container: {    
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CartScreen;
