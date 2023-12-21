import { Timer1 } from 'iconsax-react-native';
import React, { useState, useEffect } from 'react';
import { FlatList, View, Button, Text, TextInput, StyleSheet, Image, Pressable, SafeAreaView, StatusBar, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { ProgressBar, MD3Colors, ActivityIndicator } from 'react-native-paper';
import axiosInstance from '../../../helpers/axiosInstance';
import { IMAGE_URL } from "@env"
import Currency from '../../../helpers/Currency';
import MembershipRows from './helpers/MembershipRows';
import { useSelector } from 'react-redux';
import colors from '../../../assets/theme/colors';
import ModalDialog from './helpers/ModalDialog';
import WebDisplay from '../../../screens/Forum/components/WebDisplay';
import moment from 'moment/moment';
import { useTranslation } from 'react-i18next';
const WIDTH = Dimensions.get('window').width;

export default function Membership() {

    const [text, onChangeText] = useState();
    const [modalDetail, setModalDetail] = useState(false);
    const [modalTdPoint, setModalTdPoint] = useState(false);
    const [modalPoint, setModalPoint] = useState(false);
    const [modalHistroyActivity, setModalHistoryActivity] = useState(false);
    const [dataVoucherEligible, setDataVoucherEligible] = useState([]);
    const [dataVoucherIneligible, setDataVoucherIneligible] = useState([]);
    const [data, setData] = useState();
    const [perPage, setPerPage] = useState(20);
    const [lastCashPointLogID, setlastCashPointLogID] = useState()
    const [lastLoyaltyPointLogID, setlastLoyaltyPointLogID] = useState()
    const [dataHistory, setDataHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const state = useSelector(
        state => state
    );

    useEffect(() => {
        getMembershipPoint();
        getDataVoucher();
        getPointHistory();

    }, []);

    const getMembershipPoint = () => {
        setLoading(true);
        axiosInstance.get('membership/getMasterData')
            .then((res) => {
                setData(res.data.data)
            }).catch(error => {
                console.log('getMembershipPoint', error.response.data)
            }).finally(() => { setLoading(false); });
    }
    const getMembership = () => {
        axiosInstance.get('membership/getMasterData')
            .then((res) => {
                setData(res.data.data)
            }).catch(error => {
                console.log('getMembershipPoint', error.response.data)
            })
    }

    const getDataVoucher = async () => {
        axiosInstance.get('membership/getVouchersToRedeem')
            .then((response) => {
                setDataVoucherEligible(response.data.data.eligibleVouchers)
                setDataVoucherIneligible(response.data.data.ineligibleVouchers)

            }).catch(error => {
                console.log('getVoucher', error.response.data)
            })
    }

    const getPointHistory = () => {
        let param = {
            per_page: perPage,
            last_cash_point_log_id: lastCashPointLogID,
            last_loyalty_point_log_id: lastLoyaltyPointLogID
        }

        axiosInstance.get(`membership/getPointsHistory?per_page=${perPage}`, param)
            .then((response) => {
                let data = response.data.data;
                setDataHistory(data.data)
                setlastCashPointLogID(data.lastCashPointLogID)
                setlastLoyaltyPointLogID(data.lastLoyaltyPointLogID)
                setCurrentPage(1)
            }).catch(error => {
                console.log('getPointHistory', error.response.data)
            })
    }

    const regex = /<[^>]*>/mgi

    const _renderItem = (item) => (
        <View >
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}

            >
                <View style={{ width: "70%", }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: 20,
                            fontWeight: "600",
                            color: "black"
                        }}>
                        Transaksi: {item?.description}
                    </Text>
                    <Text style={{ color: "black" }}>
                        {moment(item?.created_at).format("DD/MM/YYYY")}
                    </Text>
                </View>
                <View>
                    <Text style={{ fontSize: 14, color: "black" }}>
                        {(item?.type == "cash") ? data?.cashPointCustomName : (item?.type == "loyalty") ? "Poin Loyalitas" : "-"}
                    </Text>
                    <Text
                        style={{ color: item.point > 0 ? "green" : "red", fontSize: 18, alignSelf: "flex-end" }}
                    >
                        {(item?.point > 0) ? `+ ${Currency(item?.point)}` : Currency(item?.point)}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    borderBottomColor: 'gray',
                    borderBottomWidth: 1,
                    marginVertical: 10
                }}
            />
        </View>
    )

    // const handlePagination = async () => {

    //     let filter = {
    //         per_page: perPage,
    //         last_cash_point_log_id: lastCashPointLogID,
    //         last_loyalty_point_log_id: lastLoyaltyPointLogID
    //     }

    //     let newPage = currentPage + 1;

    //     if (newPage > dataHistory.lenght) {
    //         return;
    //     } else if (isLoadMore) {
    //         return;
    //     } else {
    //         setIsLoadMore(true);
    //         await axiosInstance
    //             .get(`membership/getPointsHistory?per_page=${newPage}`, filter)
    //             .then(res => {
    //                 let data = res.data.data;
    //                 const newList = dataHistory.concat(data.data);
    //                 setDataHistory(newList);
    //                 setlastCashPointLogID(data.lastCashPointLogID)
    //                 setlastLoyaltyPointLogID(data.lastLoyaltyPointLogID)
    //                 setCurrentPage(newPage);

    //             }).finally(() => setIsLoadMore(false));
    //     }
    // }

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


    const { t } = useTranslation()

    return (
        <>
            {loading ?
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <ActivityIndicator
                        color={themeSetting.accent_color.value}
                        size={'small'}
                        style={{ padding: 10 }}
                    />
                </View>
                :
                <SafeAreaView>
                    <ScrollView style={{ backgroundColor: "#FFFFFF" }}>
                        <View style={styles.membership}>
                            <Image
                                style={styles.logo}
                                source={{
                                    uri: `${IMAGE_URL}/public/membership/${data?.customerLevel?.banner}`
                                }}
                            />
                            <View style={[styles.section1, { backgroundColor: themeSetting.accent_color.value }]}>
                                <View style={styles.section2}>
                                    <Image
                                        style={styles.profil}
                                        source={{
                                            uri: `${IMAGE_URL}/public/customer/${JSON.parse(state?.authReducer?.user)?.profile_picture}`
                                        }}
                                    />
                                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>
                                        {(data?.customerLevel?.name) || "-"}
                                    </Text>
                                    <TouchableOpacity style={{ marginTop: 5 }} onPress={() => setModalDetail(true)}>
                                        <Text style={{ fontSize: 12, color: "#FFF" }}>
                                            {t('membership:details')}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{ marginLeft: 100 }}>
                                        <TouchableOpacity onPress={() => setModalHistoryActivity(true)}>
                                            <Timer1 size="24" color={"#FFFFFF"} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.section3}>
                                    <View style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between"
                                    }}
                                    >
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: "700"
                                        }}
                                        >
                                            {data?.cashPointCustomName || "-"}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => setModalTdPoint(true)}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: "#FFFFFF",
                                                }}>
                                                {t('membership:modal_info')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        <Text
                                            style={{
                                                fontSize: 32,
                                                color: themeSetting.accent_color.value,
                                                fontWeight: "700"
                                            }}>
                                            {Currency(data?.currentCashPoint)}
                                        </Text>
                                        <Text style={{
                                            marginLeft: 5,
                                            fontSize: 20,
                                            color: "#A6A6A6"
                                        }}>
                                            {t('membership:point')}
                                        </Text>
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            color: colors.danger,
                                            marginTop: 20
                                        }}>
                                        {
                                            data?.cashPointExpireSchedule &&
                                            `${Currency(data?.cashPointExpireSchedule.point * -1)
                                            } ${t('membership:expire')} ${moment(data.cashPointExpireSchedule.scheduled_time).format('DD MMMM YYYY')
                                            } `
                                        }
                                    </Text>
                                </View>
                                <View style={styles.section3}>
                                    <View style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between"
                                    }}>
                                        <Text
                                            style={{
                                                fontSize: 14, fontWeight: "700"
                                            }}>
                                            {t('membership:loyalty_points')}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => setModalPoint(true)}
                                        >
                                            <Text style={{
                                                fontSize: 12,
                                                color: themeSetting.accent_color.value,
                                            }} >
                                                {t('membership:modal_info')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        <Text
                                            style={{
                                                fontSize: 32,
                                                color: themeSetting.accent_color.value,
                                                fontWeight: "700"
                                            }}>
                                            {Currency(data?.currentLoyaltyPoint)}
                                        </Text>
                                        <Text style={{
                                            marginLeft: 5,
                                            fontSize: 20,
                                            color: "#A6A6A6"
                                        }}>
                                            {t('membership:point')}
                                        </Text>
                                    </View>
                                    <View>
                                        <ProgressBar progress={0.1} color={themeSetting.accent_color.value} />
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            color: "#404040",
                                            marginTop: 20,
                                            fontWeight: "500"
                                        }}>
                                        {`${Currency(data?.customerNextLevel?.min_point - data?.currentLoyaltyPoint)} ${t('membership:next_level')}`}
                                    </Text>
                                </View>
                            </View>

                            {
                                (dataVoucherEligible || dataVoucherIneligible) &&
                                <>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: "700",
                                        marginTop: 10,
                                        marginHorizontal: 10,
                                    }}>
                                        {t('membership:redeem_voucher')}
                                    </Text>
                                    {dataVoucherEligible && dataVoucherEligible.map((item) => (
                                        <MembershipRows loading={loading} item={item} submit={getMembership} key={item.id} history={getPointHistory} t={t} />
                                    ))}
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: "700",
                                        marginHorizontal: 10,
                                        marginTop: 10,
                                    }}>
                                        {t('membership:redeem_voucher_2')}
                                    </Text>
                                    {dataVoucherIneligible && dataVoucherIneligible.map((item) => (
                                        <MembershipRows loading={loading} item={item} submit={getMembership} type={0} key={item.id} t={t} />
                                    ))}
                                </>
                            }
                            <ModalDialog
                                showModal={modalDetail}
                                header={"Detail Member"}
                                setShowModal={setModalDetail}
                                content={
                                    <WebDisplay
                                        html={data?.customerLevel?.description}
                                    />
                                }
                            />
                            <ModalDialog
                                showModal={modalTdPoint}
                                setShowModal={setModalTdPoint}
                                header={data?.cashPointCustomName}
                                content={
                                    <WebDisplay
                                        html={data?.cashPointDescription}
                                    />
                                }
                            />

                            <ModalDialog
                                showModal={modalPoint}
                                setShowModal={setModalPoint}
                                header={"Poin Loyalitas"}
                                content={
                                    <WebDisplay
                                        html={data?.loyaltyPointDescription}
                                    />
                                }
                            >
                            </ModalDialog>
                            <ModalDialog
                                showModal={modalHistroyActivity}
                                setShowModal={setModalHistoryActivity}
                                header={t('membership:header_modal_history_point')}
                                content={
                                    <ScrollView>
                                        <FlatList
                                            nestedScrollEnabled={true}
                                            data={dataHistory}
                                            renderItem={({ item }) => _renderItem(item)}
                                            keyExtractor={({ item }) => item?.id}
                                            onEndReachedThreshold={0.2}
                                            // onEndReached={() => handlePagination()}
                                            ListFooterComponent={renderFooter}
                                            ListEmptyComponent={() => (
                                                <View>
                                                    <Text>
                                                        history is empty
                                                    </Text>
                                                </View>
                                            )}
                                        />
                                    </ScrollView>

                                }

                            >
                            </ModalDialog>
                        </View>
                    </ScrollView >
                </SafeAreaView >
            }
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        paddingHorizontal: 20,
        marginTop: 0,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#F18910",
        height: 40,
        borderRadius: 10,
        width: "90%",
        color: "black"

    },
    membership: {
        width: WIDTH,
    },
    logo: {
        height: 125,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: "contain",
        backgroundColor: "grey",
        marginHorizontal: 10,
        marginTop: 10,
    },
    section1: {
        padding: 15,
        height: "auto",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginHorizontal: 10
    },
    section3: {
        padding: 20,
        marginTop: 10,
        backgroundColor: "#FFFFFF",
        height: "auto",
        width: "100%",
        borderRadius: 10,
    },
    section2: {
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between"
    },
    profil: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: "#FFFFFF"
    },
    text: {
        color: "#FFFFFF",
        fontSize: 16,
        textDecorationLine: "underline",
    },
    description: {
        color: "#333333",
        fontSize: 16,
        fontWeight: "400"
    },

})
