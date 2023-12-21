import React, { useState, useEffect, useContext } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    TextInput
} from 'react-native';
import convertCSS from '../../../helpers/convertCSS';
import axiosInstance from '../../../helpers/axiosInstance';
import colors from '../../../assets/theme/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { WebinarRouteName } from '../../../constants/webinar_route/webinarRouteName';
import { IMAGE_URL } from "@env";
import {useTranslation} from 'react-i18next';

const WIDTH = Dimensions.get('window').width * 0.95;

const WebinarReview = ({ navigation, route }) => {
    const { eventId } = route.params;
    const { transId } = route.params;
    const [indexSpeaker, setIndexSpeaker] = useState(0);
    const [dataSpeakers, setDataSpeakers] = useState([]);
    const [speakersRating, setSpeakersRating] = useState([]);
    // const [ratingObject, setRatingObject] = useState({});

    const [reviewInput, setReviewInput] = useState('');
    const [ratingInput, setRatingInput] = useState();
    const [submitting, setSubmitting] = useState();

    const [rating, set_rating] = useState([])
    
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const {t} = useTranslation();

    const fontSize = convertCSS(themeSetting.body_typography.font_size);

    useEffect(() => {
        getMasterData();
    }, [indexSpeaker])

    useEffect(() => {
        setArrSpeakers();
    }, [ratingInput, reviewInput])

    const getMasterData = () => {
        let params = {
            webinar_event_id: eventId
        }
        axiosInstance
        .get(`webinar/rating/getMasterData`, { params })
        .then(res => {
            // console.log(res.data.data[0]);
            setDataSpeakers(res.data.data)
        }).catch(error => {
            // console.error('error review: ', error);
            console.log('error review: ', error);
        }).finally()
    }

    const setArrSpeakers = () => {
        let tempObjRating = {};
        tempObjRating.speaker_id = dataSpeakers[indexSpeaker]?.id;
        tempObjRating.rating = ratingInput;
        tempObjRating.review = reviewInput;
        // setRatingObject(tempObjRating);

        let tempArr = speakersRating;
        tempArr[indexSpeaker] = tempObjRating;
        setSpeakersRating(tempArr);
        // setRatingObject({});
        // console.log(tempArr)
    }

    const nextSpeaker = () => {
        // if ((indexSpeaker + 1) >= speakersRating.length){
        //     return;
        // }
        let tempIndex = indexSpeaker;
        tempIndex += 1;
        setIndexSpeaker(tempIndex);
        setReviewInput(null);
        ratingProduct(null);
    }

    const validate = () => {
        //belum dikasih validasi
    }

    const submitReview = () => {
        // if(!validate()) return
        setSubmitting(true);
        // nextSpeaker();
        // return

        let data = {
            transaction_id: transId,
            speaker_rating: speakersRating
        }
        // console.log(data);
        // return;
        axiosInstance
            .post(`webinar/rating/save`, data)
            .then(res => {
                console.log(res.data.data)
                navigation.navigate(WebinarRouteName.WEBINAR_DASHBOARD)
            }).catch((error) => {
                console.log(error)
                // console.error('error: ', error.response.data.message);
            }).finally(() => {
                setSubmitting(false)
            })
    }

    const ratingProduct = (rating) => {
        let rate = []
        for (let i = 1; i <= rating; i++) {
            rate.push(i)
        }
        set_rating(rate)
        setRatingInput(rating);
    }


    return (
        <View style={styles.Container}>
            <ScrollView>
                <View style={{ alignItems: 'center', }}>
                    <Image
                        source={{ uri: `${IMAGE_URL}public/cms/${dataSpeakers[indexSpeaker]?.image}` }}
                        style={styles.image}
                    />
                    <Text style={{ fontSize: fontSize * 1.4, color: '#F8931D', marginTop: 15, fontWeight: "bold" }}>
                        {dataSpeakers[indexSpeaker]?.name}
                    </Text>
                    <Text style={{ fontSize: fontSize * 0.92, marginTop: 10, textAlign: 'center' }}>
                        {t('webinar:review_rating_experience')} {dataSpeakers[indexSpeaker]?.name}?
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 10 }}>
                        {[1, 2, 3, 4, 5].map((rate, i) => (
                            <TouchableOpacity onPress={() => ratingProduct(rate)}>
                                <Icon
                                    name='star'
                                    color={rating.includes(i + 1) ? "#FFD600" : colors.pasive}
                                    size={48}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={{ fontWeight: "bold", marginTop: 5, marginLeft: '5%', color: 'black', width: '100%', fontSize: fontSize }}>
                        {t('webinar:review_experience')}:
                    </Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderRadius: 2,
                            width: WIDTH * 0.95,
                            color: '#000000',
                            backgroundColor: '#FFFFFF',
                            borderColor: '#DCDCDC',
                            multiline: true,
                            textAlignVertical: "top"
                            
                        }}
                        // placeholder=''
                        onChangeText={text => setReviewInput(text)}
                        value={reviewInput}
                        numberOfLines={3}
                    />
                </View>
            </ScrollView>
            {
                ((indexSpeaker + 1) >= dataSpeakers.length) ?
                    <>
                        <TouchableOpacity
                            style={styles.button}
                            // onPress={() => navigation.navigate(WebinarRouteName.WEBINAR_BUY_TICKET, {eventId:eventId})}
                            onPress={submitReview}
                        >
                            <Text style={{ color: 'white', fontSize: fontSize * 1.3 }}>Berikan Ulasan</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                        <TouchableOpacity
                            style={styles.button}
                            // onPress={() => navigation.navigate(WebinarRouteName.WEBINAR_BUY_TICKET, {eventId:eventId})}
                            onPress={nextSpeaker}
                        >
                            <Text style={{ color: 'white', fontSize: fontSize * 1.3 }}>Selanjutnya</Text>
                        </TouchableOpacity>
                    </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginLeft: '2.5%',
        width: WIDTH,
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    image: {
        width: WIDTH*0.55,
        height: WIDTH*0.55,
        borderWidth: 1,
        borderColor: '#F8931D', 
        borderWidth: 5,
        borderRadius: WIDTH,
        marginTop: 25
    },
    cardSpeaker: {
        width: 100,
        marginVertical: 7,
        marginRight: 10
    },
    button: {
        backgroundColor: '#F8931D',
        width: '90%',
        marginLeft: '5%',
        bottom: '2.5%',
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute'
    }
});

export default WebinarReview