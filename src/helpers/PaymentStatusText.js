import {Text} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

export const PaymentStatusText = props => {
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );
  const {t} = useTranslation();

  let color = '';
  if (props.data === 'pending') {
    color = themeSetting?.accent_color?.value;
  } else if (props.data === 'rejected') {
    color = '#EB2424';
  } else if (props.data === 'waiting_for_payment') {
    color = '#0F74BD';
  } else if (props.data === 'waiting_for_upload') {
    color = '#0F74BD';
  } else if (props.data === 'waiting_approval') {
    color = '#0F74BD';
  } else if (props.data === 'expired') {
    color = '#EB2424';
  }
  return (
    <Text style={{fontWeight: '500', color}}>
      {t(`payment_status.${props.data}`)}
    </Text>
  );
};

export const StatusText = props => {
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );
  const {t} = useTranslation();
  let color = '';
  if (props.data === 'payment_approved') {
    color = themeSetting?.accent_color?.value;
  } else if (props.data === 'forwarded_to_seller') {
    color = themeSetting?.accent_color?.value;
  } else if (props.data === 'on_process_by_seller') {
    color = '#0F74BD';
  } else if (props.data === 'on_delivery') {
    color = themeSetting?.accent_color?.value;
  } else if (props.data === 'arrived') {
    color = themeSetting?.accent_color?.value;
  } else if (props.data === 'complete') {
    color = themeSetting?.accent_color?.value;
  } else if (props.data === 'cancelled') {
    color = '#EB2424';
  } else if (props.data === 'refund_in_progress') {
    color = '#0F74BD';
  } else if (props.data === 'refund_rejected') {
    color = '#EB2424';
  } else if (props.data === 'refund_approved') {
    color = themeSetting?.accent_color?.value;
  } else if (props.data === 'expired') {
    color = '#EB2424';
  } else {
    color = themeSetting?.accent_color?.value;
  }
  return (
    <Text style={{fontWeight: '500', color, flex: 1, flexWrap: 'wrap'}}>
      {t(`transaction_status.${props.data}`)}
    </Text>
  );
};
