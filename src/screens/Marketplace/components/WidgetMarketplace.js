import { Text } from 'react-native';
import React from 'react';
import ProductList from './ProductList';
import AuctionList from './AuctionList';

export default function WidgetMarketplace({ component, filter, navigation, typeName, type }) {
  const getComponent = () => {
    if (component.type == 'product_list') {
      return (
        <>
          {typeName === "auction" ?
            <AuctionList data={component} filter={filter} navigation={navigation} typeName={typeName} />
            :
            <ProductList data={component} filter={filter} navigation={navigation} type={type} />
          }
        </>
      );
    } else if (component.type == 'product_filter') {
      return null;
    } else {
      return <Text>{component.type}</Text>;
    }
  };

  return getComponent();
}
