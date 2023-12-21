import { HelpCenterChat, HelpCenterChatMessage } from '../../screens';
import Faq from '../../screens/Drs/Faq';
import HelpCenterContact from '../../screens/Drs/HelpCenterContact';
import React from 'react'
import { Archive, ArrowLeft2, Message2, SearchNormal1, Send, Trash } from 'iconsax-react-native'
import { useNavigation } from '@react-navigation/native';
import { drsRouteName } from './drsRouteName'
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../assets/theme/colors';

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
const MessageButton = () => {
    const { navigate } = useNavigation();

    return (
        <Message2
            size="24"
            color="#FF8A65"
            variant='Bold'
            onPress={() => {
                navigate(drsRouteName.HELP_CENTER_CHAT);
            }}
            style={{ marginRight: 5, marginLeft: -10 }}
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

const DrsRoute = [
    {
        path: drsRouteName.HELP_CENTER_FAQ,
        component: Faq,
        headerShown: true,
        title: "Bantuan",
        headerLeft: () => (
            <ArrowBackButton />
        ),
        headerRight: () => (
            <MessageButton />
        )
    },
    {
        path: drsRouteName.HELP_CENTER_CHAT,
        component: HelpCenterChat,
        headerShown: true,
        title: "Pesan Bantuan",
        headerLeft: () => (
            <ArrowBackButton />
        ),
    },
    {
        path: drsRouteName.HELP_CENTER_CHAT_MESSAGE,
        component: HelpCenterChatMessage,
        headerShown: false,
        // title: "Pengajuan Refund [Dalam Proses]",
        headerLeft: () => (
            <ArrowBackButton />
        ),
        headerRight: () => (
            <MenuButton />
        )
    },
    {
        path: drsRouteName.HELP_CENTER_CONTACT,
        component: HelpCenterContact,
        headerShown: false,
        title: "Pengajuan Refund [Dalam Proses]",
        headerLeft: () => (
            <ArrowBackButton />
        ),
        headerRight: () => (
            <MenuButton />
        )
    }
];

export default DrsRoute;
