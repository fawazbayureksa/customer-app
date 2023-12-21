import { ForumScreen, DetailThread, ResultSearch, CreateThread, ReplyThread, ReportThread, CreateComment, EditThread, MyForum, ReportComment, Bookmark, SearchBar, Profil, MyLiked } from '../../screens';
import { ForumRouteName } from './forumRouteName';
import React from 'react'
import { View, Text } from 'react-native'
import { Archive, ArrowLeft2, Heart, SearchNormal1 } from 'iconsax-react-native'
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import { MainRouteName } from '../mainRouteName';
import { useTranslation } from 'react-i18next';

const ArchiveButton = () => {
    const { navigate } = useNavigation();
    const toast = useToast();
    const { t } = useTranslation()
    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);

    const handleIsLoggedIn = () => {
        if (isLoggedIn == true) {
            navigate(ForumRouteName.MY_BOOKMARK)
        } else {
            toast.show(t('forum:please_login'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            navigate(MainRouteName.LOGIN);
        }
    }

    return (
        <Archive
            size="24"
            color="#000"
            onPress={() => handleIsLoggedIn()}
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
const SearchButton = () => {
    const { navigate } = useNavigation();


    return (
        <SearchNormal1
            size="22"
            color="#000"
            onPress={() => navigate(ForumRouteName.SEARCH_THREAD)}
            style={{ marginRight: 10 }}
        />
    );
}
const LikedButton = () => {

    const { navigate } = useNavigation();
    const toast = useToast();
    const { t } = useTranslation()
    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);

    const handleIsLoggedIn = () => {
        if (isLoggedIn == true) {
            navigate(ForumRouteName.MY_LIKED)
        } else {
            toast.show(t('forum:please_login'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            navigate(MainRouteName.LOGIN);
        }
    }


    return (
        <Heart
            size="22"
            color="#000"
            onPress={handleIsLoggedIn}
            style={{ marginRight: 10 }}
        />
    );
}



const ForumRoute = [
    {
        path: ForumRouteName.FORUMLIST,
        component: ForumScreen,
        headerShown: true,
        title: "Forum",
        headerRight: () => (
            <>
                <LikedButton />
                <SearchButton />
                <ArchiveButton />
            </>
        ),
        headerLeft: () => (
            <>
                <ArrowBackButton />
            </>
        )
    },
    {
        path: ForumRouteName.MY_FORUM,
        component: MyForum,
        headerShown: true,
        title: 'Forum',
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: ForumRouteName.MY_BOOKMARK,
        component: Bookmark,
        headerShown: true,
        title: 'Bookmarks',
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: ForumRouteName.DETAIL_THREAD,
        component: DetailThread,
        headerShown: true,
        title: "Details",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: ForumRouteName.CREATE_THREAD,
        component: CreateThread,
        headerShown: true,
        title: "Buat Thread",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: ForumRouteName.EDIT_THREAD,
        component: EditThread,
        headerShown: true,
        title: "Ubah Thread",
        headerLeft: () => (
            <ArrowBackButton />
        ),
    },
    {
        path: ForumRouteName.REPLY_THREAD,
        component: ReplyThread,
        headerShown: true,
        title: "Balas Komentar",
        headerLeft: () => (
            <ArrowBackButton />
        ),
    },
    {
        path: ForumRouteName.REPORT_THREAD,
        component: ReportThread,
        headerShown: true,
        title: "Laporkan Thread",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: ForumRouteName.REPORT_COMMENT,
        component: ReportComment,
        headerShown: true,
        title: "Laporkan Komentar",
        headerLeft: () => (
            <ArrowBackButton />
        ),
    },
    {
        path: ForumRouteName.CREATE_COMMENT,
        component: CreateComment,
        headerShown: true,
        title: "Berikan Komentar",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: ForumRouteName.SEARCH_THREAD,
        component: SearchBar,
        headerShown: false
    },
    {
        path: ForumRouteName.RESULT_SEARCH_THREAD,
        component: ResultSearch,
        headerShown: true,
        title: "Hasil Pencarian",
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
    {
        path: ForumRouteName.PROFILE,
        component: Profil,
        headerShown: false,
    },
    {
        path: ForumRouteName.MY_LIKED,
        component: MyLiked,
        title: "Disukai",
        headerShown: true,
        headerLeft: () => (
            <ArrowBackButton />
        )
    },
];

export default ForumRoute;
