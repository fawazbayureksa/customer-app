import { StyleSheet, Text, View, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import MyPost from './MyPost';
import MyDraft from './MyDraft';
import MyArchive from './MyArchive';
import { ForumRouteName } from '../../../constants/forum_route/forumRouteName';
import { styles } from '../styles';
import { Edit } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { MainRouteName } from '../../../constants/mainRouteName';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../helpers/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Template from '../../../components/Template';

export default function Index() {

    const tabName = ['Postingan Saya', 'Draft', 'Arsip'];
    const [dataDraft, setDataDraft] = useState([])
    const [dataPost, setDataPost] = useState([])
    const [selectedTab, setSelectedTab] = useState(tabName[0]);
    const toast = useToast();
    const onChangeTab = (item) => {
        setSelectedTab(item)
    }
    const { navigate } = useNavigation();
    const navigation = useNavigation();
    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);

    const handleIsLoggedIn = (to) => {
        if (isLoggedIn == true) {
            navigate(ForumRouteName.CREATE_THREAD)
        } else {
            toast.show(t('forum:please_login'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            navigate(MainRouteName.LOGIN);
            return
        }
    }
    const [loading, setLoading] = useState(false)
    const [loadingPost, setLoadingPost] = useState(false)

    useEffect(() => {
        getForumThreadDraft()
        const willFocusSubscription = navigation.addListener('focus', () => {
            getForumThreadDraft();
        });
        return willFocusSubscription;
    }, [selectedTab]);

    useEffect(() => {
        getForumThreadPost();
        const willFocusSubscription = navigation.addListener('focus', () => {
            getForumThreadPost();
        });
        return willFocusSubscription;
    }, [selectedTab]);

    const getForumThreadDraft = async () => {
        const account = JSON.parse(await AsyncStorage.getItem('isAccount'))
        setLoading(true)
        let params = {
            page: 1,
            per_page: 20,
            status: "draft",
            user_type: account
        }
        axiosInstance
            .get(`forum/thread/getListThreadSelf`, { params })
            .then(res => {
                setDataDraft(res.data.data.data)
            })
            .catch(error => {
                console.error(error);
            }).finally(() => { setLoading(false); });
    };

    const getForumThreadPost = async () => {
        const account = JSON.parse(await AsyncStorage.getItem('isAccount'))
        setLoadingPost(true)
        let params = {
            page: 1,
            per_page: 30,
            status: 'published',
            user_type: account

        }
        axiosInstance
            .get(`forum/thread/getListThreadSelf`, { params })
            .then(res => {
                setDataPost(res.data.data.data)
            })
            .catch(error => {
                console.error(error);
            }).finally(() => { setLoadingPost(false); });
    };

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    return (
        <Template scroll={false} theme={themeSetting} refresh={true} url="/MyForum">
            <ScrollView
                style={{ backgroundColor: "#fff" }}
                stickyHeaderIndices={[0]}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                <Tab
                    selectedTab={selectedTab}
                    tabName={tabName}
                    onChangeTab={onChangeTab}
                />
                {selectedTab === 'Postingan Saya' && (
                    <MyPost themeSetting={themeSetting} getThread={getForumThreadPost} data={dataPost} navigate={navigate} loading={loadingPost} />
                )}
                {selectedTab === 'Draft' && (
                    <MyDraft themeSetting={themeSetting} getThread={getForumThreadDraft} data={dataDraft} navigate={navigate} loading={loading} />
                )}
                {selectedTab === 'Arsip' && (
                    <MyArchive themeSetting={themeSetting} navigate={navigate} />
                )}
            </ScrollView>
            <TouchableOpacity
                onPress={() => handleIsLoggedIn()}
                style={[styles.floatingButton, { backgroundColor: themeSetting?.accent_color?.value }]}
            >
                <Edit
                    size="22"
                    color="#FFF"
                />
            </TouchableOpacity>

        </Template>

    );
}

const Tab = ({ tabName, onChangeTab, selectedTab }) => {
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const layout = useWindowDimensions();

    return (

        <ScrollView horizontal={true} style={{ flexDirection: "row", height: 50 }}>
            {tabName.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={index}
                        style={{
                            backgroundColor: selectedTab === item ? '#FAFAFA' : '#fff',
                            borderBottomWidth: selectedTab === item ? 2 : 0,
                            borderColor: themeSetting?.accent_color?.value,
                        }}>
                        <Text
                            onPress={() => onChangeTab(item)}
                            style={{
                                color:
                                    selectedTab === item
                                        ? themeSetting?.accent_color?.value
                                        : '#000',
                                fontWeight: selectedTab === item ? '700' : '400',
                                marginVertical: 15,
                                padding: 0,
                                width: layout.width / 3,
                                textAlign: "center",
                            }}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                );
            })
            }
        </ScrollView>

    )
}
