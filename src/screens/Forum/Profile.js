import { useNavigation } from '@react-navigation/native';
import { Eye, Like1, MessageText } from 'iconsax-react-native';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, ScrollView, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useSelector } from 'react-redux';
import colors from '../../assets/theme/colors';
import convertCSS from '../../helpers/convertCSS';
import { styles, stylesDetail } from './styles';
import WebView from 'react-native-webview';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import { IMAGE_URL } from "@env";
import moment from 'moment';
import axiosInstance from '../../helpers/axiosInstance';
import { ForumRouteName } from '../../constants/forum_route/forumRouteName';
import { useTranslation } from 'react-i18next';
import Truncate from './components/Truncate';
import { useToast } from 'react-native-toast-notifications';

const Profile = ({ route }) => {
    const tabName = [
        { id: '', value: 'Semua' },
        { id: 'new', value: 'Terbaru' },
        { id: 'popular', value: 'Popular' }
    ]
    const WIDTH = Dimensions.get('window').width;
    const { navigate } = useNavigation();
    const navigation = useNavigation();
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [status, setStatus] = useState();
    const [data, setData] = useState([])
    const [profil, setProfil] = useState()

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const [selectedTab, setSelectedTab] = useState(tabName[0].id);
    const { t } = useTranslation()
    const [dataFollower, setDataFollower] = useState()
    const [dataFollowing, setDataFollowing] = useState()
    const [isFollowing, setIsFollowing] = useState(false)
    useEffect(() => {
        getForumThread();
    }, [selectedTab]);

    const toast = useToast()

    useEffect(() => {
        getUser();
    }, []);


    const onFollow = () => {

        let data = {
            mp_customer_id: route.params.id,
            is_follow: !isFollowing
        }
        axiosInstance.post('ecommerce/customer/follow', data)
            .then((res) => {
                console.log(res.data);
                toast.show(res.data.message, {
                    placement: 'top',
                    type: 'success',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
                getUser()
            }).catch((err) => {
                toast.show(err.response.data.message, {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            })
    }



    const getForumThread = () => {
        setLoading(true);
        let params = {
            page: 1,
            per_page: 5,
            user_type: "customer",
            user_id: route.params.id,
            order_by: selectedTab
        }
        axiosInstance
            .get(`forum/thread/getListThreadUser`, { params })
            .then(res => {
                setData(res.data.data.data)
                setLastPage(res.data.data.last_page)
                setCurrentPage(1);
            }).catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getUser = () => {
        setLoading(true);

        axiosInstance
            .get(`ecommerce/customer/find/${route.params.id}`)
            .then(res => {
                setProfil(res.data.data.customerData)
                setIsFollowing(res.data.data.isFollowing);
                setDataFollower(res.data.data.customerFollower)
                setDataFollowing(res.data.data.customerFollowing)
            }).catch(error => {
                console.error('error get user', error.response.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }


    const onLike = (thread_id) => {
        let data = {
            forum_thread_id: thread_id
        }
        axiosInstance
            .post(`forum/thread/sendLike`, data)
            .then(res => {
                console.log(res.data.message)
                getForumThread()
            }).catch(res => {

                console.log(res.response.data.message)
                axiosInstance
                    .post(`forum/thread/unLike`, data)
                    .then(res => {
                        console.log(res.data.message)
                        getForumThread()
                    }).catch(res => {
                        console.log(res.response.data)
                    })
            })
    }

    const onChangeTab = (item) => {
        setSelectedTab(item)
    }

    const customHTMLElementModels = {
        iframe: iframeModel
    };

    const handlePagination = async () => {

        let filter = {
            page: 1,
            per_page: 5,
            user_type: "customer",
            user_id: route.params.id,
        }

        let newPage = currentPage + 1;
        if (newPage > lastPage) {
            return;
        } else if (isLoadMore) {
            return;
        } else {
            let params = {
                ...filter,
                page: newPage
            };
            setIsLoadMore(true);
            await axiosInstance
                .get(`forum/thread/getListThreadUser`, { params })
                .then(res => {
                    const newList = data.concat(res.data.data.data);
                    setData(newList);
                    setCurrentPage(newPage);
                }).finally(() => setIsLoadMore(false));
        }
    };

    const toDetailThread = (thread_id) => {
        let data = {
            forum_thread_id: thread_id
        }
        axiosInstance
            .post(`forum/thread/addCounterView`, data)
            .then(res => {
                navigate(ForumRouteName.DETAIL_THREAD, {
                    idThread: thread_id
                })
                console.log(res.data)
                getForumThread()
            }).catch(res => {
                console.log(res.response.data)
            }).finally(() => {

            })
    }

    const _renderItem = (item) => {
        return (
            <View style={[styles.card, { width: WIDTH * 0.95 }]} key={item.id}>
                <TouchableOpacity onPress={() => toDetailThread(item.id)}>
                    <Text style={{
                        fontSize: convertCSS(themeSetting.h5_typography.font_size),
                        fontWeight: "600",
                        marginVertical: 10,
                        fontFamily: convertCSS(themeSetting.h5_typography.font_family)

                    }}>
                        {item.title}
                    </Text>
                    <View style={{ maxWidth: WIDTH * 0.8 }}>
                        <RenderHTML
                            source={{ html: `<p>${Truncate(item?.content)}</p>` }}
                            contentWidth={200}
                            WebView={WebView}
                            // renderers={renderers}
                            renderersProps={{
                                img: {
                                    enableExperimentalPercentWidth: true,
                                }
                            }}
                            tagsStyles={
                                {
                                    img: {
                                        maxHeight: WIDTH * 0.4,
                                        maxWidth: WIDTH * 0.8,
                                    }
                                }
                            }
                            customHTMLElementModels={customHTMLElementModels}
                        />
                    </View>
                    <View style={[stylesDetail.containerCategory, { width: WIDTH * 0.9, marginTop: 20 }]}>
                        {item?.categories.map((category) => (
                            <View style={[stylesDetail.roundedCategory]} key={category?.id}>
                                <Text style={{
                                    marginHorizontal: 5,
                                    color: colors?.pasive,
                                    fontSize: convertCSS(themeSetting.body_typography.font_size) * 0.8
                                }}>
                                    {category?.name}
                                </Text>
                            </View>
                        ))}
                    </View >
                    <View style={styles.sectionRow}>
                        <TouchableOpacity onPress={() => onLike(item?.id)}>
                            <View style={styles.row}>
                                <Like1
                                    size="20"
                                    color={item?.is_like === true ? themeSetting?.accent_color?.value : colors?.pasive}
                                    variant="Bold"
                                />
                                <Text
                                    style={{
                                        marginLeft: 10,
                                        color: "#333",
                                        fontSize: convertCSS(themeSetting.body_typography.font_size)
                                    }}
                                >{item?.total_like}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.row}>
                            <MessageText
                                size="20"
                                variant="Bold"
                                color={colors?.pasive}
                            />
                            <Text
                                style={{
                                    marginLeft: 10,
                                    color: "#333",
                                    fontSize: convertCSS(themeSetting.body_typography.font_size)
                                }}
                            >{item?.total_comment}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Eye
                                size="20"
                                color={colors?.pasive}
                                variant="Bold"
                            />
                            <Text
                                style={{
                                    marginLeft: 10,
                                    color: "#333",
                                    fontSize: convertCSS(themeSetting.body_typography.font_size)

                                }}
                            >{item?.counter}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const renderFooter = () => {
        return (
            <>
                {isLoadMore && (
                    <ActivityIndicator
                        color={'#2C465C'}
                        size={'small'}
                        style={{ padding: 10 }}
                    />
                )}
            </>
        );
    };

    return (
        <ScrollView
            nestedScrollEnabled={true}
            style={{
                backgroundColor: colors?.white
            }}
        >
            <View style={[styles.section, { marginTop: 30, marginHorizontal: 10 }]}>

                <Image
                    source={{
                        uri: `${IMAGE_URL}public/customer/${profil?.profile_picture}`,
                    }}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50
                    }}
                />
                <View
                    style={{ marginLeft: 10 }}
                >
                    <Text
                        style={{ fontSize: convertCSS(themeSetting.h6_typography.font_size), fontWeight: "700" }}
                    >
                        {profil?.name}
                    </Text>
                    <View style={[styles.section, { marginTop: 10 }]}>
                        <Text
                            style={{ fontSize: convertCSS(themeSetting.body_typography.font_size), marginRight: 10 }}
                        >
                            {dataFollowing} following
                        </Text>
                        <Text>|</Text>
                        <Text
                            style={{ fontSize: convertCSS(themeSetting.body_typography.font_size), marginLeft: 10 }}
                        >
                            {dataFollower} followers
                        </Text>
                    </View>
                    <View style={[styles.section, { marginTop: 10 }]}>
                        <TouchableOpacity style={[styles.buttonDraft, { borderWidth: 1, borderColor: colors?.line, marginRight: 10, height: 30, backgroundColor: colors?.white }]}>
                            <Text
                                style={{ color: themeSetting?.accent_color?.value }}
                            >Hubungi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onFollow} style={[styles.buttonDraft, { height: 30, backgroundColor: themeSetting?.accent_color?.value }]}>
                            <Text
                                style={{ color: colors?.white, padding: 5 }}
                            >
                                {isFollowing ? 'Berhenti Ikuti' : 'Ikuti'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ height: 5, marginTop: 20, width: WIDTH, backgroundColor: colors?.line }} />
            <ScrollView horizontal={true}>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    marginVertical: 10,
                    marginLeft: 5
                }}>
                    {tabName.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.rounded,
                            {
                                backgroundColor: selectedTab === category.id ? themeSetting?.accent_color?.value : '#fff',
                                borderWidth: selectedTab === category.id ? 0 : 1,
                                borderColor: selectedTab === category.id ? themeSetting?.accent_color?.value : colors?.line
                            }
                            ]}>
                            <Text
                                onPress={() => onChangeTab(category.id)}
                                style={{
                                    color:
                                        selectedTab === category.id ? '#FFF' : colors?.pasive,
                                }}>
                                {category.value}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <FlatList
                nestedScrollEnabled={true}
                data={data}
                renderItem={({ item }) => _renderItem(item)}
                keyExtractor={({ item }) => item?.id}
                onEndReachedThreshold={0.2}
                onEndReached={() => handlePagination()}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={() => (
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: WIDTH / 3,
                        marginBottom: WIDTH / 3
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: "700" }}>
                            {t('forum:no_thread')}
                        </Text>
                        <Text style={{ color: colors?.grey }}>
                            Semua Thread akan tampil disini
                        </Text>
                    </View>
                )}
            />
        </ScrollView >
    );
}


export default Profile;
