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
    Dimensions,
    TextInput
} from 'react-native';
import { WebinarRouteName } from '../../../constants/webinar_route/webinarRouteName';
import axiosInstance from '../../../helpers/axiosInstance';
import moment from 'moment';
import convertCSS from '../../../helpers/convertCSS';
import {API_URL, IMAGE_URL} from '@env';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Currency from '../../../helpers/Currency';
import {useTranslation} from 'react-i18next';

const WIDTH = Dimensions.get('window').width * 0.95;

const BuyTicket = ({ navigation, route }) => {

    const {eventId} = route.params;
    const [event, setEvent] = useState({});
    const [loading, setLoading] = useState(false);
    const [dataParticipant, setDataParticipant] = useState([{name: null, email: null}]);
    const [name, setName] = React.useState(null);
    const [email, setEmail] = React.useState(null);

    const { t } = useTranslation()
    const [currentDate, setCurrentDate] = useState(new Date());

    //validation
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const fontSize = convertCSS(themeSetting.body_typography.font_size);

    useEffect(() => {
        getEventInfo()
        // console.log(speakerId);
    }, []);

    const getEventInfo = async () => {
        setLoading(true)
        axiosInstance
            .get(`/webinar/getEvent/detail/${eventId}`)
            .then(res => {
                setEvent(res.data.data);
                // console.log(res.data.data);
            }).catch(error => {
                console.error('error banner: ', error);
            }).finally(() => setLoading(false))
    }

    const validate = () => {
        let validate = true;
        if (name === null || name === ''){
            setNameError(true);
            validate = false;
        } else {
            setNameError(false);
        }
        if (email === null || email === ''){
            setEmailError(true);
            validate = false;
        } else {
            setEmailError(false);
        }
        return validate;
    }

    const handleTransaction = () => {
        if(!validate()) {
            return
        } 
        // console.error('error transaction: ');
        // console.log('error transaction: ');

        let data = {
            webinar_event_id: eventId,
            data_participant: [{
                name: name,
                email: email
            }]
        }
        // console.log(data);
        // return
        axiosInstance
            .post(`webinar/transaction/save`, data)
            .then(res => {
                console.log(res.data.data)
                navigation.navigate(WebinarRouteName.WEBINAR_CHECKOUT, {
                    invoice: res.data.data
                })
            }).catch(error => {
                console.error('error transaction: ', error.response.data.message);
            }).finally(() => {

            })
    }

    return (
        <View style={styles.Container}>
            <ScrollView>
                <View style={styles.boxContainer}>
                    <Image
                        source={{uri: `${IMAGE_URL}public/cms/${event.image}`}}
                        style={styles.image}
                    />
                    <Text style={{ fontWeight: "bold", marginTop: 10, marginLeft: '2.5%', color: 'black', width: '100%', marginBottom: 5, fontSize: fontSize*1.2 }}>
                        {event.title}
                    </Text>
                    <View style={{ flexDirection: 'row', marginLeft: '3%' }}>
                        <FontAwesome5
                            name="calendar"
                            color="black"
                            size={12}
                            style={{ marginTop: '2%' }}
                        />
                        <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize*0.8 }}>
                            {moment(event.event_date).format('DD MMMM YYYY')}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: '3%' }}>
                        <FontAwesome5
                            name="clock"
                            color="black"
                            size={12}
                            style={{ marginTop: '2%' }}
                        />
                        <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize*0.8 }}>
                            {moment(event.event_date).format('HH : MM')}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: '2.5%', marginTop: 5 }}>
                        <Ionicons
                            name="location"
                            color="black"
                            size={16}
                        />
                        <Text style={{ marginLeft: '1%', color: 'black', fontSize: fontSize*0.8, width: '95%' }}>
                            {/* Kitchen Aid, Central Park, Jl. Letnan S Parman Podomoro City */}
                            {event.studio}
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
                    
                </View>
                <View style={[styles.boxContainer, {marginBottom: '20%'}]}>
                    {dataParticipant.map((pForm, index) => (
                        <>
                            <Text style={{
                                marginTop: 10,
                                marginLeft: '2.5%',
                                color: 'black',
                                width: '100%',
                                fontSize: fontSize
                            }}>
                                {t('webinar:participant_name')}:
                            </Text>
                            <TextInput
                                style={ styles.textInput }
                                value={name}
                                onChangeText={value => setName(value)}
                                numberOfLines={1}
                            />
                            {(nameError) &&
                                <Text style={{ color: 'red', marginLeft: '2.5%' }}>
                                    {t('webinar:name_validation')}:
                                </Text>
                            }
                            <Text style={{ marginTop: 10, marginLeft: '2.5%', color: 'black', width: '100%', fontSize: fontSize }}>
                                {t('webinar:participant_email')}:
                            </Text>
                            <TextInput
                                style={[styles.textInput, { marginBottom: 10 }]}
                                value={email}
                                onChangeText={value=>setEmail(value)}
                                numberOfLines={1}
                            />
                            {(emailError) &&
                                <Text style={{ color: 'red', marginLeft: '2.5%' }}>
                                    {t('webinar:email_validation')}:
                                </Text>
                            }
                        </>
                    ))}
    
                    <View style={styles.orangeBox}>
                        <FontAwesome5
                            name="info-circle"
                            color="#F8931D"
                            size={18}
                            style={{
                                marginTop: '2.5%',
                                marginRight: '2.5%',
                                marginLeft: '2.5%',
                                marginTop: '5%',
                                marginBottom: '2.5%'
                            }}
                        />
                        <Text style={{ marginLeft: '1%', fontSize: 14, width: '90%', marginTop: '2.5%', marginBottom: '2.5%', fontSize: fontSize }}>
                            {t('webinar:buy_ticket_warning')}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={{backgroundColor: 'white', flexDirection: 'row'}}>
                <View style={{width: '50%'}}>
                    <Text style={{ marginTop: 10, marginLeft: '10%', width: '100%', fontSize: fontSize }}>
                        {t('webinar:total_payment')}:
                    </Text>
                    {/* <Text style={{ marginLeft: '10%', marginBottom: 15, color: 'black',fontWeight: "bold", fontSize: fontSize*1.15 }}>
                        Rp. {event.price_sale*dataParticipant.length}
                    </Text> */}
                    {
                        ((moment(event.price_sale_start).isBefore(currentDate)) && (moment(event.price_sale_end).isAfter(currentDate))) ?
                            <>
                                <Text style={{ marginLeft: '10%', marginBottom: 15, color: 'black', fontWeight: "bold", fontSize: fontSize * 1.15 }}>
                                    Rp. {event.price_sale}
                                </Text>
                            </> :
                            <>
                                <Text style={{ marginLeft: '10%', marginBottom: 15, color: 'black', fontWeight: "bold", fontSize: fontSize * 1.15 }}>
                                    Rp. {event.price_normal}
                                </Text>
                            </>
                    }
                </View>
                <View style={{ width: '50%', alignItems: 'flex-end' }}>
                    <TouchableOpacity style={styles.button}
                        onPress={handleTransaction}
                    >
                        <Text style={[styles.textPrice, { color: 'white', fontSize: fontSize*1.3 }]}>{t('webinar:checkout')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        marginLeft: '2.5%',
        width: '95%',
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
        width: '80%',
        marginRight: '10%',
        marginTop: 15,
        bottom: '2.5%',
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 5,
        height: 40,
        width: WIDTH * 0.95,
        multiline: false,
        borderColor: 'grey',
        textAlignVertical: "top", 
        marginLeft: '2.5%'
    },
    orangeBox:{
        flexDirection: 'row',
        width: '90%',
        borderRadius: 7,
        backgroundColor: '#FFF0CA',
        marginLeft: '5%',
        marginTop: 25,
        marginBottom: 10
    },
});

export default BuyTicket