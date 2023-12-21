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
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import { IMAGE_URL } from "@env"
import axiosInstance from '../../../helpers/axiosInstance';
import { WebinarRouteName } from '../../../constants/webinar_route/webinarRouteName';
import colors from '../../../assets/theme/colors';
import RenderHtml from 'react-native-render-html';
import EventCard from '../components/EventCard';
import convertCSS from '../../../helpers/convertCSS';
import { useSelector } from 'react-redux';
import WebDisplay from '../../Forum/components/WebDisplay';
import { optionExpertiseLevel } from '../components/constants';
import SpeakerDiscussion from '../components/SpeakerDiscussion';

const SpeakerDetail = ({ navigation, route }) => {
    const { speakerId } = route.params;
    const [speaker, setSpeaker] = React.useState({});
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = React.useState([]);
    const [ratingArray, setRatingArray] = useState([])

    const [discuss, setDiscuss] = React.useState([]);
    const [discussText, setDiscussText] = React.useState('');
    const [replyText, setReplyText] = React.useState({});
    const [isLoadMore, setIsLoadMore] = React.useState(false);
    const [lastPage, setLastPage] = React.useState();
    const [lastPageDiscuss, setLastPageDiscuss] = React.useState();
    const [currentPageDiscuss, setCurrentPageDiscuss] = React.useState(1);
    const [currentPage, setCurrentPage] = React.useState(1);

    const initFilterDiscuss = {
        page: 1,
        per_page: 10,
        webinar_speaker_id: null,
      };

    const {t} = useTranslation();

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const fontSize = convertCSS(themeSetting.body_typography.font_size);

    const WIDTH = Dimensions.get('window').width * 0.95;

    const [filterDiscuss, setFilterDiscuss] = React.useState({
        ...initFilterDiscuss,
        webinar_speaker_id: speakerId,
      });

    useEffect(() => {
        getSpeakerInfo()
        getEventList()
        getDiscuss();
        // console.log(speakerId);
    }, []);

    const getSpeakerInfo = async () => {
        setLoading(true)
        axiosInstance
            .get(`/webinar/getSpeaker/detail/${speakerId}`)
            .then(res => {
                setSpeaker(res.data.data);
                ratingStar(parseInt(res.data.data.rating) + 1)
                // console.log(res.data.data);
            }).catch(error => {
                console.error('error banner: ', error);
            }).finally(() => setLoading(false))
    }

    const getEventList = async () => {
        let params = {
            page: 1,
            per_page: 3, //sementara
            webinar_speaker_id: speakerId
        }
        setLoading(true)
        axiosInstance
            .get(`webinar/getEvent`, { params })
            .then(res => {
                setEvents(res.data.data.data);
                // console.log(res.data.data.data);
            }).catch(error => {
                console.error('error banner: ', error);
            }).finally(() => setLoading(false))
    }

    const getDiscuss = () => {
        // console.log('filterDiscuss', filterDiscuss);
        if (!filterDiscuss.webinar_speaker_id) return;
        axiosInstance
            .get(`webinar/discussion/getWithParams`, { params: filterDiscuss })
            .then(res => {
                let data = res.data.data;
                setDiscuss(data.data);
                setLastPageDiscuss(data.last_page);
                setCurrentPageDiscuss(1);
                // console.log("discuss data ->", res.data.data);
            })
            .catch(error => {
                console.error('error getDiscuss ', error.response.data);
            });
    };

    const onPostDiscuss = () => {
        if (!discussText == '') {
            let data = {
                new_discussion: discussText,
                webinar_speaker_id: speaker.id,
            };
            axiosInstance
                .post(`webinar/discussion/new_discussion`, data)
                .then(res => {
                    setDiscussText('');
                    getDiscuss();
                })
                .catch(error => {
                    console.error('error getDiscuss ', error.response.data);
                });
        } else {
            toast.show(t('common:textCannotEmpty'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
        }
    };

    const onPostReply = id => {
        if (!replyText['reply_' + id] == '') {
            let data = {
                reply: replyText['reply_' + id],
                webinar_speaker_discussion_id: id,
            };
            axiosInstance
                .post(`webinar/discussion/reply`, data)
                .then(res => {
                    console.log(res.data.data);
                    setReplyText({});
                    getDiscuss();
                })
                .catch(error => {
                    console.error('error getDiscuss ', error.response.data);
                });
        } else {
            toast.show(t('common:textCannotEmpty'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
        }
    };

    const handlePaginationDiscuss = async () => {
        let newPage = currentPageDiscuss + 1;
        if (newPage > lastPageDiscuss) {
          return;
        } else if (isLoadMore) {
          return;
        } else {
          let params = { ...filterDiscuss, page: newPage };
          setIsLoadMore(true);
          await axiosInstance
            .get(`rwebinar/discussion/getWithParams`, { params })
            .then(res => {
              const newList = discuss.concat(res.data.data.data);
              setDiscuss(newList);
              setCurrentPageDiscuss(newPage);
            })
            .finally(() => setIsLoadMore(false));
        }
      };

    const ratingStar = (rating) => {
        let rate = []
        for (let i = 1; i <= rating; i++) {
            rate.push(i)
        }
        setRatingArray(rate)
    }

    const setOptionLabel = (val, option) => {
		let result = option.find(x=>x.value === val)
		if (result) {
			return result.label
		} else {
			return val
		}
    }

    const functionNavigate = (ids) => {
        navigation.navigate(WebinarRouteName.WEBINAR_EVENT_DETAIL, { eventId: ids })
    }

    return (
        <View style={styles.Container}>
            <ScrollView>
                <View style={[styles.orangeBackground]}>
                    <View style={[styles.itemLeft, { width: '40%' }]}>
                        <Image
                            source={{ uri: `${IMAGE_URL}public/cms/${speaker.image}` }}
                            style={{ height: 160, width: '100%', borderRadius: 100, borderColor: 'white', borderWidth: 3 }}
                        />
                    </View>
                    <View style={[styles.itemRight, { flexDirection: 'column' }]}>
                        <Text style={[styles.sectionTitle, { fontSize: fontSize * 1.3 }]}>
                            {speaker.name}
                        </Text>
                        <Text style={{ marginLeft: '5%', color: 'white', marginBottom: 5, fontSize: fontSize }}>
                            {speaker.expertise}
                        </Text>
                        <View style={{ marginLeft: '5%', backgroundColor: 'white', width: '65%', borderRadius: 50, flexDirection: 'row' }}>
                            <FontAwesome5
                                name="crown"
                                color="#F8931D"
                                size={12}
                                style={{ marginTop: '4%', marginLeft: '5%' }}
                            />
                            <Text style={{ color: '#F8931D', marginLeft: '5%', fontSize: fontSize }}>
                                {setOptionLabel(speaker.expertise_level, optionExpertiseLevel)}
                            </Text>
                        </View>

                    </View>
                </View>
                <View style={{ backgroundColor: '#F8931D' }}>
                    <View style={[styles.boxContainer]}>
                        <Text style={{ fontWeight: "bold", marginTop: 10, marginLeft: '2.5%', color: 'black', width: '100%', marginTop: '10%', fontSize: fontSize }}>
                            {t('webinar:rating')}:
                        </Text>
                        <View style={{ flexDirection: "row", width: '95%', marginLeft: '2.5%' }}>
                            <View style={{ flexDirection: "row", width: '60%'}}>
                                <Text style={{ marginRight: '2.5%', fontSize: 18, color: '#FFD600', fontWeight: 'bold' }}>
                                    {speaker.rating}
                                </Text>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Icon
                                        name='star'
                                        color={ratingArray.includes(i + 1) ? "#FFD600" : colors.pasive}
                                        size={23}
                                    />
                                ))}
                            </View>
                            <View style={{ alignItems: "flex-end", width: '40%'}}>
                                <TouchableOpacity onPress={() => {navigation.navigate(WebinarRouteName.WEBINAR_SPEAKER_LIST_REVIEW, { speakerId: speakerId })}}>
                                    <Text>
                                        Lihat Ulasan
                                    </Text>
                                </TouchableOpacity>             
                            </View>
                        </View>             
                        <View style={{ marginLeft: '2.5%', marginRight: '5%', marginTop: 15 }}>
                            <Text style={{ fontWeight: "bold", color: 'black', width: '100%', marginBottom: -10, fontSize: fontSize }}>
                                {t('webinar:biography')}:
                            </Text>
                            <WebDisplay
                                html={speaker?.bio}
                            />
                        </View>

                        <View style={{ marginBottom: '10%', width: '100%' }}>
                            {
                                (events.length > 0) ?
                                    <>
                                        <Text style={{ marginTop: 20, marginLeft: '2.5%', color: 'black', fontSize: 16, fontWeight: "bold", fontSize: fontSize }}>
                                            {t('webinar:events_from_speaker')} {speaker.name}
                                        </Text>
                                        <ScrollView horizontal={true} style={{ marginLeft: '2.5%', maxHeight: 250 }}>
                                            {events.map(
                                                (event) => {
                                                    return <EventCard event={event} nav={() => functionNavigate(event.id)} key={event.id} />
                                                }
                                            )}
                                        </ScrollView>
                                    </> :
                                    <>
                                        <Text style={{ marginTop: 20, marginLeft: '2.5%', color: 'black', fontSize: 16, fontWeight: "bold", fontSize: fontSize }}>
                                            {t('webinar:no_events_from_speaker')} {speaker.name}
                                        </Text>
                                    </>
                            }
                        </View>
                        <View style={{  width: '95%', marginLeft: '2.5%', marginTop: -20 }}>
                            <Text style={{ marginTop: 20, marginLeft: '2.5%', color: 'black', fontSize: 16, fontWeight: "bold", fontSize: fontSize }}>
                                {t('webinar:discuss_with_speaker')} {speaker.name}
                            </Text>
                            {
                                (discuss) &&
                                <>
                                    <SpeakerDiscussion
                                        isLoadMore={isLoadMore}
                                        handlePagination={handlePaginationDiscuss}
                                        discuss={discuss}
                                        setDiscussText={setDiscussText}
                                        discussText={discussText}
                                        WIDTH={WIDTH}
                                        onPostDiscuss={onPostDiscuss}
                                        setReplyText={setReplyText}
                                        replyText={replyText}
                                        onPostReply={onPostReply}
                                    />
                                </>
                            }
                        </View>
                        
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default SpeakerDetail

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column'
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    sectionTitle: {
        color: 'white',
        fontWeight: "bold",
        marginLeft: '5%', 
        width: '100%', 
        marginTop: '20%'
    },
    image: {
        width: '100%',
        height: 210,
        borderWidth: 1,
        backgroundColor: '#F8931D',
        borderRadius: 10
    },
    orangeBackground: {
        backgroundColor: '#F8931D',
        width: '100%',
        marginBottom: -100,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        zIndex: 1 //send forward/backward
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
    },
    boxContainer: {
        backgroundColor: 'white',
        width: '100%',
        marginTop: '20%',
        borderWidth: 1,
        borderColor: '#e6e6e6',
        // height: 120,
        // borderTopLeftRadius: 60,
        // borderTopRightRadius: 60,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
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
