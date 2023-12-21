import {View, Text} from 'react-native';
import React from 'react';
import {useCountdown} from '../../../../helpers/useCountdown';

export default function Countdown({detail, t}) {
  return (
    <View
      style={{
        backgroundColor: '#FFF0CA',
        padding: 5,
        borderRadius: 6,
        // width: 210,
      }}>
      <Text style={{color: '#F8931D', fontSize: 10}}>
        {t('auction:endsIn')}{' '}
        <Text style={{fontWeight: '600'}}>
          {useCountdown(detail?.active_end_date)?.hours} {t('auction:hours')} :{' '}
          {useCountdown(detail?.active_end_date)?.minutes}{' '}
          {t('auction:minutes')}
        </Text>
      </Text>
    </View>
  );
}
