import {View, Text} from 'react-native';
import React from 'react';
import RenderHtml from 'react-native-render-html';
import IframeRenderer, {iframeModel} from '@native-html/iframe-plugin';
import WebView from 'react-native-webview';

export default function TextEditor({component, WIDTH, width}) {
  const customHTMLElementModels = {
    iframe: iframeModel,
  };

  const renderers = {
    iframe: IframeRenderer,
  };

  return (
    <View
      style={{
        maxWidth: typeof width == 'number' ? width : null,
      }}>
      <RenderHtml
        renderers={renderers}
        contentWidth={WIDTH * 0.9}
        WebView={WebView}
        enableExperimentalMarginCollapsing={true}
        customHTMLElementModels={customHTMLElementModels}
        source={{html: component.value.value}}
        tagsStyles={{
          // body: {
          //   width: typeof width == 'number' ? width*0.8 : null,
          // },
          img: {
            maxHeight: typeof width == 'number' ? parseInt(WIDTH) * 0.5 : width,
            width: width,
            resizeMode: 'center',
          },
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
    </View>
  );
}
