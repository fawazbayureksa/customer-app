import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    ImageBackground,
    Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axiosInstance from '../../../helpers/axiosInstance';
import { IMAGE_URL } from "@env"
import DateTime from '../../../components/Template/Widgets/forms/DateTime';
import moment from 'moment';
import RenderHtml from 'react-native-render-html';
import WebView from 'react-native-webview';
import WebDisplay from '../../Forum/components/WebDisplay';
import { WebinarRouteName } from '../../../constants/webinar_route/webinarRouteName';
import { MainRouteName } from '../../../constants/mainRouteName';
import { generalStyles } from '../components/styles';
import convertCSS from '../../../helpers/convertCSS';
import Currency from '../../../helpers/Currency';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { optionEventType } from '../components/constants';

const WIDTH = Dimensions.get('window').width * 0.95;
const MARGINWIDTH = Dimensions.get('window').width * 0.025;

const EventDetail = ({navigation, route}) => {
    const {eventId} = route.params;
    const [event, setEvent] = React.useState({});
    const [tools, setTools] = React.useState([]);
    const [ingredients, setIngredients] = React.useState([]);
    const [benefits, setBenefits] = React.useState([]);
    const [speakers, setSpeakers] = React.useState([]);
    const [loading, setLoading] = useState(false);

    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
    const [currentDate, setCurrentDate] = useState(new Date());

    const { t } = useTranslation()

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const fontSize = convertCSS(themeSetting.body_typography.font_size);

    useEffect(() => {
        getEventInfo()
        // console.log(speakerId);
    }, []);

    const getEventInfo = () => {
        setLoading(true)
        axiosInstance
            .get(`/webinar/getEvent/detail/${eventId}`)
            .then(res => {
                setEvent(res.data.data);
                setTools(res.data.data.tools);
                setIngredients(res.data.data.ingredients);
                setBenefits(res.data.data.benefits);
                setSpeakers(res.data.data.speakers);
                // console.log("Status Transaction->", res.data.data.webinar_transaction.last_status.mp_transaction_status_master_key);
                // console.log(moment(res.data.data.max_reg_date).isAfter(currentDate));
            }).catch(error => {
                console.error('error banner: ', error);
            }).finally(() => setLoading(false))
    }

    const setOptionLabel = (val, option) => {
		let result = option.find(x=>x.value === val)
		if (result) {
			return result.label
		} else {
			return val
		}
    }

    return (
        <View style={generalStyles.container}>
            <ScrollView>
                <View style={generalStyles.boxShadowContainer}>
                    <Image
                        source={{uri: `${IMAGE_URL}public/cms/${event.image}`}}
                        style={generalStyles.imageDetailEvent}
                    />
                    <View style={generalStyles.backgroundCard}>
                        <Text style={[generalStyles.sectionTitle, { fontSize: convertCSS(themeSetting.h4_typography.font_size) }]}>
                            {event.title}
                        </Text>
                    </View>
                    {
                        ((moment(event.price_sale_start).isBefore(currentDate)) && (moment(event.price_sale_end).isAfter(currentDate))) ?
                            <>
                                <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: '2.5%', marginBottom: 10, width: '100%' }}>
                                    <View style={{ backgroundColor: '#ffc385', borderRadius: 10, width: '15%' }}>
                                        <Text style={{ marginLeft: '20%', color: '#ff8000', fontSize: fontSize * 1.2 }}>
                                            {Number.parseInt((event.price_normal - event.price_sale) / event.price_normal * 100)}%
                                        </Text>
                                    </View>
                                    <Text style={{ marginLeft: '5%', color: 'grey', textDecorationLine: 'line-through', fontSize: fontSize * 0.75, marginTop: '2%' }}>
                                        Rp. {Currency(event.price_normal)}
                                    </Text>
                                    <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize * 1.3, fontWeight: "bold" }}>
                                        Rp. {Currency(event.price_sale)}
                                    </Text>
                                </View>
                            </> :
                            <>
                                <View style={{ flexDirection: 'row', marginLeft: '2.5%', marginBottom: 10, width: '100%' }}>
                                    <Text style={{ color: 'black', fontSize: fontSize * 1.3, fontWeight: "bold" }}>
                                        Rp. {Currency(event.price_normal)}
                                    </Text>
                                </View>
                            </>
                    }
                    <View style={{ flexDirection: 'row', marginLeft: '3%' }}>
                        <FontAwesome5
                            name="clock"
                            color={themeSetting?.accent_color?.value}
                            size={18}
                            // style={{ marginTop: '2%' }}
                        />
                        <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize }}>
                            {moment(event.event_date).format('HH : mm')}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: '5%' }}>
                        <FontAwesome5
                            name="calendar-check"
                            color={themeSetting?.accent_color?.value}
                            size={18}
                            // style={{ fontWeight: 'bold' }}
                        />
                        <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize }}>
                            {moment(event.event_date).format('DD MMMM YYYY')}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: '2.5%', marginTop: 10 }}>
                        <Ionicons
                            name="location"
                            color={themeSetting?.accent_color?.value}
                            size={18}
                            // style={{ fontWeight: "bold" }}
                        />
                        <Text style={{ marginLeft: '2.5%', color: 'black', fontSize: fontSize, width: '40%' }}>
                            {setOptionLabel(event.event_type, optionEventType)}
                        </Text>
                    </View>
                    {/* <View style={[generalStyles.backgroundCard, {marginLeft: '2.5%', marginTop: 15}]}>
                        <View style={{width: '50%', flexDirection: 'row'}}>
                            <AntDesign
                                name="like2"
                                color="grey"
                                size={24}
                            />
                            <Text style={{marginLeft: '5%', marginTop: '2%'}}>25</Text>
                        </View>
                        <View style={{width: '50%', flexDirection: 'row', justifyContent: "flex-end"}}>
                            <AntDesign
                                name="sharealt"
                                color="grey"
                                size={24}
                                style={{ marginRight: '5%' }}
                            />
                            <Text style={{marginRight: '15%', marginTop: '2%'}}>Bagikan</Text>
                        </View>
                    </View> */}
                </View>

                <View style={generalStyles.boxShadowContainer}>
                    <Text style={[styles.sectionTitle, {marginLeft: '2.5%', width: '100%', fontSize: fontSize*1.1}]}>
                        {t('webinar:featured_speaker')}
                    </Text>
                    {speakers.map(
                            (speaker)=>{
                                return (
                                    <View style={generalStyles.backgroundCard} key={speaker.id}>
                                        <View style={[styles.itemLeft, { width: '20%' }]}>
                                            <Image
                                                source={{uri: `${IMAGE_URL}public/cms/${speaker.speaker.image}`}}
                                                style={{ height: 70, width: 70, marginBottom: 10, borderRadius: 100 }}
                                            />
                                        </View>
                                        <View style={[styles.itemRight, { flexDirection: 'column' }]}>
                                            <Text style={{ fontWeight: "bold", marginTop: 10, marginLeft: '5%', fontSize: fontSize }}>
                                                {speaker.speaker.name}
                                            </Text>
                                            <Text style={{ marginLeft: '5%', fontSize: fontSize }}>
                                                {speaker.speaker.expertise}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            }
                        )}
                </View>

                <View style={[generalStyles.boxShadowContainer, {marginBottom: '15%'}]}>
                    <Text style={{ fontWeight: "bold", marginTop: 10, marginLeft: '2.5%', color: 'black', width: '100%', fontSize: fontSize }}>
                        {t('webinar:registration_deadline')}:
                    </Text>
                    <Text style={{ marginLeft: '2.5%', marginBottom: 15 }}>
                        {/* 26 Juni 2022 */}
                        {moment(event.max_reg_date).format('DD MMMM YYYY')}
                    </Text>
                    <Text style={{ fontWeight: "bold", marginTop: 10, marginLeft: '2.5%', color: 'black', width: '100%', fontSize: fontSize }}>
                        {t('webinar:level')}:
                    </Text>
                    <Text style={{ marginLeft: '2.5%', marginBottom: 15 }}>
                        {event.event_level}
                    </Text>
                    
                    <View style={{ marginLeft: '2.5%', marginRight: '2.5%', width: '95%', marginTop: 10, marginBottom: 15 }}>
                        <Text style={{ fontWeight: "bold", color: 'black', width: '100%', marginBottom: -10, fontSize: fontSize }}>
                            {t('webinar:description')}:
                        </Text>
                        <WebDisplay
                            html={event?.description}
                        />
                    </View>

                    <View style={{ width: '50%' }}>
                        <Text style={{ fontWeight: "bold", marginLeft: '5%', color: 'black', width: '100%', fontSize: fontSize }}>
                            {t('webinar:tools')}:
                        </Text>
                        {tools.map(
                            (tool)=>{
                                return (
                                    <Text key={tool.id} style={{ marginLeft: '5%', width: '100%', fontSize: fontSize*0.85 }}>
                                        - {tool.name}
                                    </Text>
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
                        {ingredients.map(
                            (ingredient) => {
                                return (
                                    <>
                                        <Text key={ingredient.id} style={{ marginLeft: '5%', fontSize: fontSize * 0.85 }}>
                                            - {ingredient.name}
                                        </Text>
                                    </>
                                )
                            }
                        )}
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <Text style={{
                            fontWeight: "bold",
                            marginLeft: '10%',
                            color: 'black',
                            width: '100%',
                            fontSize: fontSize
                        }}>
                            {t('webinar:benefits')}:
                        </Text>
                        {benefits.map(
                            (benefit) => {
                                return (
                                    <Text key={benefit.id} style={{ marginLeft: '10%', fontSize: fontSize*0.85 }}>
                                        - {benefit.name}
                                    </Text>
                                )
                            }
                        )}
                    </View>

                </View>
            </ScrollView>
            {
                (!isLoggedIn) ?
                    <>
                        <TouchableOpacity
                            style={generalStyles.shadowButtonDisabled}
                            onPress={() => navigation.navigate(MainRouteName.LOGIN)}
                        >
                            <Text style={{ color: 'white', fontSize: fontSize * 1.3 }}>{t('webinar:login_to_continue')}</Text>
                        </TouchableOpacity>
                    </> :

                    ((moment(event?.max_reg_date).isBefore(currentDate)) || (event?.webinar_transaction?.last_status?.mp_transaction_status_master_key !== "complete")) ? // Sebelumnya pakai event?.event_date
                        <TouchableOpacity
                            style={generalStyles.shadowButton}
                            onPress={() => navigation.navigate(WebinarRouteName.WEBINAR_BUY_TICKET, { eventId: eventId })}
                        >
                            <Text style={{ color: 'white', fontSize: fontSize * 1.3 }}>{t('webinar:buy_ticket')}</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity
                            style={generalStyles.shadowButtonDisabled}
                        >
                            <Text style={{ color: 'white', fontSize: fontSize * 1.3 }}>{t('webinar:event_not_available')}</Text>
                        </TouchableOpacity>
            }
            
        </View>
    )
}

export default EventDetail

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    sectionTitle: {
        marginTop: 10,
        color: 'black',
        fontWeight: "bold", 
        marginLeft: '2.5%'
    },
    itemLeft: {
        width: '10%',
        marginTop: 10,
        marginLeft: '2.5%'
    },
    itemRight: {
        width: '50%',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: "flex-start"
    }
});
