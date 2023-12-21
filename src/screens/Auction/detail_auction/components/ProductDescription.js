import {View, Text, ScrollView, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import GetMedia from '../../../../components/common/GetMedia';
import RenderHtml from 'react-native-render-html';
import IframeRenderer, {iframeModel} from '@native-html/iframe-plugin';
import WebView from 'react-native-webview';

const WIDTH = Dimensions.get('window').width;

// const WebDisplay = React.memo(function WebDisplay({html})
const ProductDescription = React.memo(function ProductDescription({
  fontSize,
  accentColor,
  t,
  detail,
  language,
  productInformation,
}) {
  const [desc, setDesc] = useState('');
  const customHTMLElementModels = {
    iframe: iframeModel,
  };

  const renderers = {
    iframe: IframeRenderer,
  };

  useEffect(() => {
    productInformation.map(
      item =>
        item.language_code === language &&
        setDesc(JSON.parse(item.sections)[0].content),
    );
  }, []);

  return (
    <View>
      <Text style={{fontSize: fontSize * 1.1, fontWeight: '500'}}>
        {t('auction:productDescription')}
      </Text>
      {detail?.mp_product_images &&
        detail?.mp_product_images.map((item, index) => {
          return (
            <View
              key={index}
              style={{flexDirection: 'row', marginVertical: 10}}>
              <ScrollView horizontal>
                <GetMedia
                  folder="marketplace/products"
                  filename={item?.filename}
                  style={{
                    width: WIDTH * 0.25,
                    height: WIDTH * 0.25,
                    borderRadius: 5,
                    marginRight: 5,
                  }}
                />
              </ScrollView>
            </View>
          );
        })}
      <View>
        <RenderHtml
          renderers={renderers}
          contentWidth={WIDTH * 0.9}
          WebView={WebView}
          enableExperimentalMarginCollapsing={true}
          customHTMLElementModels={customHTMLElementModels}
          source={{
            html: desc,
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
      </View>
    </View>
  );
});

export default ProductDescription;
