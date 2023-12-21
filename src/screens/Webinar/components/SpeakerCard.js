import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import truncate from '../../../helpers/truncate';
import { IMAGE_URL } from "@env"
import { WebinarRouteName } from '../../../constants/webinar_route/webinarRouteName';
import { useSelector } from 'react-redux';
import convertCSS from '../../../helpers/convertCSS';
import { optionExpertiseLevel } from './constants';
import { useTranslation } from 'react-i18next';

const WIDTH = Dimensions.get('window').width * 0.47;

const SpeakerCard = ({navigation, speaker}) => {

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    
    const imageSource = speaker.image;
    const fontSize = convertCSS(themeSetting.body_typography.font_size);
    const {t} = useTranslation();

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
            onPress={() => navigation.navigate(WebinarRouteName.WEBINAR_SPEAKER_DETAIL, {speakerId:speaker.id})}
            // onPress={() => console.log(speaker.id)}
        >
            <ImageBackground
                source={{uri: `${IMAGE_URL}public/cms/${imageSource}`}}
                style={{ height: 160, width: '100%', marginBottom: 10 }}
            >
                <View style={{ marginLeft: '5%', backgroundColor: '#F8931D', width: '65%', borderRadius: 50, flexDirection: 'row', marginTop: 5 }}>
                    <FontAwesome5
                        name="crown"
                        color="white"
                        size={12}
                        style={{ marginTop: '4%', marginLeft: '5%' }}
                    />
                    <Text style={{ color: 'white', marginLeft: '5%', fontSize: fontSize }}>
                        {setOptionLabel(speaker.expertise_level, optionExpertiseLevel)}
                    </Text>
                </View>
            </ImageBackground>
            <Text style={{ marginLeft: '5%', color: 'black', fontSize: 16, fontWeight: "bold" }}>
                {truncate(speaker.name)}
            </Text>
            <Text style={{ marginLeft: '5%', color: 'black', fontSize: 11 }}>
                {t('webinar:specialityIn')} {speaker?.expertise}
            </Text>
            <View style={{marginLeft: '2.5%', flexDirection: 'row'}}>
                <Icon
                    name='star'
                    color={"#FFD600"}
                    size={24}
                />
                <Text style={{marginLeft: '2.5%', color: 'black', fontSize: 12, marginTop: 3}}>{speaker.rating}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: WIDTH,
        marginVertical: 7,
        borderColor: '#e6e6e6',
        borderWidth: 1,
        borderRadius: 10,
        marginRight: 10
    }
});

export default SpeakerCard