import {View, Text, Image, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import Template from '../../../components/Template';
import axiosInstance from '../../../helpers/axiosInstance';
import {IMAGE_URL} from '@env';
import RenderHtml from 'react-native-render-html';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {MainRouteName} from '../../../constants/mainRouteName';

const WIDTH = Dimensions.get('window').width;

export default function DetailArticle({route}) {
  const [article, setArticle] = useState({});
  const {t} = useTranslation();

  useEffect(() => {
    getArticleDetail();
  }, []);

  const getArticleDetail = () => {
    let params = {
      slug: route.params.article.url,
    };
    axiosInstance
      .get('cms/getArticleDetail', {params})
      .then(res => {
        setArticle(res.data.data);
      })
      .catch(error => {
        console.error('error getArticleDetail: ', error.response.data);
      });
  };

  return (
    <Template scroll={true} url={MainRouteName.DETAIL_ARTICLE}>
      <View style={{padding: 10}}>
        <Text style={{fontWeight: '500', fontSize: 16, marginBottom: 10}}>
          {article?.title}
        </Text>
        <Image
          source={{
            uri: `${IMAGE_URL}public/cms/${article?.feature_image}`,
          }}
          style={{
            resizeMode: 'contain',
            borderRadius: 8,
            height: WIDTH * 0.7,
            // width: WIDTH,
          }}
        />
        <Text style={{marginTop: 5}}>
          {moment(article?.publish_date).format('DD MMMM YYYY')}
        </Text>
        <Text>{`${t('common:category')} : ${
          article?.cms_article_category?.name
        }`}</Text>
        <RenderHtml
          source={{html: `<p>${article?.value}</p>`}}
          contentWidth={100}
          renderers={() => {
            return (
              <Text numberOfLines={null} style={convertedCSSStyles}>
                {children}
              </Text>
            );
          }}
        />
      </View>
    </Template>
  );
}
