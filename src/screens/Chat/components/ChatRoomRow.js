import React, { useContext, useState } from 'react'
import { Dimensions, Text, View, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { WebsocketContext, WebsocketPayloadType } from '../../helpers/websocket/WebsocketHelper';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../assets/theme/colors';
import moment from 'moment/moment';
import { ChatRouteName } from '../../../constants/chat_route/ChatRouteName';
import truncate from '../../../helpers/truncate';
import { IMAGE_URL } from '@env';

const WIDTH = Dimensions.get('window').width * 0.95;

const ChatRoomRow = ({ chatRoomData }) => {

    const { navigate } = useNavigation()

    let chatUser = chatRoomData?.users[0];
    if (chatRoomData?.users[0]?.user_type === 'customer') {
        chatUser = chatRoomData?.users[1];
    }

    let profilePicture = '';
    if (chatUser?.user_type === 'company') {
        profilePicture = chatUser?.picture;
    } else {
        profilePicture = `${IMAGE_URL}public/seller/${chatUser?.picture}`;
    }
    return (
        <View>
            {chatRoomData.messages.length > 0 &&
                <TouchableOpacity
                    onPress={() => navigate(ChatRouteName.CHAT_MESSAGE, { inputChatRoomId: chatRoomData.id })}
                    // key={index}
                    style={{
                        width: WIDTH,
                        marginTop: 10,
                        marginHorizontal: 10,
                        borderBottomColor: colors.line,
                        borderBottomWidth: 1,
                        paddingVertical: 10
                    }}
                >
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}>
                        <View style={{ width: '17.5%' }}>
                            <Image
                                source={{ uri: `${profilePicture}` }}
                                style={{ borderColor: 'grey', borderWidth: 1, height: 50, width: 50, borderRadius: 100, marginTop: 5, marginLeft: '7.5%' }}
                            />
                        </View>

                        <View style={{ width: '75%' }}>
                            <Text
                                style={{ fontWeight: "600" }}
                            >
                                {chatUser?.name}
                            </Text>
                            <Text style={{}}>{truncate(chatRoomData?.messages[0]?.message)}</Text>
                            <Text style={{ color: colors.textmuted }}>{moment(chatRoomData?.last_message_at).format('DD MMMM YYYY, HH : mm')}</Text>
                        </View>

                        {(chatRoomData?.unread) ?
                            <View style={{
                                backgroundColor: colors?.danger,
                                padding: 0, margin: 0,
                                width: 20, height: 20,
                                borderRadius: 50
                            }}>
                                <Text style={{ color: colors.white, fontSize: 12, textAlign: "center", fontWeight: "700", marginTop: 1 }}>{chatRoomData?.unread}</Text>
                            </View> :
                            <>
                            </>
                        }
                    </View>

                </TouchableOpacity>
            }
        </View>
    )
}

export default ChatRoomRow