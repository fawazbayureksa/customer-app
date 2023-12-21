import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {WebView} from 'react-native-webview';
import {MainRouteName} from '../../../../constants/mainRouteName';

export default function ModalWebview(props) {
  return (
    <Modal isVisible={props.modalWebview}>
      <View
        style={{
          backgroundColor: '#fff',
          paddingVertical: 16,
          paddingHorizontal: 14,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontWeight: '500', fontSize: 16}}>Pembayaran</Text>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate(MainRouteName.HOME)
            }>
            <Text style={{fontWeight: '500', fontSize: 20}}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
      <WebView source={{uri: props.redirectUrlMidtrans}} />
    </Modal>
  );
}
