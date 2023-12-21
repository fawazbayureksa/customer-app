import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    ImageBackground,
    TextInput
} from 'react-native';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import { RadioButton } from 'react-native-paper';
import { WebinarRouteName } from '../../../constants/webinar_route/webinarRouteName';
import Template from '../../../components/Template';
import axiosInstance from '../../../helpers/axiosInstance';
import ModalWebview from '../../Marketplace/payment/components/ModalWebview';
import WebinarModalManualTransfer from '../components/WebinarModalManualTransfer';
import convertCSS from '../../../helpers/convertCSS';
import { paymentMethodOptions } from '../components/constants';
import { useSelector } from 'react-redux';
import {useTranslation} from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { MIDTRANS_SNAP_URL_V1 } from '@env';

const CheckoutWebinar = ({ navigation, route }) => {
    const { invoice } = route.params;
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState();
    const [selectedManualTransfer, setSelectedManualTransfer] = useState();
    const [showManualTransfer, setShowManualTransfer] = useState(false);
    const [redirectUrlMidtrans, setRedirectUrlMidtrans] = useState('');
    const [modalWebview, setModalWebview] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState([])
    const [dataPayment, setDataPayment] = useState()
    const [bankAccounts, setBankAccounts] = useState();

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const {t} = useTranslation();
    const fontSize = convertCSS(themeSetting.body_typography.font_size);

    useEffect(() => {
        getMasterData();
    }, []);

    const getMasterData = () => {
        setLoading(true);
        let params = {
            invoice_number: invoice,
        };
        axiosInstance
            .get(`checkout-pay/getMasterData`, { params })
            .then(res => {
                let data = res.data.data;

                // ========================== Payment method ==========================
                let payment_method = [];
                for (const item of JSON.parse(data.payment_method).value) {
                    payment_method[item.key] = item;
                }

                // ========================== sumQty, grand_total ==========================
                // let sumQty = 0;
                // let grand_total = 0;
                for (const datum of res.data.data.data.mp_payment_transactions) {
                    grand_total += datum.mp_transaction.grand_total;
                    for (const detail of datum.mp_transaction.mp_transaction_details) {
                        sumQty += detail.quantity;
                    }
                }
                // setQuantity(sumQty);
                // setTotalPrice(grand_total);
                setPaymentMethod(payment_method);
                setDataPayment(res.data.data.data);
                setBankAccounts(data.bank_accounts);
                // setTotalPayment(grand_total);
            })
            .catch(error => {
                console.error('error getMasterData', error.response.data);
            })
            .finally(() => setLoading(false));
    };

    const checkPaymentMethodExist = (itemKey) => {
        let payment_method = paymentMethod[itemKey]
        if (payment_method && payment_method.selected) return true
        else return false
    }

    const saveMidtransPdf = (token) => {
        let pdf_url = `${MIDTRANS_SNAP_URL_V1}/transactions/${token}/pdf` //hrs diperbaiki
        setLoading(true);
        let params = {
            invoice_number: invoice,
            link: pdf_url
        };
        axiosInstance
            .post(`checkout-pay/saveMidtransPdf`, params)
            .then(res => {
                console.log("Save Midtrans pdf Success")
            })
            .catch(error => {
                console.error('error on saveMidtransPdf', error);
            })
            .finally(() => setLoadingSubmit(false));
    }

    const handleTransaction = () => {
        if (selectedPaymentMethod) {
            if (selectedPaymentMethod == 'manual') {
                setShowManualTransfer(true);
            } else {
                setLoadingSubmit(true);
                let data = {
                    invoice_number: invoice,
                    enabled_payment: selectedPaymentMethod
                }
                // console.log(data);
                // return;
                axiosInstance
                    .post(`webinar/checkout-pay/getMidtransToken`, data)
                    .then(res => {
                        setRedirectUrlMidtrans(res.data.data.redirect_url);
                        saveMidtransPdf(res.data.data.token)
                        setModalWebview(true);
                    })
                    .catch(error => {
                        console.error('error onSubmitPayment', error);
                    })
                    .finally(() => setLoadingSubmit(false));
            }
        } else {
            return;
        }
    }

    return (
        <View style={styles.Container}>
            <ScrollView>
                <Text style={{ fontWeight: "bold", color: 'black', marginTop: 10, marginLeft: '5%', fontSize: fontSize }}>
                    {t('webinar:invoice')}: {invoice}
                </Text>
                {paymentMethodOptions.map((item) => {
                    if (item.group) {
                        let visible = false
                        for (const item2 of item.items) {
                            if (checkPaymentMethodExist(item2.key)) {
                                visible = true;
                                break;
                            }
                        }
                        if (visible) return (
                            <Collapse style={[styles.boxContainer]}>
                                <CollapseHeader>
                                    <View style={[styles.noBackground, { marginLeft: '2.5%', marginTop: 15, borderBottomWidth: 0.5, width: '95%' }]}>
                                        <View style={{ width: '50%', flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: "bold", color: 'black' }}>{t(`common:group_${item.group}`)}</Text>
                                        </View>
                                        <View style={{ width: '50%', flexDirection: 'row', justifyContent: "flex-end" }}>
                                            <MaterialIcons
                                                name="keyboard-arrow-down"
                                                color="grey"
                                                size={24}
                                            />
                                        </View>
                                    </View>
                                </CollapseHeader>
                                <CollapseBody>
                                    {item.items.map((item2) => {
                                        if (paymentMethod && checkPaymentMethodExist(item2.key)) return (
                                            <View style={[styles.noBackground, { width: '97.5%' }]}>
                                                <RadioButton
                                                    value="bca_va"
                                                    color='blue'
                                                    status={selectedPaymentMethod === item2.key ? 'checked' : 'unchecked'}
                                                    onPress={() => setSelectedPaymentMethod(item2.key)}
                                                />
                                                <Image
                                                    source={item2.filename}
                                                    style={{ height: '100%', width: '15%', marginBottom: 10 }}
                                                />
                                                <View style={{ flexDirection: 'column', marginLeft: '2.5%', width: '70%' }}>
                                                    <Text style={{ fontWeight: "bold", color: 'black' }}>{t(`common:${item2.key}_title`)}</Text>
                                                    <Text style={{ fontSize: fontSize*0.7 }}>{t(`common:${item2.key}_desc`)}</Text>
                                                </View>
                                            </View>
                                        )
                                        else return null
                                    })}
                                </CollapseBody>
                            </Collapse>

                        )
                        else return null
                    }
                    else {
                        if (checkPaymentMethodExist(item.key)) return (
                            <View style={[styles.boxContainer]}>
                                <RadioButton
                                    value="bca_va"
                                    color='blue'
                                    status={selectedPaymentMethod === item.key ? 'checked' : 'unchecked'}
                                    onPress={() => setSelectedPaymentMethod(item.key)}
                                />
                                <Image
                                    source={item.filename}
                                    style={{ height: '100%', width: '15%', marginBottom: 10 }}
                                />
                                <View style={{ flexDirection: 'column', marginLeft: '2.5%',height: 'auto', width: '70%' }}>
                                    <Text style={{ fontWeight: "bold", color: 'black' }}>{t(`common:${item.key}_title`)}</Text>
                                    <Text style={{ fontSize: fontSize*0.7 }}>{t(`common:${item.key}_desc`)}</Text>
                                </View>
                            </View>
                        )
                        else return null
                    }
                })}
            </ScrollView>

            <View style={{ backgroundColor: 'white', flexDirection: 'row' }}>
                <TouchableOpacity style={styles.button} onPress={handleTransaction}>
                    <Text style={[styles.textPrice, { fontSize: 18, color: 'white' }]}>Selanjutnya</Text>
                </TouchableOpacity>
            </View>
            {(bankAccounts) &&
                <WebinarModalManualTransfer
                    showManualTransfer={showManualTransfer}
                    setShowManualTransfer={setShowManualTransfer}
                    bankAccounts={bankAccounts}
                    setSelectedManualTransfer={setSelectedManualTransfer}
                    selectedManualTransfer={selectedManualTransfer}
                    loadingSubmit={loadingSubmit}
                    data={dataPayment}
                    navigation={navigation}
                />}
            <ModalWebview
                redirectUrlMidtrans={redirectUrlMidtrans}
                modalWebview={modalWebview}
                setModalWebview={setModalWebview}
                navigation={navigation}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: 210,
        borderWidth: 1,
        backgroundColor: '#F8931D',
        borderRadius: 10
    },
    noBackground: {
        width: '100%',
        marginBottom: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    boxContainer: {
        marginLeft: '5%',
        width: '90%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#e6e6e6',
        // height: 120,
        borderRadius: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    button: {
        backgroundColor: '#F8931D',
        width: '90%',
        marginLeft: '5%',
        marginTop: 15,
        bottom: '2.5%',
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        width: '95%',
        height: 35,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 7,
        marginLeft: '2.5%',
        marginTop: 5
    }
});

export default CheckoutWebinar