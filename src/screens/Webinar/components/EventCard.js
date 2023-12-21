import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    ImageBackground
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

const WIDTH = Dimensions.get('window').width * 0.47;

const EventCard = ({ event, nav }) => {
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const currentDate = new Date(); 

    const fontSize = convertCSS(themeSetting.body_typography.font_size);
    const imageSource = event.image;
    const speakers = event?.speakers;

    const setOptionLabel = (val, option) => {
		let result = option.find(x=>x.value === val)
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
            <ImageBackground
                // source={require("../../../assets/img/sample/image53.png")}
                source={{uri: `${IMAGE_URL}public/cms/${imageSource}`}}
                style={{ height: 80, width: '100%', marginBottom: 10 }}
            >
                <Text style={{ backgroundColor: '#F8931D', maxWidth: '28%', marginLeft: '2.5%', marginTop: '2.5%', borderRadius: 5, color: 'white', fontSize: fontSize, textAlign: 'center' }}>
                    {setOptionLabel(event.event_type, optionEventType)}
                </Text>
            </ImageBackground>
            <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize*1.15, fontWeight: "bold" }}>
                {/* texttruncate */}
                {truncate(event.title)}
            </Text>
            <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize*0.8 }}>
                Oleh: {speakers[0].speaker.name}
            </Text>
            <View style={{ flexDirection: 'row', marginLeft: '5%' }}>
                <FontAwesome5
                    name="clock"
                    color="black"
                    size={12}
                    style={{ marginTop: '2%' }}
                />
                <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize*0.8 }}>
                    {moment(event.event_date).format('HH:mm')}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: '5%' }}>
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
            {
                ((moment(event.price_sale_start).isBefore(currentDate)) && (moment(event.price_sale_end).isAfter(currentDate))) ?
                    <>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <View style={{ backgroundColor: '#ffc385', borderRadius: 10, marginLeft: '5%', width: '20%' }}>
                                <Text style={{ marginLeft: '20%', color: '#ff8000', fontSize: fontSize * 0.9 }}>
                                    {Number.parseInt((event.price_normal - event.price_sale) / event.price_normal * 100)}%
                                </Text>
                            </View>

                            <Text style={{ marginLeft: '5%', color: 'grey', textDecorationLine: 'line-through', fontSize: fontSize * 0.75, marginTop: '1%' }}>
                                Rp. {Currency(event.price_normal)}
                            </Text>
                        </View>
                        <Text style={{ marginLeft: '5%', marginTop: 5, color: 'black', fontSize: fontSize * 1.3, fontWeight: "bold" }}>
                            Rp. {Currency(event.price_sale)}
                        </Text>
                    </> :
                    <>
                        <Text style={{ marginLeft: '5%', color: 'black', fontSize: fontSize * 1.3, fontWeight: "bold" }}>
                            Rp. {Currency(event.price_normal)}
                        </Text>
                    </>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        // width: 200, //harusnya pakai presentase
        width: WIDTH,
        marginVertical: 7,
        borderColor: '#e6e6e6',
        borderWidth: 1,
        borderRadius: 10,
        marginRight: 10,
        maxHeight: 250
    }
});

export default EventCard