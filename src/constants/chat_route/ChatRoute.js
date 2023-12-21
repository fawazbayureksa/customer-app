import React from 'react'
import { Archive, ArrowLeft2, Message2, SearchNormal1, Send, Trash } from 'iconsax-react-native'
import { useNavigation } from '@react-navigation/native';
import { ChatRouteName } from './ChatRouteName';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../assets/theme/colors';
import Chat from '../../screens/Chat/Chat';
import ChatMessage from '../../screens/Chat/ChatMessage';

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

const ArrowBackButton = () => {
    const navigation = useNavigation();

    return (
        <ArrowLeft2
            size="24"
            color="#000"
            onPress={() => {
                navigation.goBack();
            }}
            style={{ marginRight: 5, marginLeft: -10 }}
        />
    );
}

const ChatRoute = [
    {
        path: ChatRouteName.CHAT,
        component: Chat,
        headerShown: true,
        title: "Chat",
        headerLeft: () => (
            <ArrowBackButton />
        ),
    },
    {
        path: ChatRouteName.CHAT_MESSAGE,
        component: ChatMessage,
        headerShown: false,
        title: "Pengajuan Refund [Dalam Proses]",
        headerLeft: () => (
            <ArrowBackButton />
        ),
        headerRight: () => (
            <MenuButton />
        )
    }
]

export default ChatRoute