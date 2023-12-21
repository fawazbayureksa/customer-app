import { useNavigation } from '@react-navigation/native';
import {
  Cart,
  ChatOptions,
  Checkout,
  DetailPayment,
  OrderDetail,
  OrderList,
  Payment,
  ProductDetail,
  ProductsList,
  Rating,
  SellerProfile,
  WaitingPayment,
  Wishlist,
} from '../../screens';
import { MarketplaceRouteName } from './marketplaceRouteName';
import { ArrowLeft2 } from 'iconsax-react-native';
import React from 'react';

const ArrowBackButton = () => {
  const navigation = useNavigation();

  return (
    <ArrowLeft2
      size="24"
      color="#000"
      onPress={() => {
        navigation.goBack();
      }}
      style={{ marginRight: 10 }}
    />
  );
};

const MarketplaceRoute = [
  {
    path: MarketplaceRouteName.PRODUCTS,
    component: ProductsList,
    title: 'Pencarian',
    headerLeft: () => (
      <>
        <ArrowBackButton />
      </>
    ),
  },
  {
    path: MarketplaceRouteName.PRODUCT_DETAIL,
    component: ProductDetail,
    title: 'Detail Produk',
    headerLeft: () => (
      <>
        <ArrowBackButton />
      </>
    ),
  },
  {
    path: MarketplaceRouteName.CART,
    component: Cart,
    headerShown: false,
  },
  {
    path: MarketplaceRouteName.CHECKOUT,
    component: Checkout,
    headerShown: false,
  },
  {
    path: MarketplaceRouteName.PAYMENT,
    component: Payment,
    headerShown: false,
  },
  {
    path: MarketplaceRouteName.WAITING_PAYMENT,
    component: WaitingPayment,
    headerShown: false,
  },
  {
    path: MarketplaceRouteName.DETAIL_PAYMENT,
    component: DetailPayment,
    headerShown: false,
  },
  {
    path: MarketplaceRouteName.ORDER_LIST,
    component: OrderList,
    headerShown: false,
  },
  {
    path: MarketplaceRouteName.WISHLIST,
    component: Wishlist,
    headerLeft: () => (
      <>
        <ArrowBackButton />
      </>
    ),
  },
  {
    path: MarketplaceRouteName.RATING,
    component: Rating,
    title: 'Berikan Ulasan',
    headerLeft: () => (
      <>
        <ArrowBackButton />
      </>
    ),
  },
  {
    path: MarketplaceRouteName.CHAT_OPTIONS,
    component: ChatOptions,
    title: 'Pesan',
    headerLeft: () => (
      <>
        <ArrowBackButton />
      </>
    ),
  },
  {
    path: MarketplaceRouteName.ORDER_DETAIL,
    component: OrderDetail,
    title: 'Detail Pesanan',
    headerLeft: () => (
      <>
        <ArrowBackButton />
      </>
    ),
  },
  {
    path: MarketplaceRouteName.SELLER_PROFILE,
    component: SellerProfile,
    title: 'Detail Seller',
    headerLeft: () => (
      <>
        <ArrowBackButton />
      </>
    ),
  },
];

export default MarketplaceRoute;
