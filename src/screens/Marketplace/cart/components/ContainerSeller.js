import { View, Text, Dimensions } from 'react-native';
import React from 'react';
import { Shadow } from 'react-native-shadow-2';
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Divider } from '../../../../components/Divider';
import ContainerProducts from './ContainerProducts';

const WIDTH = Dimensions.get('window').width;

export default function ContainerSeller(props) {
  const [checkedSeller, setCheckedSeller] = React.useState({});

  const onChangeCheckbox = id => {
    setCheckedSeller({
      ...checkedSeller,
      ['checkboxSeller_' + id]: !checkedSeller['checkboxSeller_' + id],
    });

    props.checkSellerCheckboxOnChange(
      props.item,
      !checkedSeller['checkboxSeller_' + id],
    );
  };

  const checkSellerCheckbox = data => {
    let flag = true;
    data.carts.forEach(value => {
      if (!props.selectedIds.includes(value.id)) {
        flag = false;
      }
    });

    return flag;
  };

  return (
    <View key={props.index1}>
      {/* <Shadow distance={3} startColor={'#00000010'} radius={8}> */}
      <View
        style={{
          width: WIDTH * 0.95,
          backgroundColor: '#fff',
          borderRadius: 6,
          paddingVertical: 8,
          // borderWidth: 1,
          borderColor: 'rgba(10, 0, 0, 0.1)',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Checkbox
            status={checkSellerCheckbox(props.item) ? 'checked' : 'unchecked'}
            onPress={() => {
              onChangeCheckbox(props.item.id);
            }}
            color="#FA9E25"
          />
          <Icon
            name="check-circle"
            size={20}
            color="#FA9E25"
            style={{ marginHorizontal: 5 }}
          />
          <Text style={{ fontWeight: '700', color: "#404040", fontSize: 16 }}>{props.item.seller.name}</Text>
        </View>
        <Divider />

        {props.item.carts.length > 0 &&
          props.item.carts.map((product, index2) => {
            return (
              <ContainerProducts
                checkedProduct={props.checkedProduct}
                setCheckedProduct={props.setCheckedProduct}
                product={product}
                index={index2}
                onChangeQuantity={props.onChangeQuantity}
                themeSetting={props.themeSetting}
                quantity={props.quantity}
                selectedIds={props.selectedIds}
                checkProductCheckboxOnChange={
                  props.checkProductCheckboxOnChange
                }
                onDeleteProductFromCart={props.onDeleteProductFromCart}
                setModalConfirmDelete={props.setModalConfirmDelete}
                setIdSelected={props.setIdSelected}
                onAddToWisthlist={props.onAddToWisthlist}
                onUpdateQuantity={props.onUpdateQuantity}
                loadingQuantity={props.loadingQuantity}
                indexQuantity={props.indexQuantity}
                onBlurQuantity={props.onBlurQuantity}
                addPwp={props.addPwp}
              />
            );
          })}
      </View>
      {/* </Shadow> */}
    </View>
  );
}
