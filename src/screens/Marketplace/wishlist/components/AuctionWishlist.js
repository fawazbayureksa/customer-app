import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import React from 'react'
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../../helpers/axiosInstance';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from './Card';
import CardAuction from '../../../Auction/home_auction/components/CardAuction';


export default function AuctionWishlist() {
  const HEIGHT = Dimensions.get('window').height;
  const WIDTH = Dimensions.get('window').width;
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [lastPage, setLastPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const language = useSelector(state => state.themeReducer.language);
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );

  useEffect(() => {
    getAuctionWishlist();
  }, []);

  const getAuctionWishlist = () => {

    setLoading(true);
    axiosInstance
      .get(`my-wishlist/get?length=5&page=1&type=auction`)
      .then(res => {
        setData(res.data.data.data);
        setLastPage(res.data.data.last_page);
        setCurrentPage(1);
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
        .get(`my-wishlist/get?length=5&page=${newPage}`)
        .then(res => {
          const newList = data.concat(res.data.data.data);
          setData(newList);
          setCurrentPage(newPage);
        })
        .finally(() => setIsLoadMore(false));
    }
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - HEIGHT
    );
  };

  return (

    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        padding: 12,
      }}>
      {
        data.length > 0 ?

          <ScrollView
            contentContainerStyle={{
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}
            nestedScrollEnabled={true}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={getAuctionWishlist} />
            }
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) {
                handlePagination();
              }
            }}
            scrollEventThrottle={400}>
            <View
              style={{
                paddingTop: 8,
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {data && data.map((item, index) => (
                <CardAuction data={item.mp_product} index={index} language={language} />
              ))}
            </View>
          </ScrollView> :
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: "#fff"
            }}>
            <Image
              style={{
                width: WIDTH * 0.7,
                height: WIDTH * 0.7,
                resizeMode: 'contain',
              }}
              source={require('../../../../assets/images/empty.png')}
            />
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              {t('common:emptyCart')}
            </Text>
            <Text style={{ fontWeight: '600', color: '#303030' }}>
              Belum ada lelang yang sedang berlangsung
            </Text>
          </View>
      }
      {isLoadMore && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            size="large"
            color={themeSetting?.accent_color?.value}
          />
        </View>
      )}
    </View>
  )
}