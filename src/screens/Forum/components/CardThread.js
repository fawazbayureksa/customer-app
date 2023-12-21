import { Button, Image, Dimensions, useWindowDimensions, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ArchiveMinus, Eye, Like1, Menu, MessageText, Verify } from 'iconsax-react-native'
import { useSelector } from 'react-redux';
import colors from '../../../assets/theme/colors';
import { useNavigation } from '@react-navigation/native';
import { styles } from './../styles'
import { ForumRouteName } from '../../../constants/forum_route/forumRouteName'
import axiosInstance from '../../../helpers/axiosInstance';
import { IMAGE_URL } from "@env"
import Modal from 'react-native-modal';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import convertCSS from '../../../helpers/convertCSS';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import { ActivityIndicator } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import Truncate from './Truncate';
import WebDisplay from './WebDisplay';
import CustomAlert from './CustomAlert';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const CardThread = ({ item, getForum, status, type, name }) => {
    const { width } = useWindowDimensions()
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleSearch, setModalVisibleSearch] = useState(false);
    const [modalVisibleSuccess, setModalVisibleSuccess] = useState(false);
    const [id, setId] = useState()
    const { t } = useTranslation()
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const toast = useToast()
    const toggleModal = (thread_id) => {
        setId(thread_id)
        setModalVisible(!isModalVisible);
    };
    const toggleModalSearch = (thread_id) => {
        setId(thread_id)
        setModalVisibleSearch(!isModalVisibleSearch);
    };
    const WIDTH = Dimensions.get('window').width * 0.95;

    const { navigate } = useNavigation();

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
                getForum()
            }).catch(res => {
                console.log(res.response.data)
            })
    }


    const onDeleteThread = async (thread_id) => {
        const account = JSON.parse(await AsyncStorage.getItem('isAccount'))
        let data = {
            forum_thread_id: thread_id,
            user_type: account ? account : "customer", //customer / seller
        }
        axiosInstance
            .post(`forum/thread/delete`, data).then(res => {
                console.log(res.data)
                toast.show(res.data.message, {
                    placement: 'top',
                    type: 'success',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
                getForum()
                setModalVisible(false)
            }).catch(res => {
                console.log(res.response.data)
                toast.show(res.response.data.message, {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            })
    }
    const onDeleteBookmark = (thread_id) => {
        axiosInstance
            .delete(`forum/thread/bookmark/delete/${thread_id}`)
            .then(res => {
                setModalVisibleSuccess(true)
                getForum()
            }).catch(res => {
                console.log(res.response.data)
                toast.show(res.response.data.message, {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            })
    }

    const changeStatus = (status, thread_id) => {

        let data = {
            forum_thread_id: thread_id,
            Status: status
        }
        axiosInstance.post(`forum/thread/changeStatus`, data).then(res => {
            setId()
            toast.show(res.data.message, {
                placement: 'top',
                type: 'success',
                animationType: 'zoom-in',
                duration: 3000,
            });
            setModalVisible(false)
            getForum()
        }).catch(res => {
            console.log(res.response.data.message)
            toast.show(res.response.data.message, {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
        })
    }


    const onLike = (thread_id) => {
        let data = {
            forum_thread_id: thread_id
        }
        axiosInstance
            .post(`forum/thread/sendLike`, data)
            .then(res => {
                console.log(res.data.message)
                getForum()
            }).catch(res => {

                console.log(res.response.data.message)
                axiosInstance
                    .post(`forum/thread/unLike`, data)
                    .then(res => {
                        console.log(res.data.message)
                        getForum()
                    }).catch(res => {
                        console.log(res.response.data)
                    })
            })
    }


    return (
        <>
            {item ?
                <View>
                    {type === "type_1" ?
                        <>
                            <View style={[styles.card, { width: WIDTH }]} key={item?.id}>
                                <TouchableOpacity onPress={() => toDetailThread(item?.id)}>
                                    {(status !== "bookmark" && status !== "search") &&
                                        <Text style={{ fontSize: convertCSS(themeSetting.body_typography.font_size) * 0.8, color: "gray", textAlign: "right" }}>{moment(new Date(item?.created_at)).fromNow()}</Text>
                                    }
                                    {(status == "bookmark" || status == "search") &&
                                        <View style={[styles.sectionRow]}>
                                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start" }}>
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
                                                <View style={{ marginLeft: 10, marginRight: 10 }}>
                                                    <View style={{ display: "flex", flexDirection: "row" }}>
                                                        <Text style={{ fontSize: convertCSS(themeSetting.body_typography.font_size) }}>{item?.name}</Text>
                                                        <Verify
                                                            size="20"
                                                            color="#FF8A65"
                                                            variant="Bold"
                                                        />
                                                    </View>
                                                    <Text style={{ fontSize: convertCSS(themeSetting.body_typography.font_size) * 0.8, color: "gray" }}>{moment(new Date(item?.created_at)).fromNow()}</Text>
                                                </View>
                                            </View>
                                            {name !== "liked" &&
                                                <>
                                                    {(status !== "search") &&
                                                        <TouchableOpacity onPress={() => onDeleteBookmark(item?.id)}>
                                                            <ArchiveMinus
                                                                size="20"
                                                                color={themeSetting?.accent_color?.value}
                                                                variant="Bold"
                                                            />
                                                        </TouchableOpacity>
                                                    }
                                                </>
                                            }
                                        </View>
                                    }
                                    <View style={{
                                        flex: 1,
                                        justifyContent: "space-between",
                                        flexDirection: "row",
                                    }}>
                                        <Text style={{ fontSize: convertCSS(themeSetting.h5_typography.font_size), fontWeight: "600", marginVertical: 10 }}>
                                            {item?.title}
                                        </Text>
                                    </View>
                                    <View>
                                        <WebDisplay
                                            html={`<p>${Truncate(item?.content)}</p>`}
                                        />
                                    </View>
                                    <View style={styles.sectionRow}>
                                        <TouchableOpacity onPress={() => onLike(item?.id)}>
                                            <View style={styles.row}>
                                                <Like1
                                                    size="18"
                                                    color={colors?.pasive}
                                                    variant="Bold"
                                                />
                                                <Text style={{ marginLeft: 10, color: "#333" }}>{item?.total_like}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.row}>
                                            <MessageText
                                                size="18"
                                                variant="Bold"
                                                color={colors?.pasive}
                                            />
                                            <Text style={{ marginLeft: 10, color: "#333" }}>{item?.total_comment}</Text>
                                        </View>
                                        <View style={styles.row}>
                                            <Eye
                                                size="18"
                                                color={colors?.pasive}
                                                variant="Bold"
                                            />
                                            <Text style={{ marginLeft: 10, color: "#333" }}>{item?.counter}</Text>
                                        </View>
                                        {(status == "mypost") &&
                                            <View style={styles.row}>
                                                <Icon
                                                    name='more-vert'
                                                    onPress={() => toggleModal(item.id)}
                                                    size={18}
                                                    color={colors?.pasive}
                                                />
                                            </View>
                                        }
                                        {(status == "search") &&
                                            <View style={styles.row}>
                                                <Icon
                                                    name='more-vert'
                                                    onPress={() => toggleModalSearch(item.id)}
                                                    size={18}
                                                    color={colors?.pasive}
                                                />
                                            </View>
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Modal
                                isVisible={isModalVisible}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onBackdropPress={() => setModalVisible(!isModalVisible)}
                            >
                                <View style={{
                                    flex: 1,
                                    backgroundColor: '#fff',
                                    borderRadius: 10,
                                    maxHeight: 120,
                                }}>
                                    <TouchableOpacity
                                        onPress={() => navigate(ForumRouteName.EDIT_THREAD, {
                                            idThread: item?.id
                                        })}
                                        style={{ padding: 10, height: 40, width: WIDTH }}
                                    >
                                        <Text style={{ textAlign: "center" }}>{t('change')}</Text>
                                    </TouchableOpacity>
                                    <View style={{ borderWidth: 0.5, width: WIDTH, borderColor: colors?.line }} />
                                    <TouchableOpacity
                                        onPress={() => onDeleteThread(item?.id)}
                                        style={{ padding: 10, width: WIDTH, height: 40 }}
                                    >
                                        <Text style={{ textAlign: "center" }}>{t('delete')}</Text>
                                    </TouchableOpacity>
                                    <View style={{ borderWidth: 0.5, width: WIDTH, borderColor: colors?.line }} />
                                    <TouchableOpacity
                                        onPress={() => changeStatus("archive", item.id)}
                                        style={{ padding: 10, width: WIDTH, height: 40, }}
                                    >
                                        <Text style={{ textAlign: "center" }}>{t('forum:save_as_archive')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                            <Modal
                                isVisible={isModalVisibleSearch}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",

                                }}
                                onBackdropPress={() => setModalVisibleSearch(!isModalVisibleSearch)}
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
                                        onPress={() => changeStatus("archive", id)}
                                        style={{ padding: 10, height: 50, width: WIDTH }}
                                    >
                                        <Text style={{ textAlign: "center" }}>{t('forum:save')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </>
                        :
                        type == "type_2" ?
                            <>
                                <View style={[styles.card, { width: WIDTH }]} key={item?.id}>
                                    <TouchableOpacity onPress={() => navigate(ForumRouteName.EDIT_THREAD, {
                                        idThread: item?.id
                                    })}>
                                        <Text style={{ fontSize: convertCSS(themeSetting.h5_typography.font_size), fontWeight: "600", marginVertical: 10 }}>
                                            {item?.title}
                                        </Text>
                                        <View>
                                            <WebDisplay
                                                html={`<p>${Truncate(item?.content)}</p>`}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                marginTop: 10,

                                            }}>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: "bold",
                                                color: colors?.grey,
                                                fontStyle: "italic"

                                            }}>Terakhir diubah: {moment(new Date(item?.created_at)).format('DD MMM YYYY')}
                                            </Text>
                                        </View>
                                        <View style={styles.sectionRow}>
                                            <TouchableOpacity
                                                style={[styles.buttonDraft, { borderWidth: 0.2, borderColor: colors?.grey, backgroundColor: colors?.white, marginRight: 10 }]}
                                                onPress={() => navigate(ForumRouteName.EDIT_THREAD, {
                                                    idThread: item?.id
                                                })}
                                            >
                                                <Text style={{ color: themeSetting?.accent_color?.value, fontWeight: "600", fontSize: 14 }}>
                                                    {t('change')}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.buttonDraft, { backgroundColor: themeSetting?.accent_color?.value, borderRadius: 10 }]}
                                                onPress={() => changeStatus("published", item?.id)}
                                            >
                                                <Text style={{ color: colors?.white, fontWeight: "600", fontSize: 14 }}>
                                                    {t('forum:publish')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </View>

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
                                        maxHeight: 120,
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => onDeleteThread(item?.id)}
                                            style={{
                                                padding: 10,
                                                width: WIDTH
                                            }}
                                        >
                                            <Text style={{ textAlign: "center" }}>Hapus</Text>
                                        </TouchableOpacity>
                                        <View style={{ borderWidth: 0.5, width: WIDTH, borderColor: colors?.line }} />
                                        <TouchableOpacity
                                            onPress={() => changeStatus("published", item.id)}
                                            style={{ padding: 10, width: WIDTH }}
                                        >
                                            <Text style={{ textAlign: "center" }}>Publikasikan</Text>
                                        </TouchableOpacity>
                                    </View>

                                </Modal>
                            </>
                            :
                            type == "type_3" ?
                                <>
                                    <View style={[styles.card, { width: WIDTH }]} key={item?.id}>
                                        <TouchableOpacity onPress={() => toDetailThread(item?.id)}>
                                            <Text style={{ fontSize: convertCSS(themeSetting.body_typography.font_size) * 0.8, color: "gray", textAlign: "right" }}>{moment(new Date(item?.created_at)).fromNow()}</Text>
                                            <View style={{
                                                flex: 1,
                                                justifyContent: "space-between",
                                                flexDirection: "row",
                                            }}>

                                                <Text style={{ fontSize: convertCSS(themeSetting.h5_typography.font_size), fontWeight: "600", marginVertical: 10 }}>
                                                    {item?.title}
                                                </Text>
                                            </View>
                                            <View style={{ color: "gray" }}>
                                                <WebDisplay
                                                    html={`<p>${Truncate(item?.content)}</p>`}
                                                />
                                            </View>
                                            <View style={styles.sectionRow}>
                                                <TouchableOpacity onPress={() => onLike(item?.id)}>
                                                    <View style={styles.row}>
                                                        <Like1
                                                            size="18"
                                                            color={colors?.pasive}
                                                            variant="Bold"
                                                        />
                                                        <Text style={{ marginLeft: 10, color: "#333" }}>{item?.total_like}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={styles.row}>
                                                    <MessageText
                                                        size="18"
                                                        variant="Bold"
                                                        color={colors?.pasive}
                                                    />
                                                    <Text style={{ marginLeft: 10, color: "#333" }}>{item?.total_comment}</Text>
                                                </View>
                                                <View style={styles.row}>
                                                    <Eye
                                                        size="18"
                                                        color={colors?.pasive}
                                                        variant="Bold"
                                                    />
                                                    <Text style={{ marginLeft: 10, color: "#333" }}>{item?.counter}</Text>
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
                                            maxHeight: 100,
                                        }}>
                                            <TouchableOpacity
                                                onPress={() => onDeleteThread(item?.id)}
                                                style={{
                                                    padding: 10,
                                                    width: WIDTH,
                                                    height: 50
                                                }}
                                            >
                                                <Text style={{ textAlign: "center" }}>{t('delete')}</Text>
                                            </TouchableOpacity>
                                            <View style={{ borderWidth: 0.5, width: WIDTH, borderColor: colors?.line }} />
                                            <TouchableOpacity
                                                onPress={() => changeStatus("published", item.id)}
                                                style={{ padding: 10, width: WIDTH, height: 50 }}
                                            >
                                                <Text style={{ textAlign: "center" }}>{t('forum:publish')}</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </Modal>
                                </>
                                :
                                <View>
                                    <Text>Default</Text>
                                </View>
                    }
                    <CustomAlert
                        modalVisible={modalVisibleSuccess}
                        setModalVisible={setModalVisibleSuccess}
                        message={'Berhasil Hapus Bookmark.'}
                    />
                </View>
                :
                <ActivityIndicator
                    color={themeSetting?.accent_color?.value}
                    size={'small'}
                    style={{ padding: 10 }}
                />
            }
        </>
    );
}


export default CardThread;
