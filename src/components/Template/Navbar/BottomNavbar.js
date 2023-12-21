import { View, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import convertCSS from '../../../helpers/convertCSS';
import Components from '../Components';
import { useSelector } from 'react-redux';
import { Shadow } from 'react-native-shadow-2';

const WIDTH = Dimensions.get('window').width;

export default function BottomNavbar({ theme, bottomNavbar }) {
  const style = JSON.parse(bottomNavbar?.style);
  const [data, setData] = React.useState([]);
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
  const selectedBottomNavbar = useSelector(
    state => state.themeReducer.selectedBottomNavbar,
  );

  React.useEffect(() => {
    onParsingData();
  }, []);

  const onParsingData = () => {
    let bottom = [];
    if (bottomNavbar) {
      bottomNavbar.columns.forEach(column => {
        bottom.push(column);
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
    setData(bottom);
  };

  return (
    <Shadow distance={5} startColor={'#00000010'}>
      <View
        style={{
          height: style.height === '' ? 50 : convertCSS(style.height),
          width: '100%',
          backgroundColor: style.background_transparent === 'color'
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
                  // backgroundColor:
                  //   index == selectedBottomNavbar
                  //     ? theme?.accent_color?.value
                  //     : column.style.background_color,
                  maxWidth:
                    (column.width_numerator / column.width_denominator) * WIDTH,
                  paddingTop: convertCSS(column.style?.padding_top),
                  paddingRight: convertCSS(column.style?.padding_right),
                  paddingBottom: convertCSS(column.style?.padding_bottom),
                  paddingLeft: convertCSS(column.style?.padding_left),
                  alignItems: column.style?.column_alignment,
                }}>
                {column &&
                  column.components.map((component, i) => {
                    return (
                      <View
                        key={i}
                        style={{
                          backgroundColor: component.style.background_color,
                          flex: 1,
                          width: '100%',
                          // width:
                          //   (column.width_numerator /
                          //     column.width_denominator) *
                          //   WIDTH,
                        }}>
                        <Components
                          component={component}
                          width={
                            (column.width_numerator /
                              column.width_denominator) *
                            WIDTH
                          }
                          navbarType={'bottom'}
                          index={index}
                        />
                      </View>
                    );
                  })}
              </View>
            );
          })}
      </View>
    </Shadow>
  );
}
