import { AuctionRouteName } from './auctionRouteName';
import React from 'react';
import { ArrowLeft2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  AuctionList,
  DetailAuction,
  HistoryAuction,
  HomeAuction,
  SearchAuction,
} from '../../screens';
import { MarketplaceRouteName } from '../marketplace_route/marketplaceRouteName';

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

const RightCustomButton = () => {
  const navigation = useNavigation();

  return (
    <>
      <Icon
        style={{ marginHorizontal: 4 }}
        name="favorite-border"
        size={26}
        color="#000"
        onPress={() => navigation.navigate(MarketplaceRouteName.WISHLIST)}
      />
      <Icon
        style={{ marginHorizontal: 4 }}
        name="playlist-add-check"
        size={26}
        color="#000"
        onPress={() => navigation.navigate(AuctionRouteName.HISTORY_AUCTION)}
      />
      <Icon
        style={{ marginHorizontal: 4 }}
        name="search"
        size={26}
        color="#000"
        onPress={() => navigation.navigate(AuctionRouteName.SEARCH_AUCTION)}
      />
    </>
  );
};

const AuctionRoute = [
  {
    path: AuctionRouteName.HOME_AUCTION,
    component: HomeAuction,
    headerLeft: () => <ArrowBackButton />,
    headerRight: () => <RightCustomButton />,
  },
  {
    path: AuctionRouteName.DETAIL_AUCTION,
    component: DetailAuction,
    headerLeft: () => <ArrowBackButton />,
  },
  {
    path: AuctionRouteName.HISTORY_AUCTION,
    component: HistoryAuction,
    headerLeft: () => <ArrowBackButton />,
  },
  {
    path: AuctionRouteName.SEARCH_AUCTION,
    component: SearchAuction,
    headerShown: false,
  },
  {
    path: AuctionRouteName.AUCTION,
    component: AuctionList,
    title: 'Pencarian Product Lelang',
    headerLeft: () => (
      <>
        <ArrowBackButton />
      </>
    ),
  },
];

export default AuctionRoute;
