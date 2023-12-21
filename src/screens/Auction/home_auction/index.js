import {
  View,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  Animated,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import convertCSS from '../../../helpers/convertCSS';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../helpers/axiosInstance';
import CardAuction from './components/CardAuction';
import GetMedia from '../../../components/common/GetMedia';
import { AuctionRouteName } from '../../../constants/auction_route/auctionRouteName';
import truncate from '../../../helpers/truncate';
import Currency from '../../../helpers/Currency';
import MyOngingAuctionCard from './components/MyOngingAuctionCard';
import { Divider } from '../../../components/Divider';

const WIDTH = Dimensions.get('window').width;

export default function HomeAuction({ navigation }) {
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, WIDTH);

  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const language = useSelector(state => state.themeReducer.language);

  const [dataOngoing, setDataOngoing] = useState([]);
  const [dataOnTheDay, setDataOnTheDay] = useState([]);
  const [dataBanner, setDataBanner] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const [nextDay, setNextDay] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activityAuction, setActivityAuction] = useState([]);
  const [urlBanner, setUrlBanner] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (urlBanner.length > dataBanner.length) return;
    getData();
  }, [urlBanner]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    await axiosInstance
      .get('auction/welcomePage')
      .then(res => {
        res.data.data.auction_banner.mp_auction_banner_slide.map(item => {
          getUrlMedia(item.filename);
        });
        setDataOngoing(res.data.data.on_going);
        setDataOnTheDay(res.data.data.on_the_day);
        setDataBanner(res.data.data.auction_banner.mp_auction_banner_slide);
        setFeaturedProduct(res.data.data.data_promoted);
        setActivityAuction(res.data.data.activity_auction);
        setNextDay(res.data.data.next_day)
      })
      .catch(error => {
        console.error('error getData: ', error.response.data);
      })
      .finally(() => setLoading(false));
  };

  const getUrlMedia = async filename => {
    let params = {
      folder: 'cms',
      filename,
    };
    let url = 'images/getPublicUrl';
    await axiosInstance.get(url, { params }).then(response => {
      setUrlBanner(prev => [...prev, response.data]);
    });
  };

  const renderBanner = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          width: Dimensions.get('window').width,
          height: convertCSS(200),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={{ uri: urlBanner[index] }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
        />
      </View>
    );
  };

  return (
    <>
      {loading ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator
            size="large"
            color={themeSetting?.accent_color?.value}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
          }}>
          <ScrollView>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}>
              <Text
                style={{
                  fontSize: convertCSS(themeSetting.h3_typography.font_size),
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Lelang 365
              </Text>
              <Text
                style={{
                  marginVertical: 8,
                  fontSize: convertCSS(themeSetting.body_typography.font_size),
                  color: '#8D8D8D',
                }}>
                Jadi pemenang lelang dan dapatkan barangnya
              </Text>
              <FlatList
                data={dataBanner ? dataBanner : null}
                horizontal
                renderItem={renderBanner}
                showsHorizontalScrollIndicator={false}
                decelerationRate={0.8}
                snapToInterval={WIDTH}
                bounces={false}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: false },
                )}
              />
              <View style={styles.viewCarousel}>
                {dataBanner
                  ? dataBanner.map((data, index) => {
                    let opacity = position.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: [0.2, 1, 0.2],
                      extrapolate: 'clamp',
                    });
                    return (
                      <Animated.View
                        key={index}
                        style={[styles.animatedCarousel, { opacity }]}
                      />
                    );
                  })
                  : null}
              </View>

              <View style={{ marginVertical: 10 }}>
                {activityAuction?.length > 0 && (
                  <>
                    <Text
                      style={{
                        fontSize:
                          convertCSS(themeSetting.body_typography.font_size) *
                          1.1,
                        fontWeight: '700',
                        marginVertical: 6,
                        marginLeft: 7
                      }}>
                      {t('auction:yourActivity')}
                    </Text>
                    <ScrollView horizontal>
                      {activityAuction.map((item, index) => {
                        return (
                          <MyOngingAuctionCard
                            item={item}
                            index={index}
                            language={language}
                          />
                        );
                      })}
                    </ScrollView>
                  </>
                )}

                <View
                  style={{
                    marginVertical: 12,
                    height: 6,
                    backgroundColor: '#FAFAFA',
                    width: WIDTH,
                    alignSelf: 'center',
                    zIndex: -1000,
                  }}
                />

                {dataOngoing.length > 0 ? (
                  <>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize:
                              convertCSS(
                                themeSetting.body_typography.font_size,
                              ) * 1.1,
                            fontWeight: '700',
                            marginVertical: 6,
                          }}>
                          {t('auction:ongoing')}
                        </Text>
                        <TouchableOpacity>
                          <Text
                            style={{
                              fontSize: convertCSS(
                                themeSetting.body_typography.font_size,
                              ),
                              fontWeight: '700',
                              marginVertical: 6,
                              color: themeSetting?.accent_color?.value,
                            }}>
                            {t('auction:seeAll')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <FlatList
                        data={dataOngoing}
                        horizontal
                        renderItem={({ item, index }) => {
                          return (
                            <CardAuction
                              data={item}
                              index={index}
                              language={language}
                            />
                          );
                        }}
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={0.8}
                        snapToInterval={WIDTH / 2.5 + 17}
                      />
                    </View>

                    <View
                      style={{
                        marginVertical: 12,
                        height: 6,
                        backgroundColor: '#FAFAFA',
                        width: WIDTH,
                        alignSelf: 'center',
                        zIndex: -1000,
                      }}
                    />
                  </>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        width: WIDTH * 0.3,
                        height: WIDTH * 0.3,
                        resizeMode: 'contain',
                      }}
                      source={require('../../../assets/images/empty.png')}
                    />
                    <Text style={{ fontWeight: '600', color: '#303030' }}>
                      Belum ada lelang yang sedang berlangsung
                    </Text>
                  </View>
                )}

                {featuredProduct.length > 0 && (
                  <>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize:
                              convertCSS(
                                themeSetting.body_typography.font_size,
                              ) * 1.1,
                            fontWeight: '700',
                            marginVertical: 6,
                            marginLeft: 7
                          }}>
                          {t('auction:featuredProduct')}
                        </Text>
                        <TouchableOpacity>
                          <Text
                            style={{
                              fontSize: convertCSS(
                                themeSetting.body_typography.font_size,
                              ),
                              fontWeight: '700',
                              marginVertical: 6,
                              color: themeSetting?.accent_color?.value,
                            }}>
                            {t('auction:seeAll')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <FlatList
                        data={featuredProduct}
                        horizontal
                        renderItem={({ item, index }) => {
                          return (
                            <CardAuction
                              data={item}
                              index={index}
                              language={language}
                            />
                          );
                        }}
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={0.8}
                        snapToInterval={WIDTH / 2.5 + 17}
                      />
                    </View>

                    <View
                      style={{
                        marginVertical: 12,
                        height: 6,
                        backgroundColor: '#FAFAFA',
                        width: WIDTH,
                        alignSelf: 'center',
                        zIndex: -1000,
                      }}
                    />
                  </>
                )}

                {dataOnTheDay.length > 0 && (
                  <>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize:
                              convertCSS(
                                themeSetting.body_typography.font_size,
                              ) * 1.1,
                            fontWeight: '700',
                            marginVertical: 6,
                            marginLeft: 7
                          }}>
                          {t('auction:startToday')}
                        </Text>
                        <TouchableOpacity>
                          <Text
                            style={{
                              fontSize: convertCSS(
                                themeSetting.body_typography.font_size,
                              ),
                              fontWeight: '700',
                              marginVertical: 6,
                              color: themeSetting?.accent_color?.value,
                            }}>
                            {t('auction:seeAll')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <FlatList
                        data={dataOnTheDay}
                        horizontal
                        renderItem={({ item, index }) => {
                          return (
                            <CardAuction
                              data={item}
                              index={index}
                              language={language}
                            />
                          );
                        }}
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={0.8}
                        snapToInterval={WIDTH / 2.5 + 17}
                      />
                    </View>
                  </>
                )}
                {nextDay?.length > 0 && (
                  <>
                    {/* <Divider /> */}
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize:
                              convertCSS(
                                themeSetting.body_typography.font_size,
                              ) * 1.1,
                            fontWeight: '700',
                            marginVertical: 6,
                            marginLeft: 7
                          }}>
                          {t('auction:next_day')}
                        </Text>
                        <TouchableOpacity>
                          <Text
                            style={{
                              fontSize: convertCSS(
                                themeSetting.body_typography.font_size,
                              ),
                              fontWeight: '700',
                              marginVertical: 6,
                              color: themeSetting?.accent_color?.value,
                            }}>
                            {t('auction:seeAll')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <FlatList
                        data={nextDay}
                        horizontal
                        renderItem={({ item, index }) => {
                          return (
                            <CardAuction
                              data={item}
                              index={index}
                              language={language}
                            />
                          );
                        }}
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={0.8}
                        snapToInterval={WIDTH / 2.5 + 17}
                      />
                    </View>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  viewCarousel: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    // marginTop: 5,
  },
  animatedCarousel: {
    width: '16%',
    height: 2.4,
    backgroundColor: 'black',
    marginHorizontal: 4,
    borderRadius: 100,
  },
});
