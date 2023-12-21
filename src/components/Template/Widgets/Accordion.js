import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import React from 'react';
import RenderHtml from 'react-native-render-html';
import {useEffect} from 'react';
import convertCSS from '../../../helpers/convertCSS';

export default function Accordion({data}) {
  useEffect(() => {
    setAccordions(data.value.items);
  }, [data]);

  const [accordions, setAccordions] = React.useState(data.value.items);

  const onExpand = index => {
    let newAccordions = [...accordions];
    if (data?.value?.type == 'toggle') {
      newAccordions[index].open_by_default =
        newAccordions[index].open_by_default == 'yes' ? 'no' : 'yes';
    } else {
      newAccordions.map((item, i) => {
        if (index == i) {
          if (newAccordions[i].open_by_default == 'yes') {
            newAccordions[i].open_by_default = 'no';
          } else {
            newAccordions[i].open_by_default = 'yes';
          }
        } else {
          newAccordions[i].open_by_default = 'no';
        }
      });
    }
    setAccordions(newAccordions);
  };

  return (
    <View style={{padding: 5, marginVertical: 5}}>
      {accordions &&
        accordions.map((item, index) => {
          return (
            <>
              {data?.value?.boxed == 'yes' ? (
                <View style={{justifyContent: 'center'}}>
                  <TouchableOpacity
                    onPress={() => onExpand(index)}
                    style={{
                      borderWidth: data?.value?.border_width,
                      borderRadius: 3,
                      borderColor: data?.value?.border_color,
                      padding: 10,
                      backgroundColor: data?.value?.background_color,
                    }}>
                    <Text style={{color: data?.value?.title_color}}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                  {item.open_by_default == 'yes' && (
                    <View
                      style={{
                        borderWidth: 1,
                        borderRadius: 3,
                        paddingHorizontal: 10,
                      }}>
                      <RenderHtml
                        source={{html: `<p>${item.content}</p>`}}
                        contentWidth={100}
                        renderers={() => {
                          return (
                            <Text numberOfLines={1} style={convertedCSSStyles}>
                              {children}
                            </Text>
                          );
                        }}
                      />
                    </View>
                  )}
                </View>
              ) : (
                <View
                  style={{
                    borderBottomWidth: convertCSS(
                      data?.value?.divider_width_size,
                    ),
                    borderBottomColor: data?.value?.divider_color,
                  }}>
                  <TouchableOpacity
                    onPress={() => onExpand(index)}
                    style={{padding: 10}}>
                    <Text style={{color: data?.value?.title_color}}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                  {item.open_by_default == 'yes' && (
                    <View style={{paddingHorizontal: 10}}>
                      <RenderHtml
                        source={{html: `<p>${item.content}</p>`}}
                        contentWidth={100}
                        renderers={() => {
                          return (
                            <Text numberOfLines={1} style={convertedCSSStyles}>
                              {children}
                            </Text>
                          );
                        }}
                      />
                    </View>
                  )}
                </View>
              )}
            </>
          );
        })}
    </View>
  );
}
