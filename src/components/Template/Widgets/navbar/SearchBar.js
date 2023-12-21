import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { MarketplaceRouteName } from '../../../../constants/marketplace_route/marketplaceRouteName';
import SelectDropdown from 'react-native-select-dropdown';
import { ArrowDown2 } from 'iconsax-react-native';
import colors from '../../../../assets/theme/colors';

export default function SearchBar({ data }) {
  const [search, setSearch] = React.useState('');
  const [type, setType] = React.useState('');
  const { navigate } = useNavigation();

  const onSearch = () => {
    navigate(MarketplaceRouteName.PRODUCTS, { search: search, type: type });
  };

  const WIDTH = Dimensions.get('window').width * 0.95;
  const options = [
    { value: '', label: 'Product' },
    { value: 'seller', label: 'Seller' },
    { value: 'article', label: 'Article' },
  ]
  const truncate = str => {
    if (str.length > 15) {
      return str.slice(0, 15) + '...';
    } else {
      return str;
    }
  };
  return (
    <View style={{ paddingVertical: 10 }}>
      <View
        style={{
          paddingHorizontal: 5,
          height: 30,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 20,
        }}>
        <SelectDropdown
          data={options}
          onSelect={(selectedItem, index) => {
            setType(selectedItem.value)
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.label
          }}
          rowTextForSelection={(item, index) => {
            return item?.label
          }}
          buttonTextStyle={{
            fontSize: 10
          }}
          dropdownStyle={{
            borderRadius: 5,
          }}
          buttonStyle={{
            backgroundColor: colors?.white,
            width: WIDTH / 4,
            textAlign: "left",
            height: 20,
          }}
          rowStyle={{
            height: 30
          }}
          rowTextStyle={{
            fontSize: 12,
            textAlign: "left",
          }}
          renderDropdownIcon={() => (
            <ArrowDown2
              size="18"
              color="#000"
            />
          )}
          defaultValue={type}
          defaultValueByIndex={0}
        />
        <TextInput
          onChangeText={text => setSearch(text)}
          placeholder={truncate(data?.value?.placeholder)}
          style={{
            height: 40,
            marginLeft: -12,
            // borderWidth: 1,
            padding: 10,
            fontSize: 12
          }}
          onSubmitEditing={onSearch}
        />
        {data.value.type === 'type_2' && (
          <TouchableOpacity onPress={onSearch}>
            {/* <Icon name="search" size={20} color={'grey'} /> */}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
