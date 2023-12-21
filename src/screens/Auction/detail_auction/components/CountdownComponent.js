import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import convertCSS from '../../../../helpers/convertCSS';
import {useSelector} from 'react-redux';
import {Countdown} from '../helpers/Countdown';
import {Shadow} from 'react-native-shadow-2';

const WIDTH = Dimensions.get('window').width;
export default function CountdownComponent({detail}) {
  const {t} = useTranslation();
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );

  return (
    <View style={{marginVertical: 5, alignItems: 'center', width: '100%'}}>
      <Shadow distance={3} startColor={'#00000010'} radius={6}>
        <View
          style={{
            marginVertical: 5,
            alignItems: 'center',
            width: WIDTH * 0.95,
            paddingBottom: 15,
          }}>
          <Text style={{marginVertical: 6}}>{t('auction:endsIn')}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize:
                  convertCSS(themeSetting.body_typography.font_size) * 1.2,
                fontWeight: '600',
                color: '#F54C4C',
              }}>
              {Countdown(detail?.active_end_date)?.days}
              <Text
                style={{
                  fontSize:
                    convertCSS(themeSetting.body_typography.font_size) * 0.8,
                  fontWeight: '400',
                }}>
                {t('auction:days')}
              </Text>
            </Text>

            <View style={styles.verticalLine} />
            <Text
              style={{
                fontSize:
                  convertCSS(themeSetting.body_typography.font_size) * 1.2,
                fontWeight: '600',
                color: '#F54C4C',
              }}>
              {Countdown(detail?.active_end_date)?.hours}
              <Text
                style={{
                  fontSize:
                    convertCSS(themeSetting.body_typography.font_size) * 0.8,
                  fontWeight: '400',
                }}>
                {t('auction:hours')}
              </Text>
            </Text>

            <View style={styles.verticalLine} />

            <Text
              style={{
                fontSize:
                  convertCSS(themeSetting.body_typography.font_size) * 1.2,
                fontWeight: '600',
                color: '#F54C4C',
              }}>
              {Countdown(detail?.active_end_date)?.minutes}
              <Text
                style={{
                  fontSize:
                    convertCSS(themeSetting.body_typography.font_size) * 0.8,
                  fontWeight: '400',
                }}>
                {t('auction:minutes')}
              </Text>
            </Text>

            <View style={styles.verticalLine} />

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize:
                    convertCSS(themeSetting.body_typography.font_size) * 1.2,
                  fontWeight: '600',
                  color: '#F54C4C',
                }}>
                {Countdown(detail?.active_end_date)?.seconds}
                <Text
                  style={{
                    fontSize:
                      convertCSS(themeSetting.body_typography.font_size) * 0.8,
                    fontWeight: '400',
                  }}>
                  {t('auction:second')}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </Shadow>
    </View>
  );
}

const styles = StyleSheet.create({
  verticalLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#DCDCDC',
    marginHorizontal: 10,
  },
});
