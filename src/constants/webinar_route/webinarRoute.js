import { Webinar } from '../../screens';
import Dashboard from '../../screens/Webinar/Dashboard';
import EventList from '../../screens/Webinar/EventList';
import SpeakerDetail from '../../screens/Webinar/details/SpeakerDetail';
import SpeakerList from '../../screens/Webinar/SpeakerList';
import EventDetail from '../../screens/Webinar/details/EventDetail';
import BuyTicket from '../../screens/Webinar/transaction/BuyTicket';
import CheckoutWebinar from '../../screens/Webinar/transaction/CheckoutWebinar';
import WebinarWaitingPayment from '../../screens/Webinar/transaction/WebinarWaitingPayment';
import TicketList from '../../screens/Webinar/TicketList';
import TicketDetail from '../../screens/Webinar/details/TicketDetail';
import WebinarReview from '../../screens/Webinar/details/WebinarReview';
import SpeakerListReview from '../../screens/Webinar/details/SpeakerListReview';
import SearchEvent from '../../screens/Webinar/search/SearchEvent';
import SearchEventResult from '../../screens/Webinar/search/SearchEventResult';

import { useSelector } from 'react-redux';
import { WebinarRouteName } from './webinarRouteName';
import { MainRouteName } from '../mainRouteName';
import React from 'react'
import { View, Text } from 'react-native'
import { Ticket, ArrowLeft2, SearchNormal1, Trash } from 'iconsax-react-native'
import { useNavigation } from '@react-navigation/native';


const ArchiveButton = () => {
    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
    const { navigate } = useNavigation();

    return (
        <Ticket
            size="24"
            color="#000"
            onPress={() => {
                if (isLoggedIn) {
                    navigate(WebinarRouteName.WEBINAR_TICKET_LIST);
                } else {
                    navigate(MainRouteName.LOGIN);
                }
            }}
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
            style={{ marginRight: 10 }}
        />
    );
}

const SearchButton = () => {
    const { navigate } = useNavigation();
    return (
        <SearchNormal1
            size="24"
            color="#000"
            onPress={() => {
                navigate(WebinarRouteName.WEBINAR_SEARCH_EVENT);
            }}
            style={{ marginRight: 10, marginLeft: 10 }}
        />
    );
}

const WebinarRoute = [
    {
        path: WebinarRouteName.WEBINAR_DASHBOARD,
        component: Dashboard,
        headerShown: true,
        title: "",
        headerRight: () => (
            <>
                <ArchiveButton />
                <SearchButton />
            </>
        ),
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: WebinarRouteName.WEBINAR_EVENT_LIST,
        component: EventList,
        headerShown: true,
        title: "Event List",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: WebinarRouteName.WEBINAR_EVENT_DETAIL,
        component: EventDetail,
        headerShown: true,
        title: "Event Info",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: WebinarRouteName.WEBINAR_SPEAKER_LIST,
        component: SpeakerList,
        headerShown: true,
        title: "Speaker List",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: WebinarRouteName.WEBINAR_SPEAKER_DETAIL,
        component: SpeakerDetail,
        headerShown: true,
        title: "Detail Speaker",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: WebinarRouteName.WEBINAR_BUY_TICKET,
        component: BuyTicket,
        headerShown: true,
        title: "Masukan Jumlah Tiket",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: WebinarRouteName.WEBINAR_CHECKOUT,
        component: CheckoutWebinar,
        headerShown: true,
        title: "Pilih Metode Pembayaran",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: WebinarRouteName.WEBINAR_WAITING_PAYMENT,
        component: WebinarWaitingPayment,
        headerShown: true,
        title: "Menunggu Pembayaran",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: WebinarRouteName.WEBINAR_TICKET_LIST,
        component: TicketList,
        headerShown: true,
        title: "E-Ticket",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: WebinarRouteName.WEBINAR_TICKET_DETAIL,
        component: TicketDetail,
        headerShown: true,
        title: "E-Ticket",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: WebinarRouteName.WEBINAR_REVIEW,
        component: WebinarReview,
        headerShown: true,
        title: "Berikan Ulasan",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: WebinarRouteName.WEBINAR_SPEAKER_LIST_REVIEW,
        component: SpeakerListReview,
        headerShown: true,
        title: "Ulasan",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: WebinarRouteName.WEBINAR_SEARCH_EVENT,
        component: SearchEvent,
        headerShown: false,
        title: "Cari Event",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: WebinarRouteName.WEBINAR_SEARCH_EVENT_RESULT,
        component: SearchEventResult,
        headerShown: true,
        title: "Search Result",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
];

export default WebinarRoute;
