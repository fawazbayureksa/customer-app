import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Dimensions, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Card from './Card';
import axiosInstance from '../../../helpers/axiosInstance';
import ListEmpty from '../../../components/common/ListEmpty';
import { Shadow } from 'react-native-shadow-2';
import { IMAGE_URL } from "@env"
import { Verify } from 'iconsax-react-native'
import { useSelector } from 'react-redux';
import { MarketplaceRouteName } from '../../../constants/marketplace_route/marketplaceRouteName';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const WIDTH = Dimensions.get('window').width * 0.95;

export default function ProductList({ data, filter, type }) {
  const flatListRef = React.useRef();

  const [sellerList, setSellerlist] = React.useState([]);
  const [productList, setProductlist] = React.useState([]);
  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [lastPage, setLastPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  //   const [filter, setFilter] = useState(initFilter);
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const { navigate } = useNavigation()
  const navigation = useNavigation()

  useEffect(() => {
    if (type === "seller") {
      getSellerList()
    } else {
      getProductList();
    }
  }, [filter]);

  const getProductList = () => {
    setLoading(true);
    let params = filter;
    axiosInstance
      .get(`ecommerce/products/get`, { params })
      .then(res => {
        setProductlist(res.data.data.data);
        setLastPage(res.data.data.last_page);
        setCurrentPage(1)
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getSellerList = () => {
    setLoading(true);
    let params = filter;
    axiosInstance
      .get(`ecommerce/seller/get`, { params })
      .then(res => {
        setSellerlist(res.data.data.data);
        console.log(res.data.data.data);
        setLastPage(res.data.data.last_page);
        setCurrentPage(1)
      })
      .catch(error => {
        console.error("error getSelllerList", error.response.data);
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
      let params = { ...filter, page: newPage };
      setIsLoadMore(true);
      await axiosInstance
        .get(`ecommerce/products/get`, { params })
        .then(res => {
          const newList = productList.concat(res.data.data.data);
          setProductlist(newList);
          setCurrentPage(newPage);
        })
        .finally(() => setIsLoadMore(false));
    }
  };
  const handlePaginationSeller = async () => {
    let newPage = currentPage + 1;
    if (newPage > lastPage) {
      return;
    } else if (isLoadMore) {
      return;
    } else {
      let params = { ...filter, page: newPage };
      setIsLoadMore(true);
      await axiosInstance
        .get(`ecommerce/seller/get`, { params })
        .then(res => {
          const newList = sellerList.concat(res.data.data.data);
          setSellerlist(newList);
          setCurrentPage(newPage);
        })
        .finally(() => setIsLoadMore(false));
    }
  };
  const { t } = useTranslation();
  const renderFooter = () => {
    return (
      <>
        {isLoadMore && (
          <ActivityIndicator
            color={'#2C465C'}
            size={'large'}
            style={{ padding: 10 }}
          />
        )}
      </>
    );
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator
          color={'#2C465C'}
          size={'large'}
          style={{ padding: 10 }}
        />
      ) : (
        <View>
          {type === 'seller' ?
            <FlatList
              ref={flatListRef}
              nestedScrollEnabled={true}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              data={sellerList}
              numColumns={2}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item, index }) => (
                <View style={{ marginVertical: 5 }}>
                  <CardSeller item={item} data={data} index={index} navigation={navigation} themeSetting={themeSetting} />
                </View>
              )}
              onEndReached={() => handlePaginationSeller()}
              onEndReachedThreshold={0.2}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: WIDTH * 0.7,
                      height: WIDTH * 0.7,
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/productNotFound.png')}
                  />
                  <Text style={{ fontWeight: '600', fontSize: 18 }}>
                    Seller not found
                  </Text>
                  <Text>{t('common:searchOther')}</Text>
                </View>
              }
            />
            :
            <FlatList
              ref={flatListRef}
              nestedScrollEnabled={true}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              data={productList}
              numColumns={2}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item, index }) => (
                <View style={{ marginVertical: 5 }}>
                  <Card product={item} data={data} index={index} />
                </View>
              )}
              onEndReached={() => handlePagination()}
              onEndReachedThreshold={0.2}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={<ListEmpty />}
            />
          }
        </View>
      )}
    </View>
  );
}

const CardSeller = ({ item, index, data, themeSetting, navigation }) => {

  return (
    <TouchableOpacity
      key={index}
      onPress={() => navigation.push(MarketplaceRouteName.SELLER_PROFILE, { seller_slug: item.slug })}
      style={{
        paddingBottom: 8,
        flex: 1,
        paddingHorizontal: 2,
      }}>
      <Shadow distance={3} startColor={'#00000010'} radius={8}>
        <View
          style={{
            width: WIDTH / 2.2,
            backgroundColor: '#fff',
            borderRadius: 6,
            padding: 8,
            height: 170,
            borderColor: 'rgba(10, 0, 0, 0.1)',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <View style={{ flexDirection: "row", width: 100 }}>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 50
              }}
              source={{
                uri: `${IMAGE_URL}public/seller/${item.logo}`,
              }}
            />
            <View style={{ marginLeft: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }} >
                <Verify
                  size="16"
                  color={themeSetting?.accent_color?.value}
                  variant="Bold"
                />
                <Text style={{ fontWeight: "700" }}>{item?.name}</Text>
              </View>
              <Text style={{ marginLeft: 10 }}>{item?.province}</Text>
            </View>
          </View>
          <Image
            style={{
              width: "100%",
              height: 100,
              resizeMode: "contain"
            }}
            source={{
              uri: `${IMAGE_URL}public/seller/${item.cover_picture}`,
            }}
          />
        </View>
      </Shadow>
    </TouchableOpacity>
  )
}