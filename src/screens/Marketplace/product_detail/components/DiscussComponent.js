import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IMAGE_URL } from '@env';
import moment from 'moment';
import CustomButton from '../../../../components/CustomButton';
// import {TextInput} from 'react-native-paper';

export default function DiscussComponent({
  discussText,
  setDiscussText,
  isLoadMore,
  handlePagination,
  discuss,
  WIDTH,
  onPostDiscuss,
  setReplyText,
  replyText,
  onPostReply,
}) {
  const { t } = useTranslation();

  const onChangeReply = (id, text) => {
    setReplyText({ ...replyText, ['reply_' + id]: text });
    // console.log(replyText);
  };

  const _renderItem = item => {
    return (
      <View
        key={item.id}
        style={{ flex: 1, marginBottom: 8 }}>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              color: '#404040',
              fontWeight: '700',
              marginBottom: 5,
              fontSize: 16,
            }}>
            Diskusi Produk
          </Text>
          <Text
            style={{
              color: '#404040',
              fontWeight: '700',
              marginBottom: 5,
              fontSize: 16,
            }}>
            {t('auction:seeAll')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Image
            source={{
              uri: `${IMAGE_URL}public/customer/${item.mp_customer?.profile_picture}`,
            }}
            style={{
              resizeMode: 'contain',
              borderRadius: 50,
              width: 30,
              height: 30,
            }}
          />
          <Text style={{ fontWeight: '500', marginLeft: 10 }}>{item.mp_customer?.name}</Text>
        </View>
        <View style={{ flex: 4, }}>
          <Text style={{ color: '#8D8D8D', fontSize: 12, marginVertical: 2 }}>
            {moment(item.updated_at).format('DD MMMM YYYY  HH:mm')} WIB
          </Text>
          <Text>{item.content}</Text>
          <View style={{ marginVertical: 10 }}>
            {item.mp_product_discussion_replies.length > 0 &&
              item.mp_product_discussion_replies.map(reply => {
                return (
                  <>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: 2, marginHorizontal: 8, backgroundColor: '#C4C4C4', justifyContent: 'center', height: '100%' }} />
                      <View style={{ flex: 20 }}>
                        <View
                          key={reply.id}
                          style={{ flexDirection: 'row', flex: 1, marginVertical: 8, alignItems: 'center' }}>
                          <Image
                            source={{
                              uri: `${IMAGE_URL}public/customer/${reply.mp_customer?.profile_picture}`,
                            }}
                            style={{
                              resizeMode: 'contain',
                              borderRadius: 50,
                              width: 30,
                              height: 30,
                            }}
                          />
                          <View style={{ flex: 4, marginLeft: 10 }}>
                            <Text style={{ fontWeight: '500' }}>
                              {reply.mp_customer?.name}
                            </Text>
                          </View>
                        </View>

                        <Text style={{ fontSize: 11 }}>
                          {moment(reply.updated_at).format('YYYY-MM-DD  HH:mm')} WIB
                        </Text>
                        <Text>{reply.content}</Text>
                      </View>
                    </View>
                  </>
                );
              })}</View>
          <TextInput
            placeholder={t('common:reply')}
            value={replyText['reply_' + item.id]}
            onChangeText={text => onChangeReply(item.id, text)}
            multiline={true}
            numberOfLines={2}
            style={{
              borderColor: '#C4C4C4',
              textAlignVertical: 'top',
              fontSize: 12,
              borderWidth: 0.6,
              borderRadius: 6,
              marginVertical: 8,
            }}
          />
          <CustomButton
            onPress={() => onPostReply(item.id)}
            style={{ width: WIDTH * 0.25, alignSelf: 'flex-end' }}
            primary
            small={true}
            title={t('common:sendReply')}
          />
          {/* <View style={{padding: 8, backgroundColor}}>
            <Text>{t('common:sendReply')}</Text>
          </View> */}
        </View>
        <View style={{ borderBottomWidth: 1, marginVertical: 5, borderColor: '#F6F6F6' }} />
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <>
        {isLoadMore && (
          <ActivityIndicator
            color={'#2C465C'}
            size={'small'}
            style={{ padding: 10 }}
          />
        )}
      </>
    );
  };

  return (
    <View style={{ padding: 10 }}>
      <FlatList
        nestedScrollEnabled={true}
        data={discuss}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => _renderItem(item, index)}
        onEndReached={() => handlePagination()}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<Text>{t('common:noDiscuss')}</Text>}
      />
      <TextInput
        label="Email"
        placeholder={t('common:newDiscuss')}
        value={discussText}
        onChangeText={text => setDiscussText(text)}
        multiline={true}
        numberOfLines={4}
        style={{
          textAlignVertical: 'top',
          fontSize: 12,
          borderWidth: 0.6,
          borderRadius: 6,
          marginTop: 24,
          borderColor: '#C4C4C4',
        }}
      />
      <CustomButton
        onPress={onPostDiscuss}
        style={{ width: WIDTH * 0.15, alignSelf: 'flex-end' }}
        primary
        small={true}
        title={t('common:send')}
      />
    </View>
  );
}
