import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    ImageBackground
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

const WIDTH = Dimensions.get('window').width * 0.47;

const TicketCard = ({ticket, nav}) => {
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const currentDate = new Date(); 
    const fontSize = convertCSS(themeSetting.body_typography.font_size);
    const imageSource = ticket.webinar_event?.image;

    const setOptionLabel = (val, option) => {
		let result = option.find(x=>x.value === val)
		if (result) {
			return result.label
		} else {
			return val
		}
    }
    return (
        <TouchableOpacity onPress={nav}>
            <View style={generalStyles.ticketCardButtonContainer}>
                <ImageBackground
                    source={{ uri: `${IMAGE_URL}public/cms/${imageSource}` }}
                    style={styles.image}>
                    
                    <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 15 }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ backgroundColor: '#F8931D', width: '50%', textAlign: 'center', marginLeft: '2.5%', borderRadius: 5, color: 'white', fontSize: fontSize }}>
                                {setOptionLabel(ticket.webinar_event?.event_type, optionEventType)}
                            </Text>
                        </View>
                        <View style={{ width: '50%', flexDirection: 'row', justifyContent: "flex-end" }}>
                            {
                                ((moment(ticket?.webinar_event?.event_date).isAfter(currentDate)) && (ticket?.last_status?.mp_transaction_status_master_key === 'complete')) ?
                                    <>
                                        <Text style={{ backgroundColor: '#6FC32E', width: 'auto', textAlign: 'center', marginRight: '5%', borderRadius: 5, color: 'white', fontSize: fontSize }}>
                                            Active
                                        </Text>
                                    </> : (ticket?.last_status?.mp_transaction_status_master_key === 'cancelled') ?
                                        <>
                                            <Text style={{ backgroundColor: 'red', width: 'auto', textAlign: 'center', marginRight: '5%', borderRadius: 5, color: 'white', fontSize: fontSize }}>
                                                {ticket?.last_status?.mp_transaction_status_master_key}
                                            </Text>
                                        </> :
                                        <>
                                            <Text style={{ backgroundColor: '#6FC32E', width: 'auto', textAlign: 'center', marginRight: '5%', borderRadius: 5, color: 'white', fontSize: fontSize }}>
                                                {ticket?.last_status?.mp_transaction_status_master_key}
                                            </Text>
                                        </>
                            }
                            
                        </View>
                    </View>
                </ImageBackground>
                <Text style={{ fontWeight: "bold", marginTop: 10, marginLeft: '2.5%', color: 'black', width: '100%', marginBottom: 5, fontSize: fontSize*1.1 }}>
                    {ticket.webinar_event?.title}
                </Text>
                <Text style={{ marginLeft: '2.5%', color: 'black', width: '100%', marginBottom: 5, fontSize: fontSize*0.9 }}>
                    {t('webinar:bySpeaker')}: {ticket?.webinar_event?.speakers[0]?.speaker?.name}
                </Text>
                <View style={{ flexDirection: 'row', marginLeft: '3%' }}>
                    <FontAwesome5
                        name="clock"
                        color="black"
                        size={12}
                        style={{ marginTop: '2%' }}
                    />
                    <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize*0.8 }}>
                        {moment(ticket.webinar_event?.event_date).format('HH : mm')}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: '3%' }}>
                    <FontAwesome5
                        name="calendar"
                        color="black"
                        size={12}
                        style={{ marginTop: '2%' }}
                    />
                    <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize*0.8 }}>
                        {moment(ticket.webinar_event?.event_date).format('DD MMMM YYYY')}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: '2.5%', marginTop: 5, marginBottom: 10 }}>
                    <Ionicons
                        name="location"
                        color="black"
                        size={16}
                    />
                    {
                        (ticket?.webinar_event?.venue) &&
                        <Text style={{ marginLeft: '1%', color: 'black', fontSize: fontSize * 0.8, width: '95%' }}>
                            {truncate(ticket?.webinar_event?.venue)}
                        </Text>
                    }
                    
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 210,
        borderRadius: 10
    }
});

export default TicketCard