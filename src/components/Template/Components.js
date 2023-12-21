import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
  TouchableHighlight,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { HambergerMenu } from 'iconsax-react-native';
import RenderHtml from 'react-native-render-html';
import convertCSS from '../../helpers/convertCSS';
import axiosInstance from '../../helpers/axiosInstance';
import Slider from './Widgets/Slider';
import ProductCarousel from './Widgets/ProductCarousel';
import ImageCarousel from './Widgets/ImageCarousel';
import Notice from './Widgets/Notice';
import Article from './Widgets/Article';
import Form from './Widgets/Form';
import Separator from './Widgets/Separator';
import ArticleCarousel from './Widgets/ArticleCarousel';
import ImageGallery from './Widgets/ImageGallery';
import ButtonWidget from './Widgets/ButtonWidget';
import Accordion from './Widgets/Accordion';
import AdvancedSlider from './Widgets/AdvancedSlider';
import TextEditor from './Widgets/TextEditor';
import WidgetNavbar from './Widgets/navbar/WidgetNavbar';
import SearchBar from './Widgets/navbar/SearchBar';
import IconWidget from './Widgets/IconWidget';
import AutoHeightImage from 'react-native-auto-height-image';
import { useNavigation } from '@react-navigation/native';
import { MainRouteName } from '../../constants/mainRouteName';
import { ForumRouteName } from '../../constants/forum_route/forumRouteName';
import { MarketplaceRouteName } from '../../constants/marketplace_route/marketplaceRouteName';
import { AuctionRouteName } from '../../constants/auction_route/auctionRouteName';
import { WebinarRouteName } from '../../constants/webinar_route/webinarRouteName';
import SliderProductWithBanner from './Widgets/SliderProductWithBanner';
import FitImage from 'react-native-fit-image';
import MembershipPoint from './Widgets/MembershipPoint';

const WIDTH = Dimensions.get('window').width;

export default function Components({ component, width, navbarType, index }) {
  const [slider, setSlider] = useState({});
  const [products, setProducts] = useState([]);
  const { navigate } = useNavigation();

  useEffect(() => {
    if (component.type == 'slider_banner') {
      getSliderDetail();
    } else if (component.type == 'product_carousel') {
      getProductCarousel();
    }
  }, []);

  const getSliderDetail = () => {
    let params = {
      cms_slider_id: component.value.cms_slider_id,
    };
    axiosInstance
      .get('cms/getSlider', { params })
      .then(res => {
        setSlider(res.data.data);
      })
      .catch(error => {
        console.error('error getSlider: ', error);
      });
  };

  const getProductCarousel = () => {
    let params = {
      order_by: 'date',
      order: 'desc',
      length: component.value.product_per_page,
      page: 1,
      type: component.value.type,
      custom_product_url: component.value.custom_product_url,
    };
    axiosInstance
      .get('ecommerce/products/get', { params })
      .then(res => {
        setProducts(res.data.data.data);
      })
      .catch(error => {
        console.error('error getProductCarousel: ', error);
      });
  };

  const navigateTo = data => {
    console.log(data);
    // Linking.openURL('https://customer-tokodapur.degadai.id', {tes: 'tes'});
    if (data != '') {
      //main
      if (data.includes('login')) {
        navigate(MainRouteName.LOGIN);
      } else if (data.includes('notification')) {
        navigate(MainRouteName.NOTIFICATION);
      } else if (data.includes('register')) {
        navigate(MainRouteName.REGISTER);
      } else if (data.includes('account-settings')) {
        navigate(MainRouteName.ACCOUNT);
      } else if (data.includes('article/')) {
        navigate(MainRouteName.DETAIL_ARTICLE, {
          article: data.replace('article/', '').replace('/', ''),
        });
      }

      //MARKETPLACE
      else if (data.includes('cart')) {
        navigate(MarketplaceRouteName.CART);
      } else if (data.includes('account-settings/my-orders')) {
        navigate(MarketplaceRouteName.ORDER_LIST);
      } else if (data.includes('account-settings/wishlist')) {
        navigate(MarketplaceRouteName.WISHLIST);
      } else if (data.includes('products')) {
        navigate(MarketplaceRouteName.PRODUCTS);
      } else if (data.includes('checkout-order')) {
        navigate(MarketplaceRouteName.CHECKOUT);
      } else if (data.includes('product/')) {
        let url = data;
        let slug = url.replace('product/', '');
        if (slug[0] == '/') {
          slug = slug.substring(1);
        }
        let index = slug.indexOf('/');
        navigate(MarketplaceRouteName.PRODUCT_DETAIL, {
          product: {
            mp_seller: { slug: slug.substring(0, index) },
            slug: slug.split('/')[1],
          },
        });
      }

      //FORUM
      else if (data.includes('forum/my/list')) {
        navigate(ForumRouteName.FORUMLIST);
      } else if (data.includes('forum/my')) {
        // Linking.openURL('whatsapp://app')
        navigate(ForumRouteName.MY_FORUM);
      }

      //AUCTION
      else if (data.includes('auction/my')) {
        navigate(AuctionRouteName.HOME_AUCTION);
      }

      //WEBINAR
      else if (data.includes('webinar/dashboard')) {
        navigate(WebinarRouteName.WEBINAR_DASHBOARD);
      }

      //ELSE
      else if (data.includes('https') || data.includes('http')) {
        Linking.openURL(getUrl(data));
      } else {
        navigate(MainRouteName.CUSTOM_PAGE, {
          url: data,
        });
      }
    }
  };

  const getComponent = () => {
    if (component.type == 'nav_menu') {
      return <HambergerMenu size={24} color="#fff" variant="Outline" />;
    } else if (component.type == 'text_editor') {
      return <TextEditor component={component} WIDTH={WIDTH} width={width} />;
    } else if (component.type == 'image') {
      return (
        <TouchableHighlight
          style={{ marginVertical: 5 }}
          onPress={() => navigateTo(component.value.redirect_link)}>
          <FitImage
            // width={
            //   ['auto', '100%'].includes(convertCSS(component.value.width))
            //     ? width
            //     : convertCSS(component.value.width)
            // }
            // style={{
            //   width: ['auto', '100%'].includes(
            //     convertCSS(component.value.width),
            //   )
            //     ? width
            //     : convertCSS(component.value.width),
            // }}
            resizeMode="contain"
            source={{ uri: component.value.src }}
          />
          {/* <AutoHeightImage
            width={
              ['auto', '100%'].includes(convertCSS(component.value.width))
                ? width
                : convertCSS(component.value.width)
            }
            source={{uri: component.value.src}}
          /> */}

          {/* <Image
            style={{
              resizeMode: 'contain',
              width: convertCSS(component.value.width),
              height: convertCSS(component.value.height),
              // maxHeight: convertCSS(component.value.max_height),
              // maxWidth: convertCSS(component.value.max_width),
            }}
            source={{
              uri: component.value.src,
            }}
          /> */}
        </TouchableHighlight>
      );
    } else if (component.type == 'slider_banner') {
      return (
        <Slider
          sliderItem={slider.cms_slider_images}
          type={slider.type}
          width={width}
        />
      );
    } else if ((component.type == 'product_carousel') && (component.value.display_carousel === true)) {
      return (
        <SliderProductWithBanner
          data={component}
          products={products}
          type={component.value.layout}
          productPerPage={component.value.number_of_products}
        />
      );
    } else if ((component.type == 'product_carousel') && (component.value.display_carousel === false)) {
      return (
        <ProductCarousel
          data={component}
          products={products}
          type={component.value.layout}
          productPerPage={component.value.number_of_products}
        />
      );
    } else if (component.type == 'image_carousel') {
      return <ImageCarousel data={component.value} />;
    } else if (component.type == 'notice') {
      return <Notice component={component.value} />;
    } else if (component.type == 'article') {
      return <Article data={component} width={width} />;
    } else if (component.type == 'form') {
      return <Form data={component} />;
    } else if (component.type == 'separator') {
      return <Separator data={component} />;
    } else if (component.type == 'article_carousel') {
      return <ArticleCarousel data={component} />;
    } else if (component.type == 'image_gallery') {
      return <ImageGallery data={component} />;
    } else if (component.type == 'button') {
      return <ButtonWidget data={component} />;
    } else if (component.type == 'accordion') {
      return <Accordion data={component} />;
    } else if (component.type == 'advanced_slider') {
      return <AdvancedSlider data={component} />;
    } else if (
      component.type === 'cart' ||
      component.type === 'notification' ||
      component.type === 'chat' ||
      component.type === 'order' ||
      component.type === 'wishlist'
    ) {
      return <WidgetNavbar data={component} type={navbarType} index={index} />;
    } else if (component.type === 'search') {
      return <SearchBar data={component} />;
    } else if (component.type === 'icon') {
      return <IconWidget data={component} type={navbarType} index={index} />;
    } else if (component.type === 'membership_point') {
      return <MembershipPoint data={component.value} />;
    } else {
      return <Text>{component.type}</Text>;
    }
  };

  return getComponent();
}
