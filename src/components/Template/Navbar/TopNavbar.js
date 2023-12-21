import {View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import React, {useEffect} from 'react';
import {
  HambergerMenu,
  SearchNormal1,
  Sms,
  ShoppingCart,
} from 'iconsax-react-native';
import {navigationRef} from '../../../navigations/RootNavigator';
import {useNavigation} from '@react-navigation/native';
import convertCSS from '../../../helpers/convertCSS';
import Components from '../Components';
import {MarketplaceRouteName} from '../../../constants/marketplace_route/marketplaceRouteName';
import {useSelector} from 'react-redux';
import {MainRouteName} from '../../../constants/mainRouteName';

const WIDTH = Dimensions.get('window').width;

export default function TopNavbar({theme, topNavbar}) {
  const {navigate} = useNavigation();
  const style = JSON.parse(topNavbar?.style);
  const [data, setData] = React.useState([]);
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
  // console.log('topNavbar',JSON.stringify(topNavbar.columns))

  React.useEffect(() => {
    onParsingData();
  }, []);

  const onParsingData = () => {
    let top = [];
    if (topNavbar) {
      topNavbar.columns.forEach(column => {
        top.push(column);
        column.components.forEach(component => {
          if (typeof component?.value === 'string') {
            component.value = JSON.parse(component?.value) || {};
            if (typeof component?.style === 'string') {
              component.style = JSON.parse(component?.style) || {};
            }
          }
        });
        if (typeof column?.style === 'string') {
          column.style = JSON.parse(column?.style) || {};
        }
      });
    }
    setData(top);
  };

  return (
    <View
      style={{
        height: convertCSS(style.height),
        width: '100%',
        backgroundColor:
          style.background_transparent === 'color'
            ? style.background_color
              ? style.background_color
              : 'transparent'
            : 'transparent',
        flexDirection: 'row',
      }}>
      {data &&
        data.map((column, index) => {
          return (
            <View
              key={index}
              style={{
                flex: 1,
                backgroundColor:
                  column.style.background_transparent === 'color'
                    ? column.style.background_color
                      ? column.style.background_color
                      : 'transparent'
                    : 'transparent',
                maxWidth:
                  (column.width_numerator / column.width_denominator) * WIDTH,
                paddingTop: convertCSS(column.style?.padding_top),
                paddingRight: convertCSS(column.style?.padding_right),
                paddingBottom: convertCSS(column.style?.padding_bottom),
                paddingLeft: convertCSS(column.style?.padding_left),
                alignItems: column.style?.column_alignment,
              }}>
              {column &&
                column.components.map((component, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        // backgroundColor: component.style.background_color,
                        flex: 1,
                        width: '100%',
                        marginHorizontal: 5,
                        // width:
                        //   (column.width_numerator /
                        //     column.width_denominator) *
                        //   WIDTH,
                      }}>
                      <Components
                        component={component}
                        width={
                          (column.width_numerator / column.width_denominator) *
                          WIDTH
                        }
                        navbarType={'top'}
                      />
                    </View>
                  );
                })}
            </View>
          );
        })}
      {/* <View style={{flexDirection: 'row'}}>
        <HambergerMenu size={24} color="#fff" variant="Outline" />
        <Image
          style={{
            width: 120,
            height: 30,
          }}
          source={{
            uri: 'https://tsi-cms.oss-ap-southeast-5.aliyuncs.com/public/cms/20211126002504_Logo%20Tokodapur%20Hi-Res%20Web%20WHITE.png',
          }}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => navigate(MarketplaceRouteName.PRODUCTS)}>
          <SearchNormal1
            style={{marginHorizontal: 6}}
            size={24}
            color="#fff"
            variant="Outline"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate(MarketplaceRouteName.DETAIL_PAYMENT)}>
          <Sms
            style={{marginHorizontal: 6}}
            size={24}
            color="#fff"
            variant="Bold"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            isLoggedIn
              ? navigate(MarketplaceRouteName.CART)
              : navigate(MainRouteName.LOGIN)
          }>
          <ShoppingCart
            style={{marginHorizontal: 6}}
            size={24}
            color="#fff"
            variant="Bold"
          />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}
