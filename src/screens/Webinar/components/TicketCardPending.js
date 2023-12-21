import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    ImageBackground,
    Linking
} from 'react-native';
import { IMAGE_URL } from "@env";
import moment from 'moment';
import convertCSS from '../../../helpers/convertCSS';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { optionEventType } from './constants';
import { t } from 'i18next';
import { generalStyles } from './styles';
import truncate from '../../../helpers/truncate';
import { WebinarRouteName } from '../../../constants/webinar_route/webinarRouteName';

const WIDTH = Dimensions.get('window').width * 0.47;

const TicketCardPending = ({navigation, ticket, handleCancel}) => {
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const fontSize = convertCSS(themeSetting.body_typography.font_size);

    const setOptionLabel = (val, option) => {
		let result = option.find(x=>x.value === val)
		if (result) {
			return result.label
		} else {
			return val
		}
    }

    const cancelOrder = (id) => {
        
    }

    const navigateToEventDetail = (id) => {
        if (!id){
            return;
        }
        navigation.navigate(WebinarRouteName.WEBINAR_EVENT_DETAIL, 
            { eventId: id })
    }

    const handleHowToPay = (ticket) => {
        if (!ticket.midtrans_pdf){
            return;
        }
        Linking.openURL(getUrl(ticket.midtrans_pdf?.link))
    }

    return (
        <View style={generalStyles.ticketCardButtonContainer}>
            <ImageBackground
                source={{ uri: `${IMAGE_URL}public/cms/${ticket?.webinar_payment_transactions[0]?.webinar_transaction?.webinar_event?.image}` }}
                style={styles.image}>
                <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 15 }}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ backgroundColor: '#F8931D', width: '50%', textAlign: 'center', marginLeft: '2.5%', borderRadius: 5, color: 'white', fontSize: fontSize }}>
                            {setOptionLabel(ticket?.webinar_payment_transactions[0]?.webinar_transaction?.webinar_event?.event_type, optionEventType)}
                        </Text>
                    </View>
                    <View style={{ width: '50%', flexDirection: 'row', justifyContent: "flex-end" }}>
                        <Text style={{ backgroundColor: 'red', width: 'auto', textAlign: 'center', marginRight: '5%', borderRadius: 5, color: 'white', fontSize: fontSize }}>
                            {t(`webinar:${ticket?.last_status?.status}`)}
                        </Text>
                    </View>
                </View>
            </ImageBackground>
            <Text style={{ fontWeight: "bold", marginTop: 10, marginLeft: '2.5%', color: 'black', width: '100%', marginBottom: 5, fontSize: fontSize * 1.1 }}>
                {ticket?.webinar_payment_transactions[0]?.webinar_transaction?.webinar_event?.title}
            </Text>
            <Text style={{ marginLeft: '2.5%', color: 'black', width: '100%', marginBottom: 5, fontSize: fontSize * 0.9 }}>
                {t('webinar:bySpeaker')}: {ticket?.webinar_payment_transactions[0]?.webinar_transaction?.webinar_event?.speakers[0]?.speaker?.name}
            </Text>
            <View style={{ flexDirection: 'row', marginLeft: '3%' }}>
                <FontAwesome5
                    name="clock"
                    color="black"
                    size={12}
                    style={{ marginTop: '2%' }}
                />
                <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize * 0.8 }}>
                    {moment(ticket?.webinar_payment_transactions[0]?.webinar_transaction?.webinar_event?.event_date).format('HH : mm')}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: '3%' }}>
                <FontAwesome5
                    name="calendar"
                    color="black"
                    size={12}
                    style={{ marginTop: '2%' }}
                />
                <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize * 0.8 }}>
                    {moment(ticket?.webinar_payment_transactions[0]?.webinar_transaction?.webinar_event?.event_date).format('DD MMMM YYYY')}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: '2.5%', marginTop: 5, marginBottom: 10 }}>
                <Ionicons
                    name="location"
                    color="black"
                    size={16}
                />
                {(ticket?.webinar_payment_transactions[0]?.webinar_transaction?.webinar_event?.venue) &&
                    <Text style={{ marginLeft: '1%', color: 'black', fontSize: fontSize * 0.8, width: '95%' }}>
                        {truncate(ticket?.webinar_payment_transactions[0]?.webinar_transaction?.webinar_event?.venue)}
                    </Text>}
            </View>
            {
                (ticket.last_status?.status === 'pending') ?
                    <>
                        <TouchableOpacity
                            style={[styles.buttonPaymentStyle]}
                            onPress={() => navigation.navigate(WebinarRouteName.WEBINAR_CHECKOUT, {
                                invoice: ticket.invoice_number
                            })}
                        >
                            <Text style={{ color: '#F8931D', fontSize: fontSize * 1.3 }}>{t('webinar:proceed_to_buy')}</Text>
                        </TouchableOpacity>
                    </> : (ticket.last_status?.status === 'waiting_for_upload') ?
                        <>
                            <TouchableOpacity
                                style={[styles.buttonPaymentStyle]}
                                onPress={() => navigation.navigate(WebinarRouteName.WEBINAR_WAITING_PAYMENT, {
                                    id: ticket.mp_payment_destination.id
                                })}
                            >
                                <Text style={{ color: '#F8931D', fontSize: fontSize * 1.3 }}>{t('webinar:proceed_to_buy')}</Text>
                            </TouchableOpacity>
                        </> : (ticket.last_status?.status === 'waiting_for_payment') ?
                            <>
                                <TouchableOpacity
                                    style={[styles.buttonPaymentStyle]}
                                    onPress={() => handleHowToPay(ticket)}
                                >
                                    <Text style={{ color: '#F8931D', fontSize: fontSize * 1.3 }}>{t('webinar:how_to_buy')}</Text>
                                </TouchableOpacity>
                            </> :
                            <>
                            </>
            }
            
            {
                (ticket.last_status?.status !== 'expired') ?
                    <>
                        <TouchableOpacity
                            style={[styles.buttonPaymentStyle, {borderColor: 'grey'}]}
                            onPress={() => navigation.navigate(WebinarRouteName.WEBINAR_TICKET_DETAIL, {transCode:ticket?.webinar_payment_transactions[0]?.webinar_transaction?.transaction_code})}
                        >
                            <Text style={{ color: 'grey', fontSize: fontSize * 1.3 }}>{t(`webinar:detail_transaction`)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.buttonCancelStyle]}
                            onPress={handleCancel}
                        >
                            <Text style={{ color: 'red', fontSize: fontSize * 1.3 }}>{t(`webinar:cancel_order`)}</Text>
                        </TouchableOpacity>
                    </> :
                    <>
                        <TouchableOpacity
                            style={[styles.buttonCancelStyle, {borderColor: 'grey'}]}
                            onPress={() => navigateToEventDetail(ticket?.webinar_payment_transactions[0]?.webinar_transaction?.webinar_event?.id)}
                        >
                            <Text style={{ color: 'grey', fontSize: fontSize * 1.3 }}>{t(`webinar:buy_again`)}</Text>
                        </TouchableOpacity>
                    </>
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        // marginLeft: '5%',
        // width: '90%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#e6e6e6',
        // height: 120,
        borderRadius: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    image: {
        width: '100%',
        height: 210,
        borderRadius: 10
    },
    buttonPaymentStyle: {
        // backgroundColor: '#F8931D',
        borderColor: '#F8931D',
        borderWidth: 2,
        width: '95%',
        marginLeft: '2.5%',
        marginBottom: 7.5,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonCancelStyle: {
        // backgroundColor: '#F8931D',
        borderColor: 'red',
        borderWidth: 2,
        width: '95%',
        marginLeft: '2.5%',
        marginBottom: 7.5,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default TicketCardPending