import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSelector } from 'react-redux';
import Following from './Following';
import Followers from './Followers';
import { ArrowLeft2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const Index = () => {

    const navigation = useNavigation()

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    return (
        <>
            <View style={{ flexDirection: 'row', paddingVertical: 10, backgroundColor: "#FFF" }}>
                <ArrowLeft2
                    size="24"
                    color="#000"
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={{ marginRight: 10, marginLeft: 10 }}
                />
                <Text style={{ fontSize: 18, fontWeight: '700' }}>
                    Daftar Teman
                </Text>
            </View>
            <Tab.Navigator
                screenOptions={{
                    tabBarLabelStyle: { fontWeight: '500' },
                    tabBarActiveTintColor: themeSetting?.accent_color?.value,
                    tabBarInactiveTintColor: '#A6A6A6',
                    tabBarIndicatorStyle: {
                        backgroundColor: themeSetting?.accent_color?.value,
                    },
                }}>
                <Tab.Screen
                    name="Mengikuti"
                    component={Following}
                />
                <Tab.Screen
                    name="Pengikut"
                    component={Followers}
                />
            </Tab.Navigator>
        </>
    );
}

const styles = StyleSheet.create({})

export default Index;
