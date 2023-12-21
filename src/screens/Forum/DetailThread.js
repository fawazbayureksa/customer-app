import { ActivityIndicator, Image, Text, Dimensions, TouchableOpacity, View, Alert, FlatList, Modal, Button, Pressable } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { ArrowDown2, ArchiveAdd, ArchiveMinus, Verify, Back, Danger, Hierarchy2, Like1, Shop, Trash } from 'iconsax-react-native'
import { useSelector } from 'react-redux';
import colors from '../../assets/theme/colors';
import { useNavigation } from '@react-navigation/native';
import { stylesDetail } from './styles'
import { ForumRouteName } from '../../constants/forum_route/forumRouteName';
import axiosInstance from '../../helpers/axiosInstance';
import { IMAGE_URL } from "@env"
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import convertCSS from '../../helpers/convertCSS';
import { useToast } from 'react-native-toast-notifications';
import { MainRouteName } from '../../constants/mainRouteName';
import SelectDropdown from 'react-native-select-dropdown'
import ModalAlert from './components/ModalAlert';
import WebDisplay from './components/WebDisplay';
import CustomAlert from './components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalDialog from '../Account/my_profil/helpers/ModalDialog';
import Share from 'react-native-share';
import { Origin } from '@env';



export default function DetailForum({ route }) {

    const options = [
        { value: '', label: 'Semua' },
        { value: 'new', label: 'Terbaru' },
        { value: 'popular', label: 'Popular' }
    ]

    const [loading, setLoading] = useState(false);
    const [dataDetail, setDataDetail] = useState()
    const [dataComment, setDataComment] = useState([])
    const { navigate } = useNavigation();
    const navigation = useNavigation();
    const state = useSelector(state => state);
    const WIDTH = Dimensions.get('window').width * 0.95;
    const { t } = useTranslation()
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const toast = useToast();
    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
    const userLogin = useSelector(state => state.authReducer.user);
    const [status, setStatus] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [filter, setFilter] = useState();
    const [lastPage, setLastPage] = useState();
    const [showAlert, setShowAlert] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisibleBookmark, setModalVisibleBookmark] = useState(false)
    const [modalVisibleDelBookmark, setModalVisibleDelBookmark] = useState(false)
    const [order, setOrder] = useState('')
    const [idComment, setIdComment] = useState()
    const [modalDeleteComment, setModalDeleteComment] = useState(false)

    useEffect(() => {
        getDetailThread()
        // getStatusUser()
    }, []);

    useEffect(() => {
        getCommentThread()
        const willFocusSubscription = navigation.addListener('focus', () => {
            getCommentThread()
        });
        return willFocusSubscription;
    }, [filter, order]);

    const getDetailThread = () => {
        setLoading(true)

        axiosInstance
            .get(`forum/thread/detailForumThread/${route.params.idThread}`)
            .then(res => {
                setDataDetail(res.data.data)
            }).catch(error => {
                console.error('error getDetail: ', error.response);
            }).finally(() => {
                setLoading(false);
            });
    }

    const getStatusUser = () => {
        setLoading(true);

        axiosInstance
            .get(`forum/thread/getStatusUser`)
            .then(res => {
                setStatus(res.data.data)
            }).catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const getCommentThread = () => {

        let params = {
            page: 1,
            per_page: 10,
            mp_customer_id: JSON.parse(state?.authReducer?.user)?.id,
            order: order
        }

        axiosInstance
            .get(`forum/thread/comment/${route.params.idThread}`, { params })
            .then(res => {
                setDataComment(res.data.data.data)
                setLastPage(res.data.data.last_page)
                setCurrentPage(1);
            }).catch(error => {
                console.error('error getDetail: ', error.response);
            }).finally(() => {
                setLoading(false);
            });
    }



    const onDeleteComment = async () => {
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

        const account = JSON.parse(await AsyncStorage.getItem('isAccount'))

        let data = {
            forum_thread_comment_id: idComment,
            forum_thread_id: route.params.idThread,
            user_type: account ? account : "customer", //customer / seller
        }
        axiosInstance.post(`forum/thread/comment/deleteComment`, data).then(res => {
            setModalVisible(true)
            setModalDeleteComment(false)
            getCommentThread()
        }).catch(res => {
            toast.show(res.response.data.message, {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
        })
    }


    const onLikeComment = (iditem) => {
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
            forum_thread_id: route.params.idThread,
            forum_thread_comment_id: iditem
        }
        axiosInstance.post(`forum/thread/comment/sendLikeComment`, data)
            .then(res => {
                getCommentThread()
            }).catch(res => {
                axiosInstance.post(`forum/thread/comment/unlikeComment`, data)
                    .then(res => {
                        getCommentThread()
                    }).catch(res => {
                        console.log(res.response.data.message)
                    })
            })
    }

    const onLike = (thread_id) => {
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

        axiosInstance.post(`forum/thread/sendLike`, data).then(res => {
            console.log(res.data.message)
            getDetailThread()
        }).catch(res => {
            console.log('onLike detail', res.response.data.message)
            axiosInstance.post(`forum/thread/unLike`, data).then(res => {
                console.log(res.data.message)
                getDetailThread()
            }).catch(res => {
                console.log('onLike detail', res.response.data)
            })
        })
    }

    const onDeleteBookmark = (thread_id) => {

        axiosInstance
            .delete(`forum/thread/bookmark/delete/${thread_id}`)
            .then(res => {
                setModalVisibleDelBookmark(true)
                getDetailThread()
            }).catch(res => {
                console.log('delete bookmark', res.response.data.message)
                toast.show(res.response.data.message, {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            })
    }

    const handleStatus = (thread_id) => {

        if (!isLoggedIn) {
            toast.show(t('forum:please_login'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            navigate(MainRouteName.LOGIN);
            return
        } else {
            let data = {
                forum_thread_id: thread_id,
            }

            axiosInstance.post(`forum/thread/bookmark/save`, data).then(res => {
                console.log(res.data.message);
                // toast.show(res.data.message, {
                //     placement: 'top',
                //     type: 'success',
                //     animationType: 'zoom-in',
                //     duration: 3000,
                // });
                setModalVisibleBookmark(true)
                getDetailThread();
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
    }

    const handleIsLoggedIn = () => {
        toast.show(t('forum:please_login'), {
            placement: 'top',
            type: 'danger',
            animationType: 'zoom-in',
            duration: 3000,
        });
        navigate(MainRouteName.LOGIN);
        return
    }
    const handlePagination = async () => {
        let filter = {
            page: 1,
            per_page: 10,
            mp_customer_id: JSON.parse(state?.authReducer?.user)?.id,
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
                .get(`forum/thread/comment/${route.params.idThread}`, { params })
                .then(res => {
                    const newList = dataComment.concat(res.data.data.data);
                    setDataComment(newList);
                    setCurrentPage(newPage);
                }).finally(() => setIsLoadMore(false));
        }
    };

    const renderFooter = () => {
        return (
            <>
                {isLoadMore && (
                    <ActivityIndicator
                        color={'#2C465C'}
                        size={'large'}
                        style={{ padding: 10 }}
                    />
                )}
            </>
        );
    };

    const isLoginTrue = (id_sender) => {
        const id = userLogin ? JSON.parse(userLogin).id : 0
        if (id == id_sender) {
            return true
        } else {
            return false
        }
    }

    const _renderItem = (item) => {
        return (
            <View style={[stylesDetail.cardComment, { width: WIDTH }]}>
                <View style={stylesDetail.sectionRow}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Image
                            style={stylesDetail.profil}
                            source={{
                                uri: `${IMAGE_URL}public/customer/${item?.profile_picture}`,
                            }}
                        />
                        <View style={{ marginLeft: 10 }}>
                            <View style={{ display: "flex", flexDirection: "row" }}>
                                <Text style={{ fontSize: convertCSS(themeSetting.body_typography.font_size) }}>{item?.name}</Text>
                                {/* <Verify
                                    size="20"
                                    color={themeSetting?.accent_color?.value}
                                    variant="Bold"
                                /> */}
                            </View>
                            <Text style={{ fontSize: convertCSS(themeSetting.body_typography.font_size) * 0.8, color: colors?.grey }}>{moment(new Date(item?.created_at)).fromNow()}</Text>
                        </View>
                    </View>
                    {isLoginTrue(item.user_id) &&
                        <View>
                            <TouchableOpacity onPress={() => { setModalDeleteComment(true); setIdComment(item.id) }}>
                                <Trash
                                    size="20"
                                    color={colors?.pasive}
                                    variant="Bold"
                                />
                            </TouchableOpacity>

                        </View>
                    }
                </View>
                {item?.data_quote !== null &&
                    <View style={[stylesDetail.cardQuote, { width: WIDTH * 0.95, backgroundColor: colors?.f5f5, borderRadius: 5 }]}>
                        <View style={stylesDetail.section}>
                            <Image
                                style={stylesDetail.profil}
                                source={{
                                    uri: `${IMAGE_URL}public/customer/${item?.data_quote?.profile_picture}`,
                                }}
                            />
                            <View style={{ marginLeft: 10 }}>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <Text style={{ fontSize: convertCSS(themeSetting.body_typography.font_size) }}>{item?.data_quote?.name}</Text>
                                    {/* <Verify
                                        size="20"
                                        color={themeSetting?.accent_color?.value}
                                        variant="Bold"
                                    /> */}
                                </View>
                                <Text style={{ fontSize: convertCSS(themeSetting.body_typography.font_size) * 0.8, color: "gray" }}>{moment(new Date(item?.data_quote?.created_at)).fromNow()}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 10, width: WIDTH * 0.9 }}>
                            <WebDisplay
                                html={item?.data_quote?.content}
                            />
                        </View>
                    </View>
                }
                {(item?.data_quote === null && item?.quote_id != 0) &&
                    (
                        <View style={[stylesDetail.cardQuote, { width: WIDTH * 0.9, backgroundColor: colors?.f5f5, borderRadius: 5 }]}>
                            <Text style={{ fontStyle: "italic" }}>
                                {t('forum:comment_deleted')}
                            </Text>
                        </View>
                    )
                }
                <View style={{ maxWidth: WIDTH }} >

                    <WebDisplay
                        html={item?.content}
                    />
                </View>
                <View style={[stylesDetail.sectionRow, {}]}>
                    <TouchableOpacity onPress={() => onLikeComment(item.id)}>
                        <View style={stylesDetail.row}>
                            <Like1
                                size="18"
                                color={item?.is_like == true ? themeSetting?.accent_color?.value : colors?.pasive}
                                variant="Bold"
                            />
                            <Text style={{ marginLeft: 10, color: "#333" }}>{item?.total_like}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={stylesDetail.row}>
                        {isLoggedIn == true ?
                            <>
                                <Back
                                    size="18"
                                    color={colors?.pasive}

                                />
                                <TouchableOpacity
                                    style={{ marginRight: 15 }}
                                    onPress={() => navigate(ForumRouteName.REPLY_THREAD, {
                                        coment_id: item?.id,
                                        thread_id: route.params.idThread,
                                        name: item?.name,
                                        content: item?.content,
                                        picture: item?.profile_picture,
                                        created_at: item?.created_at
                                    })}
                                >
                                    <Text style={{ marginLeft: 5, color: "#333" }}>{t('forum:forum_reply')}</Text>
                                </TouchableOpacity>
                            </>
                            :
                            <>
                                <Back
                                    size="18"
                                    color={colors?.pasive}

                                />
                                <TouchableOpacity
                                    style={{ marginRight: 15 }}
                                    onPress={() => handleIsLoggedIn()}
                                >
                                    <Text style={{ marginLeft: 5, color: "#333" }}>{t('forum:forum_reply')}</Text>
                                </TouchableOpacity>
                            </>
                        }
                        {!isLoginTrue(item?.user_id) &&
                            <>
                                <Danger
                                    size="16"
                                    color={colors?.pasive}
                                    variant="Bold"
                                />
                                {isLoggedIn ?
                                    <TouchableOpacity
                                        style={{ marginLeft: 10 }}
                                        onPress={() => navigate(ForumRouteName.REPORT_COMMENT, {
                                            coment_id: item?.id,
                                            thread_id: route.params.idThread
                                        })}>
                                        <Text style={{ color: "#333" }}>{t('forum:report')}</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={{ marginLeft: 10 }}
                                        onPress={() => navigate(MainRouteName.LOGIN)}>
                                        <Text style={{ color: "#333" }}>{t('forum:report')}</Text>
                                    </TouchableOpacity>
                                }
                            </>
                        }
                    </View>
                </View>
                <ModalDialog
                    showModal={modalDeleteComment}
                    setShowModal={() => setModalDeleteComment(false)}
                    content={
                        <View >
                            <Text style={{ fontSize: 16, fontWeight: "600", color: "black", marginTop: 10 }}>
                                Yakin hapus komentar ini ?
                            </Text>
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                marginTop: 30,
                                height: 30,
                            }}>
                                <TouchableOpacity
                                    style={{
                                        width: "40%",
                                        backgroundColor: "#FFF",
                                        borderColor: "#DCDCDC",
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                    onPress={() => setModalDeleteComment(false)}
                                >
                                    <Text style={{ fontSize: 14, fontWeight: "700" }}>
                                        No
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        width: "40%",
                                        backgroundColor: themeSetting?.accent_color?.value,
                                        borderRadius: 10,
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                    onPress={onDeleteComment}
                                >
                                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    header=''
                />
            </View>
        )
    }

    const openShare = async () => {
        try {
            const result = await Share.open({
                url: `${Origin}forum/detail-thread/${route.params.idThread}`
            })
        } catch (error) {
            console.log('error copy', error)
        }
    }

    const headerComp = () => {
        return (
            <View>
                <View style={[stylesDetail.container]}>
                    <View style={[stylesDetail.card, { marginTop: 10, width: WIDTH }]}>
                        <View style={stylesDetail.sectionRow}>
                            <TouchableOpacity onPress={() => navigate(ForumRouteName.PROFILE, {
                                id: dataDetail.user_id
                            })}>
                                <View style={{ alignSelf: "center", flexDirection: "row" }}>
                                    {dataDetail?.user_type === "seller" ?
                                        <Image
                                            style={stylesDetail.profil}
                                            source={{
                                                uri: `${IMAGE_URL}public/seller/${dataDetail.picture}`,
                                            }}
                                        />
                                        :
                                        <Image
                                            style={stylesDetail.profil}
                                            source={{
                                                uri: `${IMAGE_URL}public/customer/${dataDetail.picture}`,
                                            }}
                                        />
                                    }
                                    <View style={{ marginLeft: 10 }}>
                                        <View style={{ display: "flex", flexDirection: "row" }}>
                                            <Text style={{ fontSize: convertCSS(themeSetting.body_typography.font_size) }}>{dataDetail?.name}</Text>
                                            {/* <Verify
                                            size="20"
                                            color={themeSetting?.accent_color?.value}
                                            variant="Bold"

                                        /> */}
                                        </View>
                                        <Text style={{ fontSize: convertCSS(themeSetting.body_typography.font_size) * 0.8, color: "gray" }}>{moment(new Date(dataDetail?.created_at)).fromNow()}</Text>
                                    </View>
                                    {dataDetail?.user_type === "seller" &&
                                        <View style={{ marginLeft: -15, backgroundColor: themeSetting?.accent_color?.value, borderRadius: 5, height: 20, flexDirection: "row", paddingHorizontal: 10, alignItems: "center" }}>
                                            <Shop
                                                size={"14"}
                                                color={themeSetting?.accent_color?.text}
                                            />
                                            <Text style={{ color: themeSetting?.accent_color?.text, fontSize: 12 }} > Seller</Text>
                                        </View>
                                    }
                                </View>
                            </TouchableOpacity>
                            <View>
                                {dataDetail?.is_bookmark == false ?
                                    <TouchableOpacity onPress={() => handleStatus(dataDetail?.id)}>
                                        <ArchiveAdd
                                            size="22"
                                            variant="Bold"
                                            color={colors?.pasive}
                                        />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => onDeleteBookmark(dataDetail?.id)}>
                                        <ArchiveMinus
                                            size="22"
                                            color={themeSetting?.accent_color?.value}
                                            variant="Bold"
                                        />
                                    </TouchableOpacity>
                                }
                            </View>

                        </View>
                        <Text
                            style={{
                                fontSize: convertCSS(themeSetting.h5_typography.font_size),
                                fontWeight: "600",
                                marginVertical: 10,
                                fontFamily: convertCSS(themeSetting.h5_typography.font_family)
                            }}
                        >
                            {dataDetail?.title}
                        </Text>
                        <View style={{ width: WIDTH * 0.9, marginLeft: 10 }}>
                            <WebDisplay
                                html={dataDetail?.content}
                            />
                        </View>
                        <View style={[stylesDetail.containerCategory, { width: WIDTH * 0.9, marginTop: 20 }]}>
                            {dataDetail?.categories.map((category) => (
                                <View style={[stylesDetail.roundedCategory]} key={category?.id}>
                                    <Text style={{ color: "gray", marginHorizontal: 5, fontSize: convertCSS(themeSetting.body_typography.font_size) * 0.8 }}>{category?.name}</Text>
                                </View>
                            ))}
                        </View >
                        <View style={stylesDetail.sectionRow}>
                            <TouchableOpacity onPress={() => onLike(dataDetail?.id)}>
                                <View style={stylesDetail.row}>
                                    <Like1
                                        size="18"
                                        color={dataDetail?.is_like == true ? themeSetting?.accent_color?.value : colors?.pasive}
                                        variant="Bold"
                                    />
                                    <Text style={{ marginLeft: 10, color: "#333" }}>
                                        {dataDetail?.total_like}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={stylesDetail.row}>
                                <TouchableOpacity onPress={openShare} style={[stylesDetail.row, { marginHorizontal: 10 }]}>
                                    <Hierarchy2
                                        size="16"
                                        color={colors?.pasive}
                                        variant="Bold"
                                    />
                                    <Text style={{ marginHorizontal: 5, color: "#333" }}>{t('forum:share')}</Text>
                                </TouchableOpacity>
                                <View style={stylesDetail.row}>
                                    {!isLoginTrue(dataDetail?.user_id) && <>
                                        <Danger
                                            size="16"
                                            color={colors?.pasive}
                                            variant="Bold"
                                        />
                                        {isLoggedIn ?
                                            <TouchableOpacity onPress={() => navigate(ForumRouteName.REPORT_THREAD, {
                                                idThread: dataDetail?.id
                                            })}>
                                                <Text style={{ marginLeft: 5, color: "#333" }}>{t('forum:report')}</Text>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity onPress={() => navigate(MainRouteName.LOGIN)}>
                                                <Text style={{ marginLeft: 5, color: "#333" }}>{t('forum:report')}</Text>
                                            </TouchableOpacity>
                                        }
                                    </>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[stylesDetail.row, { marginHorizontal: 10, marginVertical: 10 }]}>
                    <View>
                        <SelectDropdown
                            data={options}
                            onSelect={(selectedItem, index) => {
                                setOrder(selectedItem.value)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem.label
                            }}
                            rowTextForSelection={(item, index) => {
                                return item?.label
                            }}
                            buttonStyle={{
                                backgroundColor: colors?.white,
                                borderWidth: 1,
                                borderColor: colors?.line,
                                borderRadius: 10,
                                width: WIDTH * 0.5,
                                textAlign: "left",
                                height: 44,
                                fontSize: 14
                            }}
                            rowTextStyle={{
                                fontSize: 14,
                                textAlign: "left"
                            }}
                            renderDropdownIcon={() => (
                                <ArrowDown2
                                    size="22"
                                    color="#000"
                                />
                            )}
                            defaultValueByIndex={0}
                        />
                    </View>
                    <View style={{ width: WIDTH * 0.48, marginHorizontal: 10, height: 50, marginTop: -10 }}>
                        {isLoggedIn == true ?
                            <TouchableOpacity
                                style={[stylesDetail.button, {
                                    backgroundColor:
                                        status?.status === "blocked" ? colors?.pasive
                                            :
                                            themeSetting?.accent_color?.value,
                                }]}
                                onPress={() => navigate(ForumRouteName.CREATE_COMMENT, {
                                    idThread: dataDetail?.id,
                                })}
                            >
                                <Text style={{ color: colors?.white, fontWeight: "600", fontSize: 14 }}>
                                    {t('forum:leave_comment')}
                                </Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={[stylesDetail.button, { backgroundColor: themeSetting?.accent_color?.value }]}
                                onPress={() => handleIsLoggedIn()}
                            >
                                <Text style={{ color: colors?.white, fontWeight: "600", fontSize: 14 }}>
                                    {t('forum:leave_comment')}
                                </Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                {status?.status === "blocked" &&
                    <View
                        style={{
                            backgroundColor: 'rgba(248, 29, 29, 0.08)',
                            width: WIDTH,
                            marginHorizontal: 10,
                            padding: 10,
                            borderRadius: 5,
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Danger
                            size="32"
                            color="#F81D1D"
                            variant="Bold"
                        />
                        <Text style={{}}>
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
            </View>
        )
    }


    return (
        <>
            {!dataDetail ?
                (
                    <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
                        <ActivityIndicator
                            color={themeSetting?.accent_color?.value}
                            size={'large'}
                            style={{ padding: 10 }}
                        />
                    </View>
                ) :
                <View style={{ backgroundColor: "#FFFFFF" }}>
                    <FlatList
                        nestedScrollEnabled={true}
                        data={dataComment}
                        renderItem={({ item }) => _renderItem(item)}
                        keyExtractor={({ item }) => item?.id}
                        onEndReachedThreshold={0.2}
                        ListEmptyComponent={() => (
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                                <Image source={require('../../assets/images/empty_folder.png')} />
                                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                                    {t('forum:no_comments')}
                                </Text>
                                <Text style={{ color: colors?.grey }}>
                                    Semua komentar akan tampil disini
                                </Text>
                            </View>
                        )}
                        onEndReached={() => handlePagination()}
                        ListFooterComponent={renderFooter}
                        ListHeaderComponent={headerComp}
                    />
                    <CustomAlert
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        message={'Berhasil hapus komentar'}
                    />
                    <CustomAlert
                        modalVisible={modalVisibleBookmark}
                        setModalVisible={setModalVisibleBookmark}
                        message={'Berhasil Simpan di Bookmark'}
                    />
                    <CustomAlert
                        modalVisible={modalVisibleDelBookmark}
                        setModalVisible={setModalVisibleDelBookmark}
                        message={'Berhasil Hapus Bookmark'}
                    />
                </View>
            }
        </>

    )
}

