import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Template from '../../../../components/Template';
import axiosInstance from '../../../../helpers/axiosInstance';
import Card from './Card';
import EmptyCard from '../../cart/components/EmptyCard';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default function MarketplaceWishlist({ navigation }) {
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [lastPage, setLastPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadMore, setIsLoadMore] = React.useState(false);

  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );

  useEffect(() => {
    getWishlist();
  }, []);

  const getWishlist = () => {
    setLoading(true);
    axiosInstance
      .get(`my-wishlist/get?length=5&page=1`)
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
              <RefreshControl refreshing={loading} onRefresh={getWishlist} />
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
              <Card data={data} loading={loading} />
            </View>
          </ScrollView> : <View style={{ flex: 1, justifyContent: 'center' }}>

            <EmptyCard WIDTH={WIDTH} navigation={navigation} />
          </View>}
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
  );
}
