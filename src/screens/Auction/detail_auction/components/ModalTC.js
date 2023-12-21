import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import convertCSS from '../../../../helpers/convertCSS';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CheckBox from '@react-native-community/checkbox';
import Currency from '../../../../helpers/Currency';
import RenderHtml from 'react-native-render-html';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import WebView from 'react-native-webview';

const WIDTH = Dimensions.get('window').width;

export default function ModalTC({
  isVisible,
  close,
  themeSetting,
  onSubmit,
  onSubmitTNC,
  isChecked,
  setIsChecked,
  offerValue,
  onRefreshing,
  confirmed,
  setConfirmed,
  modalFailed,
  setModalFailed,
  tnc
}) {
  const renderers = {
    iframe: IframeRenderer,
  };
  const customHTMLElementModels = {
    iframe: iframeModel,
  };

  return (
    <Modal isVisible={isVisible} close={close}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: 12,
          justifyContent: 'space-between',
        }}>
        <ScrollView>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={close}>
              <Icon name="chevron-left" size={22} style={{ marginRight: 5 }} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize:
                  convertCSS(themeSetting.body_typography.font_size) * 1.2,
                fontWeight: '600',
              }}>
              Syarat & Ketentuan Lelang
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RenderHtml
              renderers={renderers}
              contentWidth={WIDTH * 0.9}
              WebView={WebView}
              enableExperimentalMarginCollapsing={true}
              customHTMLElementModels={customHTMLElementModels}
              source={{
                html: tnc[0]?.content,
              }}
              tagsStyles={{
                iframe: {
                  resizeMode: 'center',
                  alignSelf: 'center',
                },
                p: {
                  flexDirection: 'row',
                },
              }}
              renderersProps={{
                img: {
                  enableExperimentalPercentWidth: true,
                },
                iframe: {
                  scalesPageToFit: true,
                  webViewProps: {},
                },
              }}
            />

            <CheckBox
              value={isChecked}
              onValueChange={() => setIsChecked(!isChecked)}
            />
            <Text>Saya setuju</Text>
          </View>
        </ScrollView>
        <TouchableOpacity
          // onPress={onSubmit}
          onPress={() => setConfirmed(true)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            paddingHorizontal: 45,
            paddingVertical: 12,
            backgroundColor: isChecked
              ? themeSetting?.accent_color?.value
              : '#A6A6A6',
          }}>
          <Text style={{ color: '#fff', fontWeight: '500' }}>Tawar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
