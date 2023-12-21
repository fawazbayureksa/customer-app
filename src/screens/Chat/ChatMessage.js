import { useNavigation } from '@react-navigation/native';
import { ArrowLeft2, ArrowRight2, Dai, VideoSquare } from 'iconsax-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, TextInput, View, StyleSheet, Linking, Text, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import colors from '../../assets/theme/colors';
import CustomButton from '../../components/CustomButton';
import moment from 'moment';
import { WebsocketContext, ChatMessageType, WebsocketPayloadType } from '../../helpers/websocket/WebsocketHelper';
import { IMAGE_URL } from "@env";
import { MarketplaceRouteName } from '../../constants/marketplace_route/marketplaceRouteName';
import convertCSS from '../../helpers/convertCSS';
import ChatBubbleMessage from './components/ChatBubbleMessage';
import {launchCamera} from 'react-native-image-picker';
import DocumentPicker, { types } from 'react-native-document-picker';
import Upload from '../../helpers/Upload';
import { useToast } from 'react-native-toast-notifications';

const ArrowBackButton = () => {
    const navigation = useNavigation();

    return (
        <ArrowLeft2
            size="28"
            color="#000"
            onPress={() => {
                navigation.goBack();
            }}
            style={{ marginRight: 2.5, marginLeft: -7.5 }}
        />
    );
}

const MenuButton = () => {

    return (
        <Icon
            name='more-vert'
            // onPress={() => toggleModal(item.id)}
            size={28}
            color={colors?.pasive}
            style={{ marginLeft: 10 }}
        />
    );
}

const ChatMessage = ({ navigation, route }) => {
    const {inputChatRoomId} = route.params;
    const {newUser} = route.params;
    const {product} = route.params;
    const [ready, send, stat, payload, ws] = useContext(WebsocketContext); // use it just like a hook
    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);

    const [inputMessage, setInputMesaage] = useState();
    const [messageData, setMessageData] = useState([]);
    const [chatUser, setChatUser] = useState();
    const [chatRoomId, setChatRoomId] = useState(inputChatRoomId);
    const [dataProduct, setDataProduct] = useState(product);
    const [dataAttachment, setDataAttachment] = useState();
    const [singleFile, setSingleFile] = useState(null);
    const [needRetry, setNeedRetry] = useState(false);
    const [loading, setLoading] = useState(false);
    const flatListRef = React.useRef();
    const { navigate } = useNavigation()
    const toast = useToast()

    const WIDTH = Dimensions.get('window').width * 0.95;
    const HEIGHT = Dimensions.get('window').height * 0.95;

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const fontSize = convertCSS(themeSetting.body_typography.font_size);

    useEffect(() => {
        if (ready) {
            if (dataProduct || newUser){
                console.log("Product",product);
                setDataProduct(product)
                getNewChatMessages();
            } else {
                // send("test message");
                // setChatRoomId(inputChatRoomId);
                getChatMessages();
            }
        } else {
            console.log("belum bisa");
        }
      }, [ready]);

    useEffect(() => {
        onPayloadChange(payload);
    }, [payload]);

    const getChatMessages = () => {
        let param = {
            type: WebsocketPayloadType.MessageGetChatroom,
            data: {
                mp_chatroom_id: chatRoomId,
            }
        }
        sendMessage(param)
    }

    const getNewChatMessages = () => {
        let param = {
            type: WebsocketPayloadType.MessageNewChatroom,
            data: {
                user_id: newUser.id,
                user_type: newUser.type
            }
        }
        sendMessage(param)
    }

    const setUnreadChat = () => {
        console.log("set unread")
        let param = {
            type: WebsocketPayloadType.MessageRead,
            data: {
                mp_chatroom_id: chatRoomId,
            }
        }
        sendMessage(param)
    }

    const onPayloadChange = async(data) => {
        console.log(data)
        if (data.type === WebsocketPayloadType.MessageGetChatroom) {
            // console.log("data chatmessages", data.data.mp_chatroom);
            setMessageData(data.data.mp_chatroom.messages)
            if (data.data.mp_chatroom.unread > 0){
                setUnreadChat();
            }
            if (data?.data?.mp_chatroom?.users[0]?.user_type === "customer"){
                setChatUser(data.data.mp_chatroom.users[1])
            } else {
                setChatUser(data.data.mp_chatroom.users[0])
            }
        } 
        else if (data.type === WebsocketPayloadType.MessageData) {
            getChatMessages();
        } else if (data.type === WebsocketPayloadType.MessageNewChatroom) {
            setChatRoomId(data.data.mp_chatroom.id)
            setMessageData(data.data.mp_chatroom.messages)
            if (data.data.mp_chatroom.unread > 0){
                setUnreadChat();
            }
            if (data?.data?.mp_chatroom?.users[0]?.user_type === "customer"){
                setChatUser(data.data.mp_chatroom.users[1])
            } else {
                setChatUser(data.data.mp_chatroom.users[0])
            }
        } else if (data.type === WebsocketPayloadType.MessageGetMore){
            let indexData = messageData.length;
            let newMessageData = messageData.concat(data.data.messages)
            setMessageData(newMessageData);
            // console.log("MessageGetMore", newMessageData);
        }
    }


    const sendChatMessage = () => {
        if (!inputMessage)
        return;

        let param = {
            type: WebsocketPayloadType.MessageData,
            data: {
                mp_chatroom_id: chatRoomId,
                message: inputMessage,
                type: 'text'
            }
        }
        // console.log("chat text", param)
        // return;
        sendMessage(param)
        setInputMesaage('');
    }

    const sendProductMessage = () => {
        if (!dataProduct)
        return;

        let param = {
            type: WebsocketPayloadType.MessageData,
            data: {
                mp_chatroom_id: chatRoomId,
                message: `${dataProduct.id}`,
                type: 'product'
            }
        }
        // console.log("param", param);
        // return;
        sendMessage(param)
        setDataProduct(null);
    }

    const sendMessage = (param) => {
        if (!isLoggedIn) ws.current.close(); //onlogin
        if (!ws) return;

        console.log("send message");
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

    const handleSendMessage = () => {
        uploadFile();
        // console.log("lanjut")
        sendChatMessage();
        sendProductMessage();
    }

    const getAttachmentFile = async() => {
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.allFiles],
            });
            setDataAttachment(res[0]);
          } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
              //If user canceled the document selection
              alert('Canceled');
            } else {
              //For Unknown Error
              alert('Unknown Error: ' + JSON.stringify(err));
              throw err;
            }
          }
    }

    const getAttachmentImageFile = async() => {
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.images],
            });
            setDataAttachment(res[0]);
          } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
              //If user canceled the document selection
              alert('Canceled');
            } else {
              //For Unknown Error
              alert('Unknown Error: ' + JSON.stringify(err));
              throw err;
            }
          }
    }

    const uploadFile = async () => {
        if (dataAttachment != null) {
            setLoading(true)
            const fileToUpload = dataAttachment;
            let data = new FormData();
            data.append('file', fileToUpload);
            let res = await fetch(
                Upload.post(`chat/uploadAttachment`, data).
                    then(response => {
                        toast.show('Upload successfully', {
                            placement: 'top',
                            type: 'success',
                            animationType: 'zoom-in',
                            duration: 3000,
                        });
                        console.log(response.data.message)
                        let param = {
                            type: WebsocketPayloadType.MessageData,
                            data: {
                                mp_chatroom_id: chatRoomId,
                                message: response.data.data,
                                type: 'attachment'
                            }
                        }
                        sendMessage(param);
                        setDataAttachment(null);
                    }).catch(error => {
                        console.log("error upload file", error);
                    })
            ).finally(
                setLoading(false)
            );
            let responseJson = await res.json();
            if (responseJson.status == 1) {
                alert('Upload Successful');

                setDataAttachment(null);
            }
        } else {
            // If no file selected the show alert
            // alert('Please Select File first');
            // return;
        }
    };

    const handlePagination = () => {
        let lastIndex = messageData.length - 1;
        
        let param = {
            type: WebsocketPayloadType.MessageGetMore,
            data: {
                mp_chatroom_id: chatRoomId,
                last_message_id: messageData[lastIndex].id
            }
        }
        // console.log("handle pagination", param);
        // return; 
        sendMessage(param)
    }
    // console.log(dataAttachment);
    let prevDate = moment(new Date()).format('DD MMMM YYYY');
    return (
        <>
            <View style={{ flexGrow: 1, padding: 10, zIndex: 1000, height: 60, borderBottomWidth: 0.5, borderColor: colors.pasive }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center"}}>
                        <ArrowBackButton />
                        {
                            (chatUser?.user_type === "company") ?
                                <>
                                    <Image
                                        source={{ uri: `${chatUser?.picture}` }}
                                        style={{ borderColor: 'grey', borderWidth: 1, height: 40, width: 40, borderRadius: 100 }}
                                    />
                                </> :
                                <>
                                    <Image
                                        source={{ uri: `${IMAGE_URL}public/seller/${chatUser?.picture}` }}
                                        style={{ borderColor: 'grey', borderWidth: 1, height: 40, width: 40, borderRadius: 100 }}
                                    />
                                </>
                        }
                        
                        <View style={{marginLeft: 5}}>
                            <Text
                                style={{ fontSize: fontSize*1.2, fontWeight: "700" }}
                            >
                                {chatUser?.name}
                            </Text>
                            <View style={{ flexDirection: "row", marginLeft: -20}}>
                                <Image style={{ backgroundColor: `${stat.color}`, borderWidth: 1, height: 13, width: 13, borderRadius: 100 }} />
                                <Text
                                    style={{ fontSize: fontSize * 0.7, marginLeft: 10 }}
                                >
                                    {stat?.name}
                                </Text>
                            </View>

                        </View>
                    </View>
                    <MenuButton />
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                nestedScrollEnabled={true}
                inverted={true}
                vertical
                data={messageData}
                // keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => { 
                    let currentDate = moment(item?.created_at).format('DD MMMM YYYY');
                    let showDate;
                    if (prevDate) {
                        if (prevDate === currentDate) {
                            showDate = false
                        } else {
                            showDate = prevDate;
                            prevDate = currentDate
                        }
                    }
                    else {
                        showDate = false;
                        prevDate = currentDate
                    }
                    return (
                        <>
                            {
                                (index === 0) ?
                                <></>:
                                <><ChatDateRender showDate={showDate} /></>
                            }
                            <ChatBubbleMessage message={item} key={index} />
                        </>
                    )
                }}
                onEndReached={() => handlePagination()}
                onEndReachedThreshold={0.2}
            // ListFooterComponent={renderFooter}
            // ListEmptyComponent={<ListEmpty />}
            />
            
            <View
                style={{
                    backgroundColor: '#fff',
                    padding: 12,
                    borderColor: 'rgba(10, 0, 0, 0.1)',
                    borderWidth: 1,
                }}>
                {
                    (dataProduct) &&
                        <>
                            <View style={{flexDirection: 'row', marginBottom: 10}}>
                                <View style={{ width: '30%' }}>
                                    <Image
                                        source={{ uri: `${IMAGE_URL}public/marketplace/products/${dataProduct.picture}` }}
                                        style={{ height: 80, width: '100%', borderRadius: 10 }}
                                    />
                                </View>
                                <View style={{ width: '60%', marginLeft: '5%' }}>
                                    <Text style={{ fontSize: fontSize * 0.9, fontWeight: "700", }}>
                                        {dataProduct.name}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => setDataProduct(null)} style={{ width: '10%' }}>
                                    <Text style={{ fontSize: fontSize * 1.2, fontWeight: "700", color: 'red' }}>
                                        x
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </> 
                }
                {
                    (dataAttachment) &&
                    <>
                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <View style={{ width: '30%' }}>
                                {
                                    (dataAttachment?.type?.substring(0, 5) === 'image') ?
                                        <>
                                            <Image
                                                source={{ uri: dataAttachment?.uri }}
                                                style={{ height: 80, width: 80, borderRadius: 10 }}
                                            />
                                        </> :
                                        <>
                                            <Icon name='insert-drive-file' size={80} color={colors.pasive} />
                                        </>
                                }
                            </View>
                            <View style={{ width: '65%', marginTop: 10 }}>
                                <Text style={{ fontSize: fontSize * 0.9, fontWeight: "700", }}>
                                    {dataAttachment.name}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setDataAttachment(null)} style={{ width: '5%' }}>
                                <Text style={{ fontSize: fontSize * 1.2, fontWeight: "700", color: 'red' }}>
                                    x
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',

                    }}>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: colors.line,
                            width: WIDTH * 0.90,
                            borderRadius: 10,
                            paddingVertical: 5,
                            paddingLeft: 10,
                            marginRight: 10
                        }}
                        placeholder="Tulis Pesan Anda"
                        onChangeText={value => (setInputMesaage(value))}
                        value={inputMessage}
                    />
                    {
                        (!loading) ?
                            <>
                                <TouchableOpacity onPress={handleSendMessage}>
                                    <Icon name='send' size={30} color={themeSetting.accent_color.value} />
                                </TouchableOpacity>
                            </> :
                            <> 
                            </>
                    }
                    
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                    {
                        (!dataAttachment) ?
                            <>
                                <TouchableOpacity
                                    onPress={getAttachmentFile}
                                >
                                    <Icon name='attach-file' size={30} color={colors.pasive} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={getAttachmentImageFile}
                                >
                                    <Icon name='photo' size={30} color={colors.pasive} />
                                </TouchableOpacity>
                                {/* <TouchableOpacity>
                                        <VideoSquare
                                            size="30"
                                            color={colors.pasive}
                                            variant="Bold"
                                        />
                                    </TouchableOpacity> */}
                            </> :
                            <>
                            </>
                    }
                    
                </View>
            </View>
        </>
    );
}

const ChatDateRender = ({ showDate }) => {
    if (showDate) {
        return (
            <View style={{ width: '100%', marginHorizontal: 10, marginVertical: 5 }}>
                <Text style={{ textAlign: "center", color: colors.textmuted }}>
                    {showDate}
                </Text>
            </View>
        )
    } else {
        return(
            <>
            </>
        )
    }
    
}

const styles = StyleSheet.create({})

export default ChatMessage