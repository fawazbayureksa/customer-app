import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
    Dimensions,
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import {ProgressBar} from 'react-native-paper';
  import {useTranslation} from 'react-i18next';
  import {IMAGE_URL} from '@env';
  import moment from 'moment';
  import GetMedia from '../../../components/common/GetMedia';
  import axiosInstance from '../../../helpers/axiosInstance';
  import { useSelector } from 'react-redux';
  import convertCSS from '../../../helpers/convertCSS';

const SpeakerListReview = ({ navigation, route }) => {

    const { speakerId } = route.params;
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = React.useState([]);
    const flatListRef = React.useRef();

    const [perPage, setPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState();
    const [eventType, setEventType] = useState("");
    const [eventLabel, setEventLabel] = useState("Semua");
    const [isLoadMore, setIsLoadMore] = React.useState(false);

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const width = Dimensions.get('window').width;
    const fontSize = convertCSS(themeSetting.body_typography.font_size);
    // const scrollX = new Animated.Value(0);
    // let position = Animated.divide(scrollX, width);
    
    useEffect(() => {
        getReviewList()
    }, [eventType]);

    const getReviewList = async () => {
        let params = {
            page: currentPage,
            per_page: perPage,
            webinar_speaker_id: speakerId,
            filter: 'all'
        }
        setLoading(true)
        axiosInstance
            .get(`webinar/speaker/getSpeakerRatingWithParams`, { params })
            .then(res => {
                setReviews(res.data.data.data);
                setLastPage(res.data.data.last_page);
                console.log("Reviews ->", res.data.data.data);
            }).catch(error => {
                console.error('error getEventList: ', error);
            }).finally(() => setLoading(false))
    }

  return (
      <View>
          <FlatList
              ref={flatListRef}
              nestedScrollEnabled={true}
            //   columnWrapperStyle={{ justifyContent: 'space-between' }}
              numColumns={1}
              vertical
              data={reviews}
              // keyExtractor={(item, index) => item.id}
              renderItem={({ item, index }) => {
                  return (
                      <>
                          <View style={{
                              marginVertical: 5,
                              paddingHorizontal: 16,
                              borderColor: 'grey',
                              borderBottomWidth: 0.2
                          }}>
                              <View
                                  style={{
                                      flexDirection: 'row',
                                      flex: 1,
                                      marginVertical: 8,
                                      alignItems: 'center',
                                      width: '100%',
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
                                          backgroundColor: 'grey'
                                      }}
                                  />
                                  <View style={{ flex: 8, marginLeft: 8 }}>
                                      <Text style={{ fontWeight: '500' }}>{item.mp_customer?.name}</Text>
                                  </View>
                              </View>
                              <View style={{ marginLeft: '2.5%', marginBottom: 2.5}}>
                                  <Text style={{ color: '#8D8D8D', fontSize: 12 }}>
                                      {moment(item.updated_at).format('DD MMMM YYYY  HH:mm')}
                                  </Text>
                                  <View style={{ flexDirection: 'row' }}>
                                      {[1, 2, 3, 4, 5].map(
                                          rating =>
                                              rating <= item.rating && (
                                                  <Icon name="star" size={16} color="#FFC107" />
                                              ),
                                      )}
                                  </View>
                                  <Text style={{ marginBottom: 5, fontSize: fontSize }}>{item.review}</Text>
                              </View>
                              {/* <View style={{ flexDirection: 'row', marginRight: 5 }}>
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
                          </View> */}
                          </View>
                          
                      </>
                  );
              }}
            //   onEndReached={() => handlePagination()}
              onEndReachedThreshold={0.2}
          // ListFooterComponent={renderFooter}
          // ListEmptyComponent={<ListEmpty />}
          />
      </View>
  )
}

export default SpeakerListReview