import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ProgressBar} from 'react-native-paper';
import {tabReview} from '../constants';
import {useTranslation} from 'react-i18next';
import {IMAGE_URL} from '@env';
import moment from 'moment';
import GetMedia from '../../../../components/common/GetMedia';

export default function ReviewComponent({
  productDetail,
  productInformation,
  rating,
  totalRating,
  WIDTH,
  themeSetting,
  setSelectedTabReview,
  selectedTabReview,
  reviews,
  isLoadMore,
  handlePagination,
  onChangeFilter,
}) {
  const {t} = useTranslation();

  const convertTabLabel = label => {
    if (label === 'all') {
      return <Text>{t('common:all')}</Text>;
    } else if (label === 'with_photos') {
      return <Text>{t('common:withPhotos')}</Text>;
    } else if (typeof label == 'number') {
      return (
        <>
          <Icon name="star" size={16} color="#FFC107" />
          <Text>{label}</Text>
        </>
      );
    } else {
      return <Text>{label}</Text>;
    }
  };

  const renderFooter = () => {
    return (
      <>
        {isLoadMore && (
          <ActivityIndicator
            color={'#2C465C'}
            size={'small'}
            style={{padding: 10}}
          />
        )}
      </>
    );
  };

  const _renderItem = ({item, index}) => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginVertical: 8,
            alignItems: 'center',
          }}
          key={index}>
          <Image
            source={{
              uri: `${IMAGE_URL}public/customer/${item.mp_customer?.profile_picture}`,
            }}
            style={{
              resizeMode: 'contain',
              borderRadius: 100,
              width: 30,
              height: 30,
            }}
          />
          <View style={{flex: 8, marginLeft: 8}}>
            <Text style={{fontWeight: '500'}}>{item.mp_customer?.name}</Text>
          </View>
        </View>
        <Text style={{color: '#8D8D8D', fontSize: 12}}>
          {moment(item.updated_at).format('DD MMMM YYYY  HH:mm')}
        </Text>
        <View style={{flexDirection: 'row'}}>
          {[1, 2, 3, 4, 5].map(
            rating =>
              rating <= item.rating && (
                <Icon name="star" size={16} color="#FFC107" />
              ),
          )}
        </View>
        <Text>{item.review}</Text>
        <View style={{flexDirection: 'row', marginRight: 5}}>
          {item.mp_product_rating_files.length > 0 &&
            item.mp_product_rating_files.map((item, index) => {
              return (
                <View key={index}>
                  <GetMedia
                    folder="product_review"
                    filename={item.filename}
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 4,
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </View>
              );
            })}
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            marginVertical: 5,
            borderColor: '#F6F6F6',
          }}
        />
      </>
    );
  };
  return (
    <>
      {/* <View style={{fontWeight: '500', flexDirection: 'row', flex: 1}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: '500', marginBottom: 10}}>
            {productInformation?.name}
          </Text>
          <Text>{productDetail?.rating || '-'}/5</Text>
          <View style={{flexDirection: 'row'}}>
            <Icon name="star" size={20} color="#FFC107" />
            <Icon name="star" size={20} color="#FFC107" />
            <Icon name="star" size={20} color="#FFC107" />
            <Icon name="star" size={20} color="#FFC107" />
            <Icon name="star" size={20} color="#FFC107" />
          </View>
        </View>
        <View style={{flex: 1.5}}>
          {[5, 4, 3, 2, 1].map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Icon name="star" size={20} color="#FFC107" />
                <Text style={{marginHorizontal: 5}}>{item}</Text>
                <ProgressBar
                  progress={rating[item] / totalRating || 0}
                  color="#FFC107"
                  style={{
                    height: 8,
                    borderRadius: 8,
                    width: WIDTH * 0.4,
                  }}
                />
              </View>
            );
          })}
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        {tabReview.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onChangeFilter(item)}
              style={{
                paddingVertical: 4,
                paddingHorizontal: 6,
                backgroundColor:
                  selectedTabReview === item ? '#FAFAFB' : '#fff',
                borderBottomWidth: selectedTabReview === item ? 1 : 0,
                borderColor: themeSetting?.accent_color?.value,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {convertTabLabel(item)}
            </TouchableOpacity>
          );
        })}
      </View> */}
      <Text
        style={{
          color: '#404040',
          fontWeight: '700',
          marginBottom: 5,
          fontSize: 16,
        }}>
        Ulasan Produk
      </Text>
      <View>
        <FlatList
          nestedScrollEnabled={true}
          data={reviews}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => _renderItem({item, index})}
          onEndReached={() => handlePagination()}
          onEndReachedThreshold={0.2}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={<Text>{t('common:noReview')}</Text>}
        />
      </View>
    </>
  );
}
