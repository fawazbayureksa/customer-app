import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../helpers/axiosInstance';
import { IMAGE_URL } from '@env';
import RenderHtml from 'react-native-render-html';
import convertCSS from '../../../helpers/convertCSS';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { MainRouteName } from '../../../constants/mainRouteName';

const WIDTH = Dimensions.get('window').width;

export default function ArticleCarousel({ data }) {
  const [articles, setArticles] = useState([]);
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const themeSetting = useSelector(
    state => state?.themeReducer?.themeSetting?.theme,
  );

  useEffect(() => {
    getArticleDetail();
  }, []);

  const getArticleDetail = () => {
    let params = {
      cms_article_category_id: data.value.cms_article_category_id,
      sort_by: data.value.sort_by,
    };
    axiosInstance
      .get('cms/getArticle', { params })
      .then(res => {
        setArticles(res.data.data.data);
      })
      .catch(error => {
        console.error('error getArticle: ', error.response.data);
      });
  };

  return (
    <View
      style={{
        marginTop: convertCSS(data?.style?.margin_top),
        marginRight: convertCSS(data?.style?.margin_right),
        marginBottom: convertCSS(data?.style?.margin_bottom),
        marginLeft: convertCSS(data?.style?.margin_left),
        paddingTop: convertCSS(data?.style?.padding_top),
        paddingRight: convertCSS(data?.style?.padding_right),
        paddingBottom: convertCSS(data?.style?.padding_bottom),
        paddingLeft: convertCSS(data?.style?.padding_left),
      }}>
      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
        <ScrollView horizontal={true}>
          {articles &&
            articles.map((item, index) => {
              return data?.value?.type !== 'detail_without_image' ? (
                <TouchableOpacity
                  onPress={() =>
                    navigate(MainRouteName.DETAIL_ARTICLE, { article: item })
                  }
                  key={index}
                  style={{ marginHorizontal: 3, width: WIDTH * 0.7 }}>
                  <Image
                    source={{
                      uri: `${IMAGE_URL}public/cms/${item?.feature_image}`,
                    }}
                    style={{
                      resizeMode: 'cover',
                      borderRadius: 8,
                      width: WIDTH * 0.7,
                      height: WIDTH * 0.4,
                    }}
                  />
                  {data?.value?.type == 'simple' ? (
                    <View style={{ marginTop: -100, padding: 10 }}>
                      <Excerpt item={item} data={data} />
                      {data?.value?.layout === 'post_with_title' && (
                        <View style={{ height: 70 }} />
                      )}
                    </View>
                  ) : data?.value?.type == 'detail' ? (
                    <Excerpt item={item} data={data} />
                  ) : null}
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    width: WIDTH * 0.5,
                    height: WIDTH * 0.45,
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: 'grey',
                    marginHorizontal: 10,
                    marginBottom: 10,
                    marginTop: 5,
                    borderRadius: 6,
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ textAlign: 'center', marginBottom: 5 }}>
                    {item.title}
                  </Text>
                  {data?.value?.layout === 'post_with_title_and_excerpt' && (
                    <RenderHtml
                      source={{ html: `<p>${truncate(item.value)}</p>` }}
                      contentWidth={100}
                      renderers={() => {
                        return (
                          <Text numberOfLines={1} style={convertedCSSStyles}>
                            {children}
                          </Text>
                        );
                      }}
                    />
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      navigate(MainRouteName.DETAIL_ARTICLE, { article: item })
                    }>
                    <Text style={{ color: themeSetting?.accent_color?.value }}>
                      {t('common:readMore')}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </ScrollView>
      </View>
    </View>
  );
}

const Excerpt = ({ item, data }) => {
  return (
    <>
      <Text style={{ fontWeight: '500', fontSize: 16 }}>{item.title}</Text>
      {data?.value?.layout === 'post_with_title_and_excerpt' && (
        <View style={{ marginTop: 0, padding: 0 }}>
          <RenderHtml
            source={{ html: `<p>${truncate(item.value)}</p>` }}
            contentWidth={100}
            renderers={() => {
              return (
                <Text numberOfLines={1} style={convertedCSSStyles}>
                  {children}
                </Text>
              );
            }}
          />
        </View>
      )}
    </>
  );
};

const truncate = str => {
  if (str.length > 100) {
    let removeHtml = str.slice(0, 120).replace(/<[^>]*>?/gm, '');
    let newString = removeHtml.replace(/\\n/g, '');
    return newString + '...';
  } else {
    return str;
  }
};
