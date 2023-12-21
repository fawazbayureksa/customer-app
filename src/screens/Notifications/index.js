import {
  View,
  Text,
  Image,
  Dimensions,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FitImage from 'react-native-fit-image';
import { ScrollView } from 'react-native-gesture-handler';
import axiosInstance from '../../helpers/axiosInstance';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { MarketplaceRouteName } from '../../constants/marketplace_route/marketplaceRouteName';
import { ForumRouteName } from '../../constants/forum_route/forumRouteName';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function Notifications({ navigation }) {
  const { t } = useTranslation();

  const [data, setData] = useState([1]);
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );
  useEffect(() => {
    getWishlist();
    const willFocusSubscription = navigation.addListener('focus', () => {
      getWishlist();
    });
    return willFocusSubscription;
  }, []);

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - HEIGHT
    );
  };

  const getWishlist = () => {
    setLoading(true);
    axiosInstance
      .get(`notification/getNotificationsByParams?per_page=10`)
      .then(res => {
        setData(res.data.data);
        setLastPage(res.data.data.last_page);
        setCurrentPage(1);
        // console.log(res.data.data.data)
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePagination = async () => {
    let newPage = currentPage + 1;
    if (newPage > lastPage) {
      return;
    } else if (isLoadMore) {
      return;
    } else {
      setIsLoadMore(true);
      await axiosInstance
        .get(
          `notification/getNotificationsByParams?per_page=10&max_id=${data[data.length - 1].id
          }`,
        )
        .then(res => {
          const newList = data.concat(res.data.data);
          setData(newList);
          setCurrentPage(newPage);
        })
        .finally(() => setIsLoadMore(false));
    }
  };

  const navigateTo = item => {
    if (item.redirect_to.includes('forum/detail-thread')) {
      let id = item.redirect_to.split('/')
      navigation.navigate(ForumRouteName.DETAIL_THREAD, { idThread: id[2] })
    } else if (item.redirect_to.includes('my-payment/detail')) {
      let url = item.redirect_to.replace(
        'account-settings/my-payment/detail/',
        '',
      );
      navigation.navigate(MarketplaceRouteName.DETAIL_PAYMENT, { url });
    } else {
      navigation.navigate(MarketplaceRouteName.ORDER_LIST);
    }
    axiosInstance.patch(`notification/markAsRead/${item.id}`).then(res => {
      console.log('markAsRead', res.data.data);
    });
  };

  const markAsReadAll = () => {
    let url = `notification/markAsReadAll`
    axiosInstance.post(url).then(res => {
      console.log(res.data)
      // Object.keys(data).forEach(function (key) { data[key].status = "read" });
      // set_counter(0)
      getWishlist()
    }).catch((error) => {
      console.log(error)
    });
  }
  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      {data.length > 0 ? (
        <>
          <ScrollView
            nestedScrollEnabled={true}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={getWishlist} />
            }
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) {
                handlePagination();
              }
            }}
            scrollEventThrottle={400}>
            {data.map((item, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => navigateTo(item)}
                    key={index}
                    style={{
                      flexDirection: 'row',
                      padding: 18,
                      backgroundColor:
                        item.status == 'read'
                          ? '#fff'
                          : 'rgba(255, 172, 75, 0.5);',
                    }}>
                    <Image
                      style={{
                        width: WIDTH * 0.15,
                        height: WIDTH * 0.15,
                      }}
                      source={require('../../assets/images/temp.png')}
                    />
                    <View style={{ marginLeft: 20, flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>{item.title}</Text>
                      <Text style={{ color: '#404040', marginVertical: 5 }}>
                        {item.desc}
                      </Text>
                      <Text style={{ color: '#8D8D8D', fontSize: 12 }}>
                        {moment(item.created_at).format('DD MMMM YYYY')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      alignSelf: 'center',
                      borderBottomWidth: 1,
                      borderColor: '#E8E8E8',
                      width: '100%',
                    }}
                  />
                </View>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 15,
              justifyContent: 'center',
              alignItems: 'center',
              left: 0,
              right: 0,
            }}
            onPress={markAsReadAll}
          >
            <View style={styles.floatingButton}>
              <Text
                style={{
                  fontWeight: '600',
                  color: themeSetting?.accent_color?.value,
                }}>
                Tandai Semua Dibaca
              </Text>
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Image source={require('../../assets/images/empty_notif.png')} />
          <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 16 }}>
            Belum Ada Notifikasi
          </Text>
          <Text style={{ fontSize: 14, color: '#898989' }}>
            Daftar notifikasi akan tampil di sini
          </Text>
        </View>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  floatingButton: {
    paddingVertical: 12,
    paddingHorizontal: WIDTH * 0.25,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});
