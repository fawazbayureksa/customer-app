import {
    Button,
    Image,
    ScrollView,
    Dimensions,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    FlatList
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Category, Danger, Edit, Eye, Like1, Menu, MessageText, Shop, TickCircle, Trash, Verify } from 'iconsax-react-native'
import { useSelector } from 'react-redux';
import colors from '../../assets/theme/colors';
import { useNavigation } from '@react-navigation/native';
import { styles, stylesDetail } from './styles'
import { ForumRouteName } from '../../constants/forum_route/forumRouteName'
import axiosInstance from '../../helpers/axiosInstance';
import { IMAGE_URL } from "@env"
import Modal from 'react-native-modal';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import convertCSS from '../../helpers/convertCSS';
import { useToast } from 'react-native-toast-notifications';
import { MainRouteName } from '../../constants/mainRouteName';
import TabCategory from './components/TabCategory';
import Truncate from './components/Truncate';
import WebDisplay from './components/WebDisplay';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ForumMaster from './components/ForumMaster';
import { xorBy } from 'lodash';

export default function ForumList({ category_id }) {
    const WIDTH = Dimensions.get('window').width * 0.95;
    const { navigate } = useNavigation();
    const navigation = useNavigation();
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const toast = useToast();
    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [status, setStatus] = useState();
    const [datas, setData] = useState([])
    const [isModalVisible, setModalVisible] = useState(false);
    const [id, setId] = useState()
    const { t } = useTranslation()
    const state = useSelector(state => state);
    const [catgeoryList, setCategoryList] = useState([]);
    const [selectedTab, setSelectedTab] = useState("Semua");
    const [idCategory, setIdCategory] = useState();
    const [dataMaster, setDataMaster] = useState([]);

    useEffect(() => {
        getForumThread();
        const willFocusSubscription = navigation.addListener('focus', () => {
            getForumThread();
        });
        return willFocusSubscription;

    }, [category_id, selectedTab, idCategory]);



    useEffect(() => {
        getcategoriesForum();
    }, [category_id]);

    // useEffect(() => {
    //     getStatusUser();
    // }, []);

    useEffect(() => {
        getDataMaster();
    }, []);

    // console.log(category_id)

    const getDataMaster = () => {
        axiosInstance
            .get('forum/master/get')
            .then(res => {
                setDataMaster(res.data.data)
                // // console.log(res.data.data)
            }).catch(error => {
                console.error('error getCategory: ', error.response);
            })
    }

    const getcategoriesForum = () => {
        let category = []
        axiosInstance
            .get('forum/categories/get')
            .then(res => {
                let response = res.data.data;
                if (!category_id) {
                    category =
                        res.data.data.map((item) => (
                            item.parent_id !== null && {
                                name: item.name,
                                id: item.id
                            }
                        ))
                    setCategoryList(category.filter(x => !!x))
                } else {
                    let x = response.filter((item) => item.parent_id === parseInt(category_id))
                    setCategoryList(x)
                }
            }).catch(error => {
                console.error('error getCategory: ', error.response);
            })
    }

    const getForumThread = () => {
        setLoading(true);
        let params = {
            page: 1,
            per_page: 10,
            search: "",
            category_id: idCategory ? idCategory : category_id
        }
        axiosInstance
            .get(`forum/thread/get`, { params })
            .then(res => {
                setData(res.data.data.data)
                setLastPage(res.data.data.last_page)
                setCurrentPage(1);
            }).catch(error => {
                console.error('get forumn', error.response.data.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    const getStatusUser = () => {
        setLoading(true);

        axiosInstance
            .get(`forum/thread/getStatusUser`)
            .then(res => {
                setStatus(res.data.data)
            }).catch(error => {
                console.error('get status', error.response.data.message);
            })
            .finally(() => {
                setLoading(false);
            })
    }
    const onChangeTab = (item, id) => {
        setSelectedTab(item)
        setIdCategory(id)
    }

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
                console.log('to detail', res.response.data.message)
            })
    }

    const onLike = (thread_id, index) => {
        if (isLoggedIn == false) {
            toast.show(t('forum:please_login'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            navigate(MainRouteName.LOGIN);
            return
        }
        let data = {
            forum_thread_id: thread_id
        }
        axiosInstance
            .post(`forum/thread/sendLike`, data)
            .then(res => {
                console.log(res.data.message)
                // getForumThread()
                let x = [...datas]
                x[index].is_like = true
                x[index].total_like = x[index].total_like + 1
                setData(x)
            }).catch(res => {
                console.log(res.response.data.message)
            })
    }

    const unLike = (thread_id, index) => {
        if (isLoggedIn == false) {
            toast.show(t('forum:please_login'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            navigate(MainRouteName.LOGIN);
            return
        }
        let data = {
            forum_thread_id: thread_id
        }
        axiosInstance.post(`forum/thread/unLike`, data)
            .then(res => {
                console.log(res.data.message)
                // getForumThread()
                let x = [...datas]
                x[index].is_like = false
                x[index].total_like = x[index].total_like - 1
                setData(x)
            }).catch(res => {
                console.log(res)
            })
    }

    const toggleModal = (thread_id) => {
        if (isLoggedIn == false) {
            toast.show(t('forum:please_login'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            navigate(MainRouteName.LOGIN);
        }
        setId(thread_id)
        setModalVisible(!isModalVisible);
    };

    const changeStatus = (thread_id) => {
        if (isLoggedIn == false) {
            toast.show(t('forum:please_login'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            navigate(MainRouteName.LOGIN);
        }
        let data = {
            forum_thread_id: thread_id,
        }

        axiosInstance.post(`forum/thread/bookmark/save`, data).then(res => {
            console.log(res.data.message);
            toast.show(res.data.message, {
                placement: 'top',
                type: 'success',
                animationType: 'zoom-in',
                duration: 3000,
            });
            setModalVisible(false)
            setId()
            getForumThread()
        }).catch(res => {
            console.log(res.response.data.message);
            toast.show(res.response.data.message, {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
        })
    }



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
        }
    }

    const handlePagination = async () => {

        let filter = {
            page: 1,
            per_page: 10,
            search: "",
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
                .get(`forum/thread/get`, { params })
                .then(res => {
                    const newList = datas.concat(res.data.data.data);
                    setData(newList);
                    setCurrentPage(newPage);
                }).finally(() => setIsLoadMore(false));
        }
    };



    const _renderItem = (item, index) => {
        return (
            <View style={[styles.card, { width: WIDTH }]} key={item.id}>
                <View style={styles.sectionRow}>
                    <TouchableOpacity onPress={() => navigate(ForumRouteName.PROFILE, {
                        id: item.user_id
                    })}>
                        <View style={{ flexDirection: "row" }}>
                            {item?.user_type === "seller" ?
                                <Image
                                    style={styles.profil}
                                    source={{
                                        uri: `${IMAGE_URL}public/seller/${item.picture}`,
                                    }}
                                />
                                :
                                <Image
                                    style={styles.profil}
                                    source={{
                                        uri: `${IMAGE_URL}public/customer/${item.picture}`,
                                    }}
                                />
                            }
                            <View style={{ marginLeft: 10 }}>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <Text style={{ fontSize: convertCSS(themeSetting.body_typography.font_size) }}>{item?.name}</Text>
                                    {/* <Verify
                                        size="20"
                                        color={themeSetting?.accent_color?.value}
                                        variant="Bold"

                                    /> */}
                                </View>
                                <Text style={{ fontSize: convertCSS(themeSetting.body_typography.font_size) * 0.8, color: "gray" }}>{moment(new Date(item?.created_at)).fromNow()}</Text>
                            </View>
                            {item?.user_type === "seller" &&
                                <View style={{ marginLeft: -15, backgroundColor: themeSetting?.accent_color?.value, borderRadius: 5, height: 20, flexDirection: "row", paddingHorizontal: 10, alignItems: "center" }}>
                                    <Shop
                                        size={"14"}
                                        color={themeSetting?.accent_color?.text}
                                    />
                                    <Text style={{ color: themeSetting?.accent_color?.text, fontSize: 12 }} > Seller</Text>
                                </View>
                            }
                        </View>
                        {/* </TouchableOpacity>
                        <TouchableOpacity onPress={() => onDeleteThread(item.id)}>
                        <Trash
                        size="22"
                        color={colors?.pasive}
                        variant="Bold"
                        />
                        </TouchableOpacity> */}

                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => toDetailThread(item.id)}>
                    <Text style={{
                        fontSize: convertCSS(themeSetting.h5_typography.font_size),
                        fontWeight: "600",
                        marginTop: 10,
                        fontFamily: convertCSS(themeSetting.h5_typography.font_family)

                    }}>
                        {item.title}
                    </Text>
                    <View>
                        <WebDisplay
                            html={`<p>${Truncate(item?.content)}</p>`}
                        />
                    </View>
                    <View style={[stylesDetail.containerCategory, { width: WIDTH * 0.9, marginTop: 0 }]}>
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
                        {item?.is_like === true ?
                            <TouchableOpacity onPress={() => unLike(item?.id, index)}>
                                <View style={styles.row}>
                                    <Like1
                                        size="20"
                                        color={themeSetting?.accent_color?.value}
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
                            :
                            <TouchableOpacity onPress={() => onLike(item?.id, index)}>
                                <View style={styles.row}>
                                    <Like1
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
                                    >{item?.total_like}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        }
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
                        <View style={styles.row}>
                            <Icon
                                name='more-vert'
                                onPress={() => toggleModal(item.id)}
                                size={18}
                                color={colors?.pasive}
                            />
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
                        color={themeSetting?.accent_color?.value}
                        size={'large'}
                        style={{ padding: 10 }}
                    />
                )}
            </>
        );
    };

    return (
        <>
            {loading ?
                <View>
                    <ActivityIndicator
                        color={themeSetting?.accent_color?.value}
                        size={'small'}
                        style={{ padding: 10 }}
                    />
                </View>
                :
                <ScrollView style={{ backgroundColor: "#FFF" }}>
                    <TabCategory
                        selectedTab={selectedTab}
                        catgeoryList={catgeoryList}
                        onChangeTab={onChangeTab}

                    />
                    {status?.status === "blocked" &&
                        <View
                            style={{
                                backgroundColor: 'rgba(248, 29, 29, 0.08)',
                                width: WIDTH,
                                marginHorizontal: 10,
                                padding: 10,
                                borderRadius: 5,
                                flex: 1,
                                alignItems: "center",
                            }}
                        >
                            <Danger
                                size="32"
                                color="#F81D1D"
                                variant="Bold"
                            />

                            <Text style={{ textAlign: "justify" }}>
                                Maaf, Sesuai dengan Kebijakan yang berlaku, akun Anda dibekukan sampai tanggal {moment(new Date(status?.until)).format('LL')}. Anda tidak dapat melakukan aktivitas apapun di Tokodapur Forum sampai waktu pembekuan selesai.
                                <Text style={{
                                    color: themeSetting?.accent_color?.value,
                                    fontWeight: "bold"
                                }}>
                                    Pelajari lebih lanjut.
                                </Text>
                            </Text>
                        </View>
                    }
                    <ForumMaster
                        data={dataMaster}
                        theme={themeSetting}
                        width={WIDTH}
                    />
                    <FlatList
                        nestedScrollEnabled={true}
                        data={datas}
                        renderItem={({ item, index }) => _renderItem(item, index)}
                        keyExtractor={({ item }) => item?.id}
                        onEndReachedThreshold={0.2}
                        onEndReached={() => handlePagination()}
                        ListFooterComponent={renderFooter}
                        ListEmptyComponent={() => (
                            <View style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                marginHorizontal: 20,
                                marginVertical: 10
                            }}>
                                <Image source={require('../../assets/images/empty_folder.png')} />
                                <Text
                                    style={{ fontSize: 20, fontWeight: "bold" }}
                                >Belum Ada Thread</Text>
                            </View>
                        )}
                    />
                </ScrollView>
            }
            <Modal
                isVisible={isModalVisible}
                style={{
                    justifyContent: "center",
                    alignItems: "center",

                }}
                onBackdropPress={() => setModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    maxHeight: 100
                }}>
                    <TouchableOpacity
                        onPress={() => navigate(ForumRouteName.REPORT_THREAD, {
                            idThread: id
                        })}
                        style={{
                            padding: 10,
                            height: 50,
                            height: 50,
                            width: WIDTH
                        }}
                    >
                        <Text style={{ textAlign: "center" }}>{t('forum:report')}</Text>
                    </TouchableOpacity>
                    <View style={{ borderWidth: 0.5, width: WIDTH, borderColor: colors?.line }} />
                    <TouchableOpacity
                        onPress={() => changeStatus(id)}
                        style={{ padding: 10, height: 50, width: WIDTH }}
                    >
                        <Text style={{ textAlign: "center" }}>{t('forum:save')}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

        </>
    )
}

