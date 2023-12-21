import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shadow } from 'react-native-shadow-2';
import {
  filterReview,
  tabProduct,
  tabReview,
  initFilterDiscuss,
} from '../constants';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../../helpers/axiosInstance';
import ReviewComponent from './ReviewComponent';
import DiscussComponent from './DiscussComponent';
import { useToast } from 'react-native-toast-notifications';
import RenderHtml from 'react-native-render-html';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import WebView from 'react-native-webview';
import { CustomDivider } from '../../../../components/Divider';

const WIDTH = Dimensions.get('window').width;

export default function ProductInformation({
  productInformation,
  productDetail,
  productBundling
}) {
  const customHTMLElementModels = {
    iframe: iframeModel,
  };

  const renderers = {
    iframe: IframeRenderer,
  };

  const toast = useToast();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = React.useState(tabProduct[0]);
  const [selectedTabReview, setSelectedTabReview] = React.useState(
    tabReview[0],
  );
  const [rating, setRating] = React.useState([]);
  const [totalRating, setTotalRating] = React.useState(0);
  const [reviews, setReviews] = React.useState([]);
  const [discuss, setDiscuss] = React.useState([]);
  const [discussText, setDiscussText] = React.useState('');
  const [replyText, setReplyText] = React.useState({});

  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const [lastPage, setLastPage] = React.useState();
  const [lastPageDiscuss, setLastPageDiscuss] = React.useState();
  const [currentPageDiscuss, setCurrentPageDiscuss] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filter, setFilter] = React.useState({
    ...filterReview,
    product_id: productDetail.id,
  });
  const [filterDiscuss, setFilterDiscuss] = React.useState({
    ...initFilterDiscuss,
    product_id: productDetail.id,
  });

  useEffect(() => {
    getRating();
  }, []);

  useEffect(() => {
    getReviews();
  }, [filter]);

  useEffect(() => {
    getDiscuss();
  }, [filterDiscuss]);

  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );

  const getRating = () => {
    if (productDetail.id == null) return;
    let params = {
      product_id: productDetail.id,
    };
    axiosInstance
      .get(`review/getRating`, { params })
      .then(res => {
        let data = res.data.data;
        if (data != null) {
          setRating({
            1: data.find(data1 => data1.rating == 1)
              ? data.find(data1 => data1.rating == 1).value
              : 0,
            2: data.find(data1 => data1.rating == 2)
              ? data.find(data1 => data1.rating == 2).value
              : 0,
            3: data.find(data1 => data1.rating == 3)
              ? data.find(data1 => data1.rating == 3).value
              : 0,
            4: data.find(data1 => data1.rating == 4)
              ? data.find(data1 => data1.rating == 4).value
              : 0,
            5: data.find(data1 => data1.rating == 5)
              ? data.find(data1 => data1.rating == 5).value
              : 0,
          });
          setTotalRating(data.length);
        }
      })
      .catch(error => {
        console.error('error getRating ', error.response.data);
      });
  };

  const getReviews = () => {
    if (!filter.product_id) return;
    axiosInstance
      .get(`review/getWithParams`, { params: filter })
      .then(res => {
        let data = res.data.data;
        setReviews(data.data);
        setLastPage(data.last_page);
        setCurrentPage(1);
      })
      .catch(error => {
        console.error('error getReviews ', error.response.data);
      });
  };

  const getDiscuss = () => {
    console.log('filterDiscuss', filterDiscuss);
    if (!filterDiscuss.product_id) return;
    axiosInstance
      .get(`discussion/getWithParams`, { params: filterDiscuss })
      .then(res => {
        let data = res.data.data;
        setDiscuss(data.data);
        setLastPageDiscuss(data.last_page);
        setCurrentPageDiscuss(1);
        console.log(res.data.data);
      })
      .catch(error => {
        console.error('error getDiscuss ', error.response.data);
      });
  };

  const onChangeFilter = value => {
    setSelectedTabReview(value);
    setFilter({ ...filter, filter: value });
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
        .get(`review/getWithParams`, { params })
        .then(res => {
          const newList = reviews.concat(res.data.data.data);
          setReviews(newList);
          setCurrentPage(newPage);
        })
        .finally(() => setIsLoadMore(false));
    }
  };

  const handlePaginationDiscuss = async () => {
    let newPage = currentPageDiscuss + 1;
    if (newPage > lastPageDiscuss) {
      return;
    } else if (isLoadMore) {
      return;
    } else {
      let params = { ...filterDiscuss, page: newPage };
      setIsLoadMore(true);
      await axiosInstance
        .get(`review/getWithParams`, { params })
        .then(res => {
          const newList = discuss.concat(res.data.data.data);
          setDiscuss(newList);
          setCurrentPageDiscuss(newPage);
        })
        .finally(() => setIsLoadMore(false));
    }
  };

  const onPostDiscuss = () => {
    if (!discussText == '') {
      let data = {
        new_discussion: discussText,
        product_id: productDetail.id,
      };
      axiosInstance
        .post(`discussion/new_discussion`, data)
        .then(res => {
          setDiscussText('');
          getDiscuss();
        })
        .catch(error => {
          console.error('error getDiscuss ', error.response.data);
        });
    } else {
      toast.show(t('common:textCannotEmpty'), {
        placement: 'top',
        type: 'danger',
        animationType: 'zoom-in',
        duration: 3000,
      });
    }
  };

  const onPostReply = id => {
    if (!replyText['reply_' + id] == '') {
      let data = {
        reply: replyText['reply_' + id],
        product_discussion_id: id,
      };
      axiosInstance
        .post(`discussion/reply`, data)
        .then(res => {
          console.log(res.data.data);
          setReplyText({});
          getDiscuss();
        })
        .catch(error => {
          console.error('error getDiscuss ', error.response.data);
        });
    } else {
      toast.show(t('common:textCannotEmpty'), {
        placement: 'top',
        type: 'danger',
        animationType: 'zoom-in',
        duration: 3000,
      });
    }
  };
  // console.log('tes', JSON.parse(productInformation?.sections)[0]?.content)
  return (
    <View
      style={{
        marginVertical: 5,
        paddingHorizontal: 16
      }}>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 6,
        }}>
        <Text style={{ color: '#404040', fontWeight: '700', marginBottom: 5, fontSize: 16 }}>
          {t('auction:productDescription')}
        </Text>
        <RenderHtml
          renderers={renderers}
          contentWidth={WIDTH}
          WebView={WebView}
          enableExperimentalMarginCollapsing={true}
          customHTMLElementModels={customHTMLElementModels}
          source={{ html: productInformation?.sections ? JSON.parse(productInformation?.sections)[0]?.content : '' }}
          tagsStyles={{
            // body: {
            //   width: typeof width == 'number' ? width*0.8 : null,
            // },
            // img: {
            //   maxHeight: typeof width == 'number' ? parseInt(WIDTH) * 0.5 : width,
            //   width: width,
            //   resizeMode: 'center',
            // },
            iframe: {
              resizeMode: 'center',
              alignSelf: 'center',
            },
            p: {
              flexDirection: 'row',
              color: '#404040'
            },
          }}
          renderersProps={{
            img: {
              enableExperimentalPercentWidth: true,
            },
            iframe: {
              scalesPageToFit: true,
              webViewProps: {},
            },
          }}
        />
      </View>
      {productBundling.length > 0 && productBundling.map((item, index) => (
        <View key={index}>
          <Text style={{ color: '#404040', fontWeight: '700', marginBottom: 5 }}>
            - {item.mp_product_sku.mp_product.mp_product_informations[0].name}
          </Text>
          <RenderHtml
            renderers={renderers}
            contentWidth={WIDTH}
            WebView={WebView}
            enableExperimentalMarginCollapsing={true}
            customHTMLElementModels={customHTMLElementModels}
            source={{ html: item.mp_product_sku.mp_product.mp_product_informations[0].sections[0].content }}
            tagsStyles={{
              iframe: {
                resizeMode: 'center',
                alignSelf: 'center',
              },
              p: {
                flexDirection: 'row',
                color: '#404040'
              },
            }}
            renderersProps={{
              img: {
                enableExperimentalPercentWidth: true,
              },
              iframe: {
                scalesPageToFit: true,
                webViewProps: {},
              },
            }}
          />
        </View>
      ))}
      <CustomDivider />
      <ReviewComponent
        productDetail={productDetail}
        productInformation={productInformation}
        rating={rating}
        totalRating={totalRating}
        WIDTH={WIDTH}
        themeSetting={themeSetting}
        selectedTabReview={selectedTabReview}
        setSelectedTabReview={setSelectedTabReview}
        reviews={reviews}
        isLoadMore={isLoadMore}
        handlePagination={handlePagination}
        onChangeFilter={onChangeFilter}
      />
      <CustomDivider />
      <DiscussComponent
        isLoadMore={isLoadMore}
        handlePagination={handlePaginationDiscuss}
        discuss={discuss}
        setDiscussText={setDiscussText}
        discussText={discussText}
        WIDTH={WIDTH}
        onPostDiscuss={onPostDiscuss}
        setReplyText={setReplyText}
        replyText={replyText}
        onPostReply={onPostReply}
      />
    </View>
  );
}

// const styles = StyleSheet.create({
//   title: {fontWeight: '500', margin: 8},
// });
