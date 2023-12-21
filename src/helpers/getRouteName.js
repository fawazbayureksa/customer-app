import {useNavigation} from '@react-navigation/native';
import {AuctionRouteName} from '../constants/auction_route/auctionRouteName';
import {ForumRouteName} from '../constants/forum_route/forumRouteName';
import {MainRouteName} from '../constants/mainRouteName';
import {MarketplaceRouteName} from '../constants/marketplace_route/marketplaceRouteName';

const getRouteName = data => {
  console.log(data);
  const {navigate} = useNavigation();
  //main
  if (data.includes('login')) {
    return MainRouteName.LOGIN;
  } else if (data.includes('notification')) {
    return MainRouteName.NOTIFICATION;
  } else if (data.includes('register')) {
    return MainRouteName.REGISTER;
  } else if (data.includes('account-settings')) {
    return MainRouteName.ACCOUNT;
  } else if (data.includes('article/')) {
    return (
      MainRouteName.DETAIL_ARTICLE,
      {
        article: data.replace('article/', '').replace('/', ''),
      }
    );
  }

  //MARKETPLACE
  else if (data.includes('cart')) {
    return MarketplaceRouteName.CART;
  } else if (data.includes('account-settings/my-orders')) {
    return MarketplaceRouteName.ORDER_LIST;
  } else if (data.includes('account-settings/wishlist')) {
    return MarketplaceRouteName.WISHLIST;
  } else if (data.includes('products')) {
    return MarketplaceRouteName.PRODUCTS;
  } else if (data.includes('checkout-order')) {
    return MarketplaceRouteName.CHECKOUT;
  } else if (data.includes('product/')) {
    let url = data;
    let slug = url.replace('product/', '');
    if (slug[0] == '/') {
      slug = slug.substring(1);
    }
    let index = slug.indexOf('/');
    return (
      MarketplaceRouteName.PRODUCT_DETAIL,
      {
        product: {
          mp_seller: {slug: slug.substring(0, index)},
          slug: slug.split('/')[1],
        },
      }
    );
  }

  //FORUM
  else if (data.includes('forum/my/list')) {
    return ForumRouteName.FORUMLIST;
  } else if (data.includes('forum/my')) {
    return ForumRouteName.MY_FORUM;
  }

  //AUCTION
  else if (data.includes('auction/my')) {
    return AuctionRouteName.HOME_AUCTION;
  }

  //WEBINAR
  else if (data.includes('webinar/dashboard')) {
    return WebinarRouteName.WEBINAR_DASHBOARD;
  } else {
    console.log(data);
  }
};

export default getRouteName;
