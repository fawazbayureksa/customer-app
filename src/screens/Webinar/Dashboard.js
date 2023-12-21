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
    Dimensions,
    FlatList,
    Animated,
    useWindowDimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { WebinarRouteName } from '../../constants/webinar_route/webinarRouteName';
import axiosInstance from '../../helpers/axiosInstance';
import { useTranslation } from 'react-i18next';
import { API_URL, IMAGE_URL } from '@env';
import convertCSS from '../../helpers/convertCSS';
import { useSelector } from 'react-redux';
import WebinarCarousel from './components/WebinarCarousel';
import WebinarCustomCarousel from './components/WebinarCustomCarousel';
import EventCard from './components/EventCard';
import UpcomingEventCard from './components/UpcomingEventCard';
import moment from 'moment';
import truncate from '../../helpers/truncate';

const Dashboard = ({ navigation }) => {
    const layout = useWindowDimensions();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = React.useState([]);
    const [dataBanner, setDataBanner] = useState();
    const [events, setEvents] = useState([]);
    const [eventsPopular, setEventsPopular] = useState([]);
    const [eventsYouMayLike, setEventsYouMayLike] = useState([]);
    const [myClasses, setMyClasses] = useState([]);
    const [myClass, setMyClass] = useState(null);
    const [speakers, setSpeakers] = useState([]);
    const [title, setTitle] = useState('');

    const currentDate = new Date();

    const { t } = useTranslation()

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const fontSize = convertCSS(themeSetting.body_typography.font_size);

    const widthPos = Dimensions.get('window').width;
    const scrollX = new Animated.Value(0);
    let position = Animated.divide(scrollX, widthPos);

    const functGetUpcomingEvent = (arrEvents) => {
        let upcomingEvent = null;
        arrEvents?.forEach((val, key) => {
            if ((upcomingEvent === null) && (moment(val.event_date).isAfter(currentDate)) ){
                upcomingEvent = val;
            } else if (moment(val.event_date).isAfter(currentDate) && moment(val.event_date).isBefore(upcomingEvent?.event_date)) {
                upcomingEvent = val;
            }
        })
        return upcomingEvent;
    }

    useEffect(() => {
        getDashboardBanner();
    }, []);

    const getDashboardBanner = async () => {
        setLoading(true)
        axiosInstance
            .get('webinar/dashboard/get')
            .then(res => {
                setSpeakers(res.data.data.DataSpeaker);
                setDataBanner(res.data.data.DataBanner);
                setImages(res.data.data.DataBanner.forum_banner_slide.map(banner => (
                    { filename: banner.filename }
                )))
                setEvents(res.data.data.DataEvent);
                setEventsPopular(res.data.data.DataPopular);
                setEventsYouMayLike(res.data.data.DataMaybeLike);
                setMyClasses(res.data.data.MyClassActive);
                setTitle(res.data.data.Title);
                setMyClass(functGetUpcomingEvent(res.data.data.MyClassActive));
                // console.log(res.data.data.DataPopular);
            }).catch(error => {
                console.error('error banner: ', error);
            }).finally(() => setLoading(false))
    }

    const functionNavigate = (ids) => {
        navigation.navigate(WebinarRouteName.WEBINAR_EVENT_DETAIL, { eventId: ids })
    }

    const functionNavigateToTicket = (ids) => {
        navigation.navigate(WebinarRouteName.WEBINAR_TICKET_DETAIL, { transCode: ids })
    }

    return (
        <View style={styles.Container}>
            <ScrollView>
                {(dataBanner) &&
                    <WebinarCarousel images={images} title={title} dataBanner={dataBanner} />
                }
                {/* <WebinarCustomCarousel images={images} title={title} dataBanner={dataBanner} /> */}

                {(myClass) &&
                    <>
                        <Text style={{ marginTop: 20, marginLeft: '2.5%', color: 'black', fontSize: fontSize * 1.15, fontWeight: "bold" }}>
                            {t('webinar:upcoming_event')}
                        </Text>
                        <UpcomingEventCard event={myClass} nav={() => functionNavigateToTicket(myClass.webinar_transaction.transaction_code)} />
                    </>
                }
                
                <View style={styles.whiteBackground}>
                    <View style={styles.itemLeft}>
                        <Text style={{ marginTop: 20, color: 'black', fontSize: fontSize * 1.15, fontWeight: "bold" }}>
                            {t('webinar:featured_speaker')}
                        </Text>
                    </View>
                    <View style={styles.itemRight}>
                        <TouchableOpacity onPress={() => navigation.navigate(WebinarRouteName.WEBINAR_SPEAKER_LIST)}>
                            <Text style={{ marginTop: 20, marginLeft: '2.5%', color: '#F8931D', fontSize: fontSize * 1, fontWeight: "bold" }}>
                                {t('webinar:view_all')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView horizontal={true} style={{ marginLeft: '2.5%' }}>
                    {speakers?.map((sp) => {
                        return <SpeakerMiniCard speaker={sp} navigation={navigation} key={sp.id} />
                    })}
                </ScrollView>

                <View style={styles.whiteBackground}>
                    <View style={styles.itemLeft}>
                        <Text style={{ marginTop: 20, color: 'black', fontSize: fontSize * 1.15, fontWeight: "bold" }}>
                            {t('webinar:popular_classes')}
                        </Text>
                    </View>
                    <View style={styles.itemRight}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate(WebinarRouteName.WEBINAR_EVENT_LIST)}
                        >
                            <Text style={{ marginTop: 20, marginLeft: '2.5%', color: '#F8931D', fontSize: fontSize * 1, fontWeight: "bold" }}>
                                {t('webinar:view_all')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView horizontal={true} style={{ marginLeft: '2.5%' }}>
                    {eventsPopular?.map(
                        (event) => {
                            return <EventCard event={event} nav={() => functionNavigate(event.id)} key={event.id} />
                        }
                    )}
                </ScrollView>

                <View style={styles.whiteBackground}>
                    <View style={styles.itemLeft}>
                        <Text style={{ marginTop: 20, color: 'black', fontSize: fontSize * 1.15, fontWeight: "bold" }}>
                            {t('webinar:classes')}
                        </Text>
                    </View>
                    <View style={styles.itemRight}>
                        <TouchableOpacity onPress={() => navigation.navigate(WebinarRouteName.WEBINAR_EVENT_LIST)}>
                            <Text style={{ marginTop: 20, marginLeft: '2.5%', color: '#F8931D', fontSize: fontSize * 1, fontWeight: "bold" }}>
                                {t('webinar:view_all')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView horizontal={true} style={{ marginLeft: '2.5%' }}>
                    {events?.map(
                        (event) => {
                            return <EventCard event={event} nav={() => functionNavigate(event.id)} key={event.id} />
                        }
                    )}
                </ScrollView>

                <View style={styles.whiteBackground}>
                    <View style={styles.itemLeft}>
                        <Text style={{ marginTop: 20, color: 'black', fontSize: fontSize * 1.15, fontWeight: "bold" }}>
                            {t('webinar:you_might_like')}
                        </Text>
                    </View>
                    <View style={styles.itemRight}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate(WebinarRouteName.WEBINAR_EVENT_LIST)}
                        >
                            <Text style={{ marginTop: 20, marginLeft: '2.5%', color: '#F8931D', fontSize: fontSize * 1, fontWeight: "bold" }}>
                                {t('webinar:view_all')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView horizontal={true} style={{ marginLeft: '2.5%' }}>
                    {eventsYouMayLike?.map(
                        (event) => {
                            return <EventCard event={event} nav={() => functionNavigate(event.id)} key={event.id} />
                        }
                    )}
                </ScrollView>
            </ScrollView>
        </View>
    )
}


const SpeakerMiniCard = ({speaker, navigation}) => {
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const fontSize = convertCSS(themeSetting.body_typography.font_size);
    return (
        <TouchableOpacity
            style={styles.cardSpeaker}
            onPress={() => navigation.navigate(WebinarRouteName.WEBINAR_SPEAKER_DETAIL, {speakerId:speaker.id})}
        >
            <Image
                source={{ uri: `${IMAGE_URL}public/cms/${speaker.image}` }}
                style={{ borderColor: '#F8931D', borderWidth: 3, height: 80, width: 80, borderRadius: 100, marginTop: 5, marginLeft: '7.5%' }}
            />
            <Text style={{ marginLeft: '5%', fontSize:  fontSize }}>{truncate(speaker.name)}</Text>
        </TouchableOpacity>
    )
}

export default Dashboard


const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    whiteBackground: {
        width: '100%',
        marginBottom: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    itemLeft: {
        width: '65%',
        marginTop: 10,
        marginLeft: '2.5%'
    },
    itemRight: {
        width: '30%',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: "flex-end"
    },
    cardSpeaker: {
        width: 100,
        marginVertical: 7,
        // borderColor: '#e6e6e6',
        // borderWidth: 1,
        // borderRadius: 10,
        marginRight: 10
    }
});