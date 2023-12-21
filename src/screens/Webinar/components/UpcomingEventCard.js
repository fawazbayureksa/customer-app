import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Image
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { IMAGE_URL } from "@env";
import moment from 'moment';
import convertCSS from '../../../helpers/convertCSS';
import Currency from '../../../helpers/Currency';
import truncate from '../../../helpers/truncate';
import DateTime from '../../../components/Template/Widgets/forms/DateTime';
import { optionEventType } from './constants';
import { useSelector } from 'react-redux';

const UpcomingEventCard = ({ event, nav }) => {
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const fontSize = convertCSS(themeSetting.body_typography.font_size);
    const imageSource = event?.image;
    const speakers = event?.speakers;

    const setOptionLabel = (val, option) => {
        let result = option.find(x => x.value === val)
        if (result) {
            return result.label
        } else {
            return val
        }
    }

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={nav}
        >
            <View style={{ width: '40%' }}>
                <Image
                    source={{uri: `${IMAGE_URL}public/cms/${imageSource}`}}
                    style={{ height: 80, width: '100%', margin: 5, borderRadius: 10 }}
                />
            </View>
            <View style={{ justifyContent: "flex-start", width: '55%', flexDirection: 'column', marginTop: 5, marginLeft: 5 }}>
                <Text style={{ marginLeft: '5%', color: 'white', fontSize: 16, fontWeight: "bold" }}>
                    {truncate(event?.title)}
                </Text>
                <Text style={{ marginLeft: '5%', color: 'white', fontSize: 13 }}>
                    Oleh: {speakers[0].speaker.name}
                </Text>
                <View style={{ flexDirection: 'row', marginLeft: '5%' }}>
                    <FontAwesome5
                        name="calendar"
                        color="white"
                        size={12}
                        style={{ marginTop: '2%' }}
                    />
                    <Text style={{ marginLeft: '5%', color: 'white', fontSize: 13 }}>
                        {moment(event.event_date).format('DD MMMM YYYY')}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: '5%' }}>
                    <FontAwesome5
                        name="clock"
                        color="white"
                        size={12}
                        style={{ marginTop: '2%' }}
                    />
                    <Text style={{ marginLeft: '5%', color: 'white', fontSize: 13 }}>
                        {moment(event.event_date).format('HH:mm')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        marginLeft: '2.5%',
        width: '95%',
        marginTop: 10,
        backgroundColor: '#F8931D',
        // height: 120,
        borderRadius: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
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
});

export default UpcomingEventCard