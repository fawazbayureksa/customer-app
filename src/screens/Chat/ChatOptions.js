import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { ChatRouteName } from '../../constants/chat_route/ChatRouteName';
import { drsRouteName } from '../../constants/drs_route/drsRouteName';

const ChatOptions = ({ route }) => {
    const navigation = useNavigation()
    const WIDTH = Dimensions.get('window').width * 0.95;


    // console.log(route.params.data.with_dropdown)

    useEffect(() => {
        if (route.params.data.with_dropdown === "yes") {
            return
        }
        else {
            navigation.replace(ChatRouteName.CHAT)
        }
    }, [])

    return (
        <ScrollView style={{ backgroundColor: "#FFF" }}>


            <View style={{ flex: 1, alignItems: "center", marginTop: 10 }}>
                {route.params.data.dropdown && route.params.data.dropdown.map((value, index) => {
                    if (value.is_enabled && value.type === 'personal_chat') {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate(ChatRouteName.CHAT)} key={index}>
                                <Shadow distance={3} startColor={'#00000010'} radius={8}>
                                    <View
                                        style={{
                                            height: WIDTH * 0.50,
                                            width: WIDTH,
                                            backgroundColor: '#fff',
                                            borderRadius: 8,
                                            padding: 8,
                                            borderWidth: 1,
                                            borderColor: 'rgba(10, 0, 0, 0.1)',
                                            justifyContent: 'center',
                                            alignItems: "center"
                                        }}>
                                        <Image source={require('../../assets/images/icon_message.png')} />
                                        <Text style={{ fontWeight: "700", fontSize: 16 }}>Pesan Pribadi</Text>
                                        <Text>Buka percakapan pribadi Anda</Text>
                                    </View>
                                </Shadow>
                            </TouchableOpacity>
                        )
                    }
                    else if (value.is_enabled && value.type === 'help_center') {
                        return (
                            <TouchableOpacity style={{ marginTop: 10 }} key={index} onPress={() => navigation.navigate(drsRouteName.HELP_CENTER_CHAT)}>
                                <Shadow distance={3} startColor={'#00000010'} radius={8}>
                                    <View
                                        style={{
                                            height: WIDTH * 0.50,
                                            width: WIDTH,
                                            backgroundColor: '#fff',
                                            borderRadius: 8,
                                            padding: 8,
                                            borderWidth: 1,
                                            borderColor: 'rgba(10, 0, 0, 0.1)',
                                            justifyContent: 'center',
                                            alignItems: "center"
                                        }}>
                                        <Image source={require('../../assets/images/cs_icon.png')} />
                                        <Text style={{ fontWeight: "700", fontSize: 16 }}>Pesan Bantuan</Text>
                                        <Text>Buka percakapan Anda dengan tim Tokodapur</Text>
                                    </View>
                                </Shadow>
                            </TouchableOpacity>
                        )
                    }
                })}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({})

export default ChatOptions;
