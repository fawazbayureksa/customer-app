import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Pressable, Button, Alert, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import axiosInstance from '../../../../helpers/axiosInstance';
import { IMAGE_URL } from "@env"
import Currency from '../../../../helpers/Currency';
import { useSelector } from 'react-redux';
import convertCSS from '../../../../helpers/convertCSS';
import ModalDialog from './ModalDialog';
import WebDisplay from '../../../Forum/components/WebDisplay';
import { useToast } from 'react-native-toast-notifications';
import CustomAlert from '../../../Forum/components/CustomAlert';
import { ActivityIndicator } from 'react-native-paper';

const MembershipRows = ({ item, type, submit, history, t }) => {
    const [modalDetailVoucher, setModalDetailVoucher] = useState(false);
    const [modalTukarPoint, setModalTukarPoint] = useState(false);
    const [submitting, setSubmitting] = useState()
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const [modalSuccesUpdate, setModalSuccesUpdate] = useState(false);
    const toast = useToast()
    const WIDTH = Dimensions.get('window').width * 0.95;
    const handleSubmit = async () => {
        setSubmitting(true)
        let param = {
            mp_voucher_id: item.id,
        }
        axiosInstance.post('membership/buyVoucherWithPoints', param)
            .then((response) => {
                setModalSuccesUpdate(true)
                setModalTukarPoint(false)
                submit()
                history()
            }).catch(error => {
                console.log('submit buyVoucherWithPoints', error.response.data.message)
                toast.show(error.response.data.message, {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            })
    }

    const getMinPurchase = () => {
        if (!item.conditions) return null
        let min_purchase = item.conditions.find(x => x.type == "purchase" && x.purchase_trigger === true)
        if (min_purchase) return min_purchase.value

        return 0
    }

    const editButton = () => {
        return type === 0
    }


    return (
        <View style={[styles.cardVoucher, { borderColor: themeSetting.accent_color.value }]} key={item.id}>
            <Image
                style={[styles.imageVoucher, { width: WIDTH * 0.3 }]}
                source={{
                    uri: `${IMAGE_URL}public/marketplace/voucher/${item.image}`,
                }}
            />
            <View
                style={{
                    marginLeft: 10,
                    width: WIDTH * 0.6,
                }}>
                <Text
                    numberOfLines={1}
                    style={{
                        fontSize: 14,
                        fontWeight: "600"
                    }}>
                    {item.name}
                </Text>
                <Text
                    style={{
                        fontSize: 10,
                        color: "#8D8D8D",
                    }}>
                    {item.code}
                </Text>
                <Text
                    style={{
                        color: themeSetting.accent_color.value,
                        fontSize: 16,
                        fontWeight: "600"
                    }}>
                    {Currency(getMinPurchase())} {t('membership:point')}
                </Text>
                <View style={{ width: WIDTH * 0.58, flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <TouchableOpacity
                        onPress={() => setModalDetailVoucher(true)}
                    >
                        <Text
                            style={{
                                color: themeSetting.accent_color.value,
                                fontSize: 10
                            }}>
                            {t('membership:details')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            backgroundColor: editButton() === true ? "#9E9E9E" : themeSetting?.accent_color?.value,
                            height: "auto",
                            width: 100,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 5,
                        }}
                        onPress={() => setModalTukarPoint(true)} disabled={editButton() === true ? true : false}>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: "#FFFFFF",
                                fontSize: 12,
                                fontWeight: "600",
                            }}
                        >
                            {t('membership:exchange_points')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ModalDialog
                showModal={modalDetailVoucher}
                setShowModal={setModalDetailVoucher}
                header={t('membership:details')}
                content={
                    <WebDisplay
                        html={item?.informations[0].terms_and_conditions}
                    />
                }
            />

            <ModalDialog
                showModal={modalTukarPoint}
                setShowModal={() => setModalTukarPoint(false)}
                content={
                    <View >
                        <Text style={{ fontSize: 20, fontWeight: "600", color: "black", marginTop: 10 }}>
                            {item.name}
                        </Text>
                        <Text style={{ color: themeSetting?.accent_color?.value, fontSize: 20, marginTop: 10, fontWeight: "600" }}>
                            {Currency(getMinPurchase())} {t('membership:point')}s
                        </Text>
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            marginTop: 30,
                            height: 50,
                        }}>
                            <TouchableOpacity
                                style={{
                                    width: "45%",
                                    backgroundColor: "#FFF",
                                    borderColor: "#DCDCDC",
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onPress={() => setModalTukarPoint(false)}
                            >
                                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                                    {t('membership:button_cancel_modal_exchange_point')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: "45%",
                                    backgroundColor: themeSetting?.accent_color?.value,
                                    borderRadius: 10,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onPress={handleSubmit}
                            >
                                <Text style={{ fontSize: 18, fontWeight: "700", color: "#FFFFFF" }}>{t('membership:button_modal_exchange_point')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                header={t('membership:header_modal_exchange_point')}
            />
            <CustomAlert
                modalVisible={modalSuccesUpdate}
                setModalVisible={setModalSuccesUpdate}
                message={'Berhasil Tukar Point'}
            />

        </View>

    );
}

const styles = StyleSheet.create({

    imageVoucher: {
        height: 70,
        borderRadius: 5,
        resizeMode: "contain",
        alignSelf: "center",
    },
    cardVoucher: {
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#FFFFFF",
        marginHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        display: "flex",
        flexDirection: "row",
    },
    text: {
        color: "#FFFFFF",
        fontSize: 16,
        textDecorationLine: "underline",
    },
})

export default MembershipRows;
