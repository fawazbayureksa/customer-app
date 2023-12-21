import {View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import axiosInstance from '../../../helpers/axiosInstance';
import {IMAGE_URL} from '@env';
import RenderHtml from 'react-native-render-html';
import convertCSS from '../../../helpers/convertCSS';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {MainRouteName} from '../../../constants/mainRouteName';

const WIDTH = Dimensions.get('window').width;

export default function Article({data,width}) {
  const [articles, setArticles] = useState([]);
  const [page, set_page] = useState(1);
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const column = data.value.number_of_columns;

  const themeSetting = useSelector(
    state => state?.themeReducer?.themeSetting?.theme,
  );

  useEffect(() => {
    getArticleDetail();
  }, []);

  const getArticleDetail = () => {
    let params = {
      cms_article_category_id: data.value.cms_article_category_id,
      pull_article_by: data.value.pull_article_by,
      order: data.value.order,
      order_by: data.value.order_by,
      per_page: data.value.post_per_page,
      page: page,
    };
    axiosInstance
      .get('cms/getArticlePaginate', {params})
      .then(res => {
        setArticles(res.data.data.data);
      })
      .catch(error => {
        console.error('error getArticlePaginate: ', error.response.data);
      });
  };
  return (
    <View
      style={{
        marginVertical: 10,
        marginTop: convertCSS(data.style.margin_top),
        marginRight: convertCSS(data.style.margin_right),
        marginBottom: convertCSS(data.style.margin_bottom),
        marginLeft: convertCSS(data.style.margin_left),
        paddingTop: convertCSS(data.style.padding_top),
        paddingRight: convertCSS(data.style.padding_right),
        paddingBottom: convertCSS(data.style.padding_bottom),
        paddingLeft: convertCSS(data.style.padding_left),
      }}>
      {data.value.display_type === 'list' ? (
        <>
          {articles.map((item, index) => {
            return (
              <View key={index} style={{padding:2}}>
                <TouchableOpacity
                  onPress={() =>
                    navigate(MainRouteName.DETAIL_ARTICLE, {article: item})
                  }>
                  <Text style={{fontWeight: '500', marginBottom: 10}}>
                    {item.title}
                  </Text>
                  <Image
                    source={{
                      uri: `${IMAGE_URL}public/cms/${item?.feature_image}`,
                    }}
                    style={{
                      resizeMode: 'contain',
                      borderRadius: 8,
                      backgroundColor: 'grey',
                      height: width,
                    }}
                  />
                </TouchableOpacity>
                <Text style={{marginTop: 5}}>
                  {moment(item.publish_date).format('DD MMMM YYYY')}
                </Text>
                <Text>{`${t('common:category')} : ${
                  item.cms_article_category.name
                }`}</Text>
                <RenderHtml
                  source={{html: `<p>${truncate(item.value)}</p>`}}
                  contentWidth={100}
                  renderers={() => {
                    return (
                      <Text numberOfLines={1} style={convertedCSSStyles}>
                        {children}
                      </Text>
                    );
                  }}
                />
                <TouchableOpacity
                  onPress={() =>
                    navigate(MainRouteName.DETAIL_ARTICLE, {article: item})
                  }>
                  <Text style={{color: themeSetting?.accent_color?.value}}>
                    {t('common:readMore')}
                  </Text>
                </TouchableOpacity>
                {index !== articles.length - 1 && (
                  <View
                    style={{
                      width: WIDTH * 0.95,
                      borderBottomWidth: 0.5,
                      marginVertical: 10,
                      borderBottomColor: '#000',
                    }}
                  />
                )}
              </View>
            );
          })}
        </>
      ) : (
        <>
          <View
            style={{
              flex: 1,
              width: WIDTH,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
            }}>
            {articles.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: (WIDTH * 0.9) / column,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate(MainRouteName.DETAIL_ARTICLE, {article: item})
                    }>
                    <Text style={{fontWeight: '500', marginBottom: 10}}>
                      {item.title}
                    </Text>
                    <Image
                      source={{
                        uri: `${IMAGE_URL}public/cms/${item?.feature_image}`,
                      }}
                      style={{
                        resizeMode: 'contain',
                        borderRadius: 8,
                        height: width,
                        // width: WIDTH,
                      }}
                    />
                  </TouchableOpacity>
                  <Text style={{marginTop: 5}}>
                    {moment(item.publish_date).format('DD MMMM YYYY')}
                  </Text>
                  <Text>{`${t('common:category')} : ${
                    item.cms_article_category.name
                  }`}</Text>
                  <RenderHtml
                    source={{html: `<p>${truncate(item.value)}</p>`}}
                    contentWidth={100}
                    renderers={() => {
                      return (
                        <Text numberOfLines={1} style={convertedCSSStyles}>
                          {children}
                        </Text>
                      );
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      navigate(MainRouteName.DETAIL_ARTICLE, {article: item})
                    }>
                    <Text style={{color: themeSetting?.accent_color?.value}}>
                      {t('common:readMore')}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

const truncate = str => {
  if (str.length > 200) {
    return str.slice(0, 200) + '...';
  } else {
    return str;
  }
};
