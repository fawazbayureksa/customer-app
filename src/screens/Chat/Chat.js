import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { WebsocketContext, WebsocketPayloadType } from '../../helpers/websocket/WebsocketHelper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { SearchNormal1 } from 'iconsax-react-native';
import colors from '../../assets/theme/colors';
import moment from 'moment/moment';
import { ChatRouteName } from '../../constants/chat_route/ChatRouteName';
import { MainRouteName } from '../../constants/mainRouteName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IMAGE_URL } from '@env';
import ChatRoomRow from './components/ChatRoomRow';

const WIDTH = Dimensions.get('window').width * 0.95;

const Chat = ({navigation}) => {
    const [ready, send, stat, payload, ws] = useContext(WebsocketContext); // use it just like a hook

    const { navigate } = useNavigation()
    //state
    const [chatRooms, setChatRooms] = useState([]);
    const [chatRoomsShown, setChatRoomsShown] = useState([]);
    const [currentchatRoomId, setCurrentChatRoomId] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [firstGet, setFirstGet] = useState(false);
    const [needRetry, setNeedRetry] = useState(false);
    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
    //chatTo: this.props.location.state || null, // e.g. {user_id: 1, user_type: "seller", product: {product data or null}
    const [chatTo, setChatTo] = useState();
    const [currentUser, setCurrentUser] = useState(AsyncStorage.getItem('user'));
    const [currentUserType, setCurrentUserType] = useState('customer');

  useEffect(() => {
    if (ready) {
    //   send("test message");
        console.log("test ready");
        getChatrooms();
        // onPayloadChange(payload);
        console.log("payload-type->", payload?.type);
    } else {
        if (!isLoggedIn) {
            navigate(MainRouteName.LOGIN);
        }
        console.log("websoket not ready");
    }
  }, [ready]);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
        getChatrooms();
    });
    return focusHandler;
}, [navigation]);

  useEffect(() => {
    funcSetChatRoomsShown
  }, [chatRooms]);

  useEffect(() => {
    onPayloadChange(payload);
    console.log("payload from chat", payload)
  }, [payload]);

  useEffect(() => {
    onWsChange();
  }, [ws]);

  const funcSetChatRoomsShown = () => {
    let tempChatRoomsShown = [].concat(chatRooms).sort((a, b) => {
        if (a.messages.length > 0) {
            if (b.messages.length > 0) {
                const a_last_message = a.messages[0];
                const b_last_message = b.messages[0];
                if (a_last_message.created_at > b_last_message.created_at) {
                    return -1
                }
                else if (a_last_message.created_at < b_last_message.created_at) {
                    return 1
                }
            }
            else return -1
        }
        else if (b.messages.length > 0) {
            return 1
        }
    })
    setChatRoomsShown(tempChatRoomsShown);
    console.log("Chat Room Shown", chatRoomsShown);
  }

    const getChatrooms = () => {
        let param = {
            type: WebsocketPayloadType.MessageGetChatrooms,
            data: {
                already_exist: chatRooms.map((item) => (item.id)),
            }
        }
        sendMessage(param)
    }

    const onPayloadChange = async(data) => {
        console.log("payload-type->", data?.type);
        if (data?.type === WebsocketPayloadType.MessageGetChatrooms) {
            if (data.data.mp_chatrooms && data.data.mp_chatrooms.length > 0) {
                setChatRooms(data.data.mp_chatrooms); 
                console.log("chatRooms -> ",chatRooms)
            } else {
                // setHasMore(false);
                setChatRooms(data.data.mp_chatrooms);
            }
        } 
        else if (data?.type === WebsocketPayloadType.MessageData) {
            console.log("tes", WebsocketPayloadType.MessageData);
            let param = {
                type: WebsocketPayloadType.MessageGetChatrooms,
                data: {
                    already_exist: [],
                }
            }
            sendMessage(param)
            // setChatRooms(data.data.mp_chatrooms);
        }
    }

    const sendMessage = (param) => {
        // if (!isLoggedIn) ws.current.close(); //onlogin
        // if (!isLoggedIn) {
        //     navigate(MainRouteName.LOGIN);
        //     return;
        // }
        
        if (!ws) return;
        // console.log(ws.current.readyState);
        try {
            // if (ws.current.readyState === WebSocket.OPEN) {
            if (ready) {
                ws.current.send(JSON.stringify(param));
            } else {
                setNeedRetry(true);
            }
        } catch (ex) {
            setNeedRetry(true);
            throw ex;
        }
    }

    const addNewChatroom = (user_id, user_type) => {
        let param = {
            type: WebsocketPayloadType.MessageNewChatroom,
            data: {
                user_id,
                user_type,
            }
        }
        sendMessage(param)
    }

    const onWsChange = () => {
        console.log("onws Change")
        if (firstGet) {
            setNeedRetry(true)
        } else {
            getChatrooms()
            if (chatTo) {
                addNewChatroom(chatTo.user_id, chatTo.user_type)
            }
            setFirstGet(true);
        }
    }

  return (
      <ScrollView style={{ backgroundColor: "#FFF" }}>
          <View
              style={{
                  width: WIDTH,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                  marginHorizontal: 10
              }}
          >
              <SearchNormal1
                  size="18"
                  color={colors.pasive}
                  style={{ marginRight: -25, zIndex: 99, marginLeft: 0 }}
              />
              <TextInput
                  style={{
                      borderWidth: 1,
                      borderColor: colors.line,
                      width: WIDTH * 0.97,
                      borderRadius: 30,
                      paddingVertical: 10,
                      paddingLeft: 30,
                  }}
                  placeholder="Cari pesan.."
              // onChangeText={onChangeSearch}
              // value={searchQuery} 
              />
          </View>
          {
              chatRooms?.map(
                  (chatRoom, index) => {
                    return <ChatRoomRow chatRoomData={chatRoom} key={index} />
                  }
              )
          }

      </ScrollView>
  )
}

export default Chat