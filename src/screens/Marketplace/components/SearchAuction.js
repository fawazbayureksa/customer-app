import { useNavigation } from '@react-navigation/native';
import { ArrowLeft2, SearchNormal1 } from 'iconsax-react-native';
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../../../assets/theme/colors';
import { AuctionRouteName } from '../../../constants/auction_route/auctionRouteName';
import { MarketplaceRouteName } from '../../../constants/marketplace_route/marketplaceRouteName';

const SearchAuction = () => {
  const { navigate } = useNavigation();
  const tabName = [
    'Mixer',
    'Oven',
    'Small Appliance',
    'Kompor Tanam',
    'Kulkas',
    'Komunikasi',
  ];
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const WIDTH = Dimensions.get('window').width * 0.95;

  const navigation = useNavigation();

  const onChangeTab = query => {
    setSearchQuery(query);
    // navigation.navigate(ForumRouteName.RESULT_SEARCH_THREAD, {
    //   search: query,
    // });
  };

  const onSearch = () => {
    navigate(AuctionRouteName.AUCTION, {
      search: searchQuery,
      type: 'auction',
    });
  };

  return (
    <ScrollView
      nestedScrollEnabled={true}
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          width: WIDTH,
          marginRight: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <ArrowLeft2
          size="24"
          color="#000"
          onPress={() => navigation.goBack()}
          style={{ marginRight: 5 }}
        />
        <SearchNormal1
          size="18"
          color={colors.pasive}
          style={{ marginRight: -25, zIndex: 99, marginLeft: 0 }}
        />
        <TextInput
          style={{
            backgroundColor: colors?.line,
            width: WIDTH * 0.97,
            borderRadius: 30,
            padding: 5,
            paddingLeft: 30,
          }}
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          onSubmitEditing={onSearch}
        />
      </View>
      <View
        style={{
          flex: 1,
          marginTop: 20,
          width: WIDTH,
          marginHorizontal: 10,
        }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
          }}>
          Lagi Banyak Dicari
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginVertical: 10,
            flexWrap: 'wrap',
          }}>
          {tabName.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onChangeTab(item)}
              style={{
                marginBottom: 8,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 38,
                marginHorizontal: 5,
                padding: 10,
                backgroundColor: colors?.white,
                borderWidth: 1,
                borderColor: colors?.line,
              }}>
              <Text style={{}}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default SearchAuction;
