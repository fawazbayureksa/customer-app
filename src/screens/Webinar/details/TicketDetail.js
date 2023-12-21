import React, { useState, useEffect, useContext } from 'react';
import {
    Modal,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Pressable,
    ToastAndroid,
    Linking,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Clipboard from '@react-native-clipboard/clipboard';
import { WebinarRouteName } from '../../../constants/webinar_route/webinarRouteName';
import convertCSS from '../../../helpers/convertCSS';
import axiosInstance from '../../../helpers/axiosInstance';
import Currency from '../../../helpers/Currency';
import RenderHtml from 'react-native-render-html';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { IMAGE_URL } from "@env";
import { Origin } from "@env";
import { useTranslation } from 'react-i18next';
import { generalStyles } from '../components/styles';
import { optionEventType, optionExpertiseLevel, paymentStatus } from '../components/constants';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

const TicketDetail = ({ navigation, route }) => {
    const { transCode } = route.params;
    const [loading, setLoading] = useState(false);
    const [dataTransaction, setDataTransaction] = React.useState({});
    const [dataPayment, setDataPayment] = React.useState({});
    const [dataEvent, setDataEvent] = React.useState({});
    const [dataCustomer, setDataCustomer] = React.useState({});
    const [venueLabel, setVenueLabel] = React.useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [uriShoot, setUriShoot] = useState()
    const currentDate = new Date();
    const { navigate } = useNavigation()
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const { t } = useTranslation();

    const fontSize = convertCSS(themeSetting.body_typography.font_size);

    const WIDTH = Dimensions.get('window').width * 0.95;

    useEffect(() => {
        getTicketInfo()
    }, []);

    const functSetVenueLabel = (type) => {
        if (type === 'online') {
            setVenueLabel('Link');
        } else {
            setVenueLabel('Lokasi');
        }
    }

    const setOptionLabel = (val, option) => {
        let result = option.find(x => x.value === val)
        if (result) {
            return result.label
        } else {
            return val
        }
    }

    const getTicketInfo = () => {
        let params = {
            transaction_code: transCode,
        }
        setLoading(true)
        axiosInstance
            .get(`webinar/my-orders/get-detail`, { params })
            .then(res => {
                setDataPayment(res.data.data.DataMpPayment);
                setDataTransaction(res.data.data);
                setDataEvent(res.data.data.webinar_event);
                setDataCustomer(res.data.data.mp_customer);
                functSetVenueLabel(res?.data?.data?.webinar_event?.event_type);
                // console.log(transCode);
                // console.log(res.data.data.webinar_speaker_rating.length);
            }).catch(error => {
                console.error('error Ticket Detail: ', error);
            }).finally(() => setLoading(false))
    }
    const onCopyPressed = () => {

        Clipboard.setString(dataEvent?.venue);
        ToastAndroid.show('Link has been copied to clipboard', ToastAndroid.SHORT);
    }

    const WebView = useCallback(async () => {

        Alert.alert('Belum Bisa')
        return
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL('https://customer-tokodapur.degadai.id/invoice/INV-TSI-0020-10-2022');
        await Linking.openURL('https://customer-tokodapur.degadai.id/invoice/INV-TSI-0020-10-2022');

    }, []);



    const onPrint = () => {
        let params = {
            id: dataTransaction.id
        }
        axiosInstance.post(`webinar/generateToken`, params)
            .then(res => {
                Linking.openURL(`${Origin}webinar/invoice/${dataTransaction.transaction_code}?token=${res.data.data.token}`);
            }).catch(error => {
                console.error('error Ticket Detail: ', error);
            })
    }
    // console.log(dataTransaction.webinar_transaction_statuses[0].mp_transaction_status_master_key)

    return (
        <View style={generalStyles.container}>
            {
                (setModalVisible) ?
                    <>
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }}>

                        </View>
                    </> :
                    <>
                    </>
            }
            <ScrollView
                style={modalVisible ? { backgroundColor: 'rgba(0,0,0,0.5)' } : ''}
            >
                <Image
                    source={{ uri: `${IMAGE_URL}public/cms/${dataEvent?.image}` }}
                    style={[styles.image, modalVisible ? { backgroundColor: 'rgba(0,0,0,0.5)', opacity: 0.3 } : '']}
                />
                <View style={[generalStyles.boxShadowContainer,
                modalVisible ? { backgroundColor: 'rgba(0,0,0,0.5)', opacity: 0.3 } : '',
                (moment(dataEvent?.event_date).isBefore(currentDate)) ? { marginBottom: 60 } : { marginBottom: 30 }]}
                >
                    <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: '2.5%', marginBottom: 10 }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ fontSize: fontSize * 0.92 }}>
                                {t('webinar:transaction_id')}
                            </Text>
                            <Text style={{ color: 'black', fontWeight: "bold", fontSize: fontSize * 0.92 }}>
                                {dataTransaction.transaction_code}
                            </Text>
                        </View>
                        <View style={{ width: '50%', flexDirection: 'row', justifyContent: "flex-end" }}>
                            <Image
                                source={require("../../../assets/images/tokodapur_black.png")}
                                style={{ height: 25, width: 100, marginRight: '10%', marginTop: '5%' }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: '2.5%', marginRight: '5%', marginBottom: 10 }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ fontSize: fontSize * 0.92 }}>
                                {t('webinar:type')}:
                            </Text>
                            <Text style={{ color: 'black', fontWeight: "bold", fontSize: fontSize * 0.92 }}>
                                {setOptionLabel(dataEvent?.event_type, optionEventType)}
                            </Text>
                        </View>
                        <View style={{ width: '52.5%' }}>
                            <Text style={{ fontSize: fontSize * 0.92 }}>
                                {t('webinar:date_time')}:
                            </Text>
                            <Text style={{ color: 'black', fontWeight: "bold", fontSize: fontSize * 0.92, marginBottom: 5, marginLeft: '1%' }}>
                                {moment(dataEvent?.event_date).format('DD MMMM YYYY')}, {moment(dataEvent?.event_date).format('HH : mm')}
                            </Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: '2.5%', width: '95%', borderBottomWidth: 0.2, borderColor: 'grey', fontSize: fontSize, marginBottom: 5 }} />
                    {
                        (dataTransaction?.last_status?.mp_transaction_status_master_key === 'payment_pending') ?
                            <>
                                <Text style={[styles.headerText, { fontSize: fontSize }]}>
                                    {t('webinar:payment_deadline')}:
                                </Text>
                                <Text style={{ marginLeft: '2.5%', marginBottom: 15, fontSize: fontSize }}>
                                    {moment(dataTransaction?.last_status?.deadline).format('DD MMMM YYYY')} ,{moment(dataTransaction?.last_status?.deadline).format('HH : mm')}
                                </Text>
                            </> :
                            <></>
                    }
                    <Text style={[styles.headerText, { fontSize: fontSize }]}>
                        {t('webinar:level')}:
                    </Text>
                    <Text style={{ marginLeft: '2.5%', marginBottom: 15, fontSize: fontSize }}>
                        {dataEvent?.event_level}
                    </Text>
                    {
                        (dataEvent?.event_type === 'online') ?
                            <>
                                <View style={{ flexDirection: 'row', marginLeft: '2.5%' }}>
                                    <View style={{ width: '50%' }}>
                                        <Text style={{ color: 'black', fontWeight: "bold", fontSize: fontSize }}>
                                            {venueLabel}:
                                        </Text>
                                    </View>
                                    <View style={{ width: '50%', flexDirection: 'row', justifyContent: "flex-end" }}>
                                        <TouchableOpacity
                                            onPress={() => onCopyPressed()} //copy link
                                        >
                                            <Ionicons
                                                name="copy"
                                                size={20}
                                                style={{ marginRight: '5%' }}
                                                color='#F8931D'
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </> :
                            <>
                                <Text style={[styles.headerText, { fontSize: fontSize }]}>
                                    {venueLabel}:
                                </Text>
                            </>
                    }
                    <Text style={{ marginLeft: '2.5%', marginBottom: 15, fontSize: fontSize }}>
                        {dataEvent?.venue}
                    </Text>
                    <Text style={[styles.headerText, { fontSize: fontSize }]}>
                        {t('webinar:featured_speaker')}:
                    </Text>
                    <View style={{ marginLeft: '2.5%', marginBottom: 15 }}>
                        {dataEvent?.speakers?.map(
                            (speaker) => {
                                return (
                                    <Text style={{ fontSize: fontSize }}>
                                        - {speaker.speaker.name}
                                    </Text>
                                )
                            }
                        )
                        }
                    </View>
                    <Text style={[styles.headerText, { fontSize: fontSize }]}>
                        {t('webinar:participant')}:
                    </Text>
                    <Text style={{ marginBottom: 15, marginLeft: '2.5%', fontSize: fontSize }}>
                        {dataCustomer?.name}
                    </Text>
                    <View style={{ marginLeft: '2.5%', width: '95%', borderBottomWidth: 0.2, borderColor: 'grey', fontSize: fontSize }} />

                    <Text style={{ fontWeight: "bold", marginTop: 10, marginLeft: '2.5%', color: 'black', width: '100%', fontSize: fontSize }}>
                        {t('webinar:term_condition')}:
                    </Text>
                    <View style={{ marginLeft: '2.5%', marginTop: -7.5, marginBottom: 5, fontSize: fontSize }}>
                        <RenderHtml
                            // source={{ html: `${item?.content.slice(0, 250)}` }}
                            source={{ html: `${dataEvent?.terms}` }}
                            contentWidth={WIDTH}
                            WebView={WebView}
                        />
                    </View>
                    <View style={{ marginLeft: '2.5%', width: '95%', marginBottom: 15, borderBottomWidth: 0.2, borderColor: 'grey' }} />

                    <View style={{ width: '50%' }}>
                        <Text style={{ fontWeight: "bold", marginLeft: '4%', color: 'black', width: '100%', fontSize: fontSize }}>
                            {t('webinar:tools')}:
                        </Text>
                        {dataEvent?.tools?.map(
                            (tool) => {
                                return (
                                    <>
                                        <View style={{ flexDirection: 'row', marginLeft: '4%' }}>
                                            <Icon
                                                name="check-circle"
                                                size={18}
                                                // style={{ marginLeft: '5%' }}
                                                color='#F8931D'
                                            />
                                            <Text key={tool.id} style={{ marginLeft: '5%', width: '100%', fontSize: fontSize * 0.85 }}>
                                                {tool.name}
                                            </Text>
                                        </View>
                                    </>
                                )
                            }
                        )}
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={{
                            fontWeight: "bold",
                            marginLeft: '5%',
                            color: 'black',
                            width: '100%',
                            fontSize: fontSize
                        }}>
                            {t('webinar:ingredients')}:
                        </Text>
                        {dataEvent?.ingredients?.map(
                            (ingredient) => {
                                return (
                                    <>
                                        <View style={{ flexDirection: 'row', marginLeft: '5%' }}>
                                            <Icon
                                                name="check-circle"
                                                size={18}
                                                // style={{ marginLeft: '5%' }}
                                                color='#F8931D'
                                            />
                                            <Text key={ingredient.id} style={{ marginLeft: '5%', fontSize: fontSize * 0.85 }}>
                                                {ingredient.name}
                                            </Text>
                                        </View>
                                    </>
                                )
                            }
                        )}
                    </View>
                    <View style={{ marginTop: 15, marginBottom: 55 }}>
                        <Text style={{
                            fontWeight: "bold",
                            marginLeft: '5%',
                            color: 'black',
                            width: '100%',
                            fontSize: fontSize
                        }}>
                            {t('webinar:benefits')}:
                        </Text>
                        {dataEvent?.benefits?.map(
                            (benefit) => {
                                return (
                                    <>
                                        <View style={{ flexDirection: 'row', marginLeft: '5%' }}>
                                            <Icon
                                                name="check-circle"
                                                size={18}
                                                // style={{ marginLeft: '5%' }}
                                                color='#F8931D'
                                            />
                                            <Text key={benefit.id} style={{ marginLeft: '5%', fontSize: fontSize * 0.85 }}>
                                                {benefit.name}
                                            </Text>
                                        </View>
                                    </>
                                )
                            }
                        )}
                    </View>
                </View>
            </ScrollView>
            {
                (moment(dataEvent?.event_date).isAfter(currentDate) || (dataTransaction?.webinar_speaker_rating?.length > 0)) || (dataTransaction?.last_status?.mp_transaction_status_master_key !== paymentStatus[0].value) ?
                    <>
                        <TouchableOpacity
                            style={[generalStyles.shadowButtonWhite, { bottom: '2.5%' }]}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={{ color: '#F8931D', fontSize: fontSize * 1.3 }}>{t('webinar:view_detail_transaction')}</Text>
                        </TouchableOpacity>

                    </> :
                    <>
                        <TouchableOpacity
                            style={generalStyles.shadowButtonWhite}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={{ color: '#F8931D', fontSize: fontSize * 1.3 }}>{t('webinar:view_detail_transaction')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={generalStyles.shadowButton}
                            onPress={() => navigation.navigate(WebinarRouteName.WEBINAR_REVIEW, { eventId: dataTransaction.webinar_event_id, transId: dataTransaction.id })}
                        >
                            <Text style={{ color: 'white', fontSize: fontSize * 1.3 }}>{t('webinar:give_review')}</Text>
                        </TouchableOpacity>
                    </>
            }


            <Modal animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: '2.5%', marginBottom: 15 }}>
                            <View style={{ width: '50%' }}>
                                <Text style={{ color: 'black', fontWeight: "bold", fontSize: fontSize }}>
                                    {t('webinar:detail_transaction')}
                                </Text>
                            </View>
                            <View style={{ width: '50%', flexDirection: 'row', justifyContent: "flex-end" }}>
                                <Pressable
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Icon
                                        name="close"
                                        size={20}
                                        style={{ marginRight: '5%' }}
                                    />
                                </Pressable>
                            </View>
                        </View>
                        <View style={{ width: '95%', marginBottom: 15, borderBottomWidth: 0.25, borderColor: 'grey' }} />

                        <Text style={{ width: '95%', fontSize: fontSize }}>
                            {t('webinar:transaction_id')}:
                        </Text>
                        <Text style={{ width: '95%', fontSize: fontSize, fontWeight: 'bold', marginBottom: 10 }}>
                            {dataTransaction.transaction_code}
                        </Text>
                        <Text style={{ width: '95%', fontSize: fontSize }}>
                            {t('webinar:transaction_date')}:
                        </Text>
                        <Text style={{ width: '95%', fontSize: fontSize, fontWeight: 'bold', marginBottom: 10 }}>
                            {moment(dataTransaction?.last_status?.created_at).format('DD MMMM YYYY')}, {moment(dataTransaction?.last_status?.created_at).format('HH : mm')}
                        </Text>
                        <Text style={{ width: '95%', fontSize: fontSize }}>
                            {t('webinar:transaction_status')}:
                        </Text>
                        <Text style={{ width: '95%', fontSize: fontSize, fontWeight: 'bold', marginBottom: 15 }}>
                            {dataTransaction?.last_status?.mp_transaction_status_master_key}
                        </Text>
                        <View style={{ width: '95%', marginBottom: 15, borderBottomWidth: 0.25, borderColor: 'grey' }} />

                        <Text style={{ color: 'black', fontWeight: "bold", fontSize: fontSize }}>
                            {dataEvent?.title}
                        </Text>
                        <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: '2.5%', marginBottom: 15 }}>
                            <View style={{ width: '50%', flexDirection: 'row' }}>
                                <FontAwesome5
                                    name="calendar-check"
                                    color='black'
                                    size={18}
                                />
                                <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize }}>
                                    {moment(dataEvent?.event_date).format('DD MMMM YYYY')}
                                </Text>
                            </View>
                            <View style={{ width: '50%', flexDirection: 'row' }}>
                                <FontAwesome5
                                    name="clock"
                                    color='black'
                                    size={18}
                                />
                                <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize }}>
                                    {moment(dataEvent?.event_date).format('HH : mm')}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: '2.5%', marginBottom: 15, alignSelf: 'flex-start' }}>
                            {
                                dataEvent?.speakers?.map(
                                    (speaker) => {
                                        return (
                                            <View style={{ width: '50%', flexDirection: 'row' }}>
                                                <Image
                                                    source={{ uri: `${IMAGE_URL}public/cms/${speaker?.speaker?.image}` }}
                                                    style={{ height: 26, width: 26, marginBottom: 10, borderRadius: 100 }}
                                                />
                                                <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize }}>
                                                    {speaker?.speaker?.name}
                                                </Text>
                                            </View>
                                        )
                                    }
                                )
                            }
                        </View>
                        <View style={{ width: '95%', marginBottom: 15, borderBottomWidth: 0.25, borderColor: 'grey' }} />

                        <Text style={{ width: '95%', fontSize: fontSize }}>
                            {t('webinar:detail_payment')}
                        </Text>
                        <View style={{ flexDirection: 'row', marginLeft: '2.5%', marginBottom: 15 }}>
                            <View style={{ width: '50%' }}>
                                <Text style={{ color: 'black', fontWeight: "bold", fontSize: fontSize }}>
                                    {t('webinar:total_payment')}
                                </Text>
                            </View>
                            <View style={{ width: '50%', flexDirection: 'row', justifyContent: "flex-end" }}>
                                <Text style={{ color: 'black', fontWeight: "bold", fontSize: fontSize, marginRight: '5%' }}>
                                    Rp. {Currency(dataTransaction?.mp_payment?.total)}
                                </Text>
                            </View>
                        </View>
                        <Text style={{ width: '95%', fontSize: fontSize }}>
                            {t('webinar:payment_method')}:
                        </Text>
                        <Text style={{ width: '95%', fontSize: fontSize, fontWeight: 'bold', marginBottom: 50 }}>
                            {dataTransaction?.mp_payment?.last_status?.payment_type.replace(/_/g, ' ').toLowerCase().replace(/\b[a-z]/g, letter => letter.toUpperCase())}
                        </Text>
                        <TouchableOpacity
                            style={[generalStyles.shadowButton, { bottom: '5%', marginLeft: 0, position: 'relative' }]}
                            onPress={onPrint}
                        >
                            <Text style={{ color: 'white', fontSize: fontSize * 1.3 }}>{t('webinar:print_transaction')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: '95%',
        marginLeft: '2.5%',
        height: 210,
        borderWidth: 1,
        backgroundColor: '#F8931D',
        borderRadius: 10,
        marginTop: 10
    },
    headerText: {
        fontWeight: "bold",
        marginTop: 5,
        marginLeft: '2.5%',
        color: 'black',
        width: '100%'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        width: '100%',
        height: 'auto',
        marginTop: 'auto',
        bottom: '-5%',
        backgroundColor: "white",
        borderRadius: 10,
        // padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
});

export default TicketDetail