import { View, Text, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Template from '../../../components/Template';
import axiosInstance from '../../../helpers/axiosInstance';
import { useSelector } from 'react-redux';
import ContainerSeller from './components/ContainerSeller';
import EmptyCard from './components/EmptyCard';
import Summary from './components/Summary';
import Modal from 'react-native-modal';
import CustomButton from '../../../components/CustomButton';
import { CustomDivider, Divider } from '../../../components/Divider';
import { useToast } from 'react-native-toast-notifications';
import IsEmpty from '../../../helpers/IsEmpty';
import { MarketplaceRouteName } from '../../../constants/marketplace_route/marketplaceRouteName';
import { ArrowLeft2 } from 'iconsax-react-native';
import AuctionList from './components/AuctionList';
import { cartCheckoutGetDataShown, cartCheckoutGetDataShown2 } from './helpers/CartHelpers';
import PwpModal from './components/PwpModal';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function Cart({ navigation }) {
  const { t } = useTranslation();
  const toast = useToast();
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const [dataShown, setDataShown] = useState([])
  const [cart, setCart] = useState([]);
  const [checkedSeller, setCheckedSeller] = useState(false);
  const [checkedProduct, setCheckedProduct] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingQuantity, setLoadingQuantity] = useState(false);
  const [indexQuantity, setIndexQuantity] = useState(null);
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
  const [idSelected, setIdSelected] = useState([]);
  const [modalPwp, setModalPwp] = useState(false)
  const [dataPwp, setDataPwp] = useState(null)
  const [modalKey, setModalKey] = useState(null)
  const [scrollOffset, setScrollOffset] = React.useState(null);

  useEffect(() => {
    getCart();
    const willFocusSubscription = navigation.addListener('focus', () => {
      setSelectedIds([]);
      getCart();
    });

    return willFocusSubscription;
  }, []);

  useEffect(() => {
    if (cart != null) {
      calculateTotalPrice();
    }
  }, [cart, selectedIds]);

  const getCart = () => {
    setLoading(true);
    axiosInstance
      .get(`cart/get`)
      .then(res => {
        let data = res.data.data;
        setCart(data);
      })
      .catch(error => {
        console.error('error getCart', error);
      })
      .finally(() => setLoading(false));
  };

  const addPwp = (id) => {
    axiosInstance
      .get(`ecommerce/product/getPwpByProductID/${id}`).then(response => {
        console.log(response.data.data, 'pwp')
        let details = []
        let other_product_modal_key = null
        for (const datum of response.data.data.details) {
          if (id === datum.mp_product_id) continue;

          details.push(datum)
          if (other_product_modal_key === null) other_product_modal_key = datum.mp_product_id;
        }
        response.data.data.details = details
        setModalPwp(true)
        setDataPwp(response.data.data)
        // this.setState({
        //   other_product_modal_open: true,
        //   other_product_modal_data: response.data.data,
        //   other_product_modal_key: other_product_modal_key,
        // })
      }).catch(error => {
        if (error.response.data.message === 'record not found') {
          toast.show('Tidak ada produk Pwp', {
            placement: 'top',
            type: 'danger',
            animationType: 'zoom-in',
            duration: 3000,
          });
        }
        console.log("error add pwp", error.response.data);
      }).finally(() => {

      });
  }

  const onChangeQuantity = (id, text, type, stock) => {
    setIndexQuantity(id);
    if (isPositiveInteger(text)) {
      setQuantity(1);
      onUpdateQuantity(id, text, type, stock);
    } else if (text == '') {
      // console.log('tes')
      setQuantity(0);
    }
  };

  const onBlurQuantity = (id, text, type, stock) => {
    setQuantity(1);
    onUpdateQuantity(id, text, type, stock);
  };

  const isPositiveInteger = str => {
    if (typeof str !== 'string') {
      return false;
    }

    const num = Number(str);

    if (Number.isInteger(num) && num > 0) {
      return true;
    }

    return false;
  };

  const checkSellerCheckboxOnChange = (value, checked) => {
    let tempDeleted = selectedIds;
    if (!checked) {
      value.carts.forEach(value1 => {
        tempDeleted.splice(
          tempDeleted.findIndex(value2 => value2 === value1.id),
          1,
        );
      });
    } else {
      value.carts.forEach(value1 => {
        tempDeleted.push(value1.id);
      });
    }
    setSelectedIds([...tempDeleted]);
  };

  const checkProductCheckboxOnChange = value1 => {
    let tempDeleted = selectedIds;
    if (tempDeleted.includes(value1.id)) {
      tempDeleted.splice(
        tempDeleted.findIndex(value2 => value2 === value1.id),
        1,
      );
    } else {
      tempDeleted.push(value1.id);
    }

    setSelectedIds([...tempDeleted]);
  };

  const checkSellerCheckbox = data => {
    let flag = true;
    data.forEach(value => {
      for (const item of value.items) {
        !this.state.inactive_product.includes(item.mp_product_sku_id) &&
          !this.state.selected_ids.includes(item.id);
        flag = false;
      }
    });

    return flag;
  };

  const calculateTotalPrice = () => {
    let totalPriceTemp = 0;
    let totalDiscountTemp = 0;

    for (const datum of cart) {
      for (const cartItem of datum.carts) {
        if (selectedIds.includes(cartItem.id)) {
          // totalPriceTemp += cartItem.mp_product_sku.price * cartItem.quantity;
          // totalDiscountTemp +=
          //   (parseInt(cartItem.mp_product_sku.normal_price) -
          //     parseInt(cartItem.mp_product_sku.price)) *
          //   cartItem.quantity;

          if (cartItem.mp_auction_bid) {
            totalPriceTemp +=
              cartItem.mp_auction_bid.bid_price * cartItem.quantity;
          } else if (cartItem.mp_product_sku.normal_price == 0) {
            totalPriceTemp += cartItem.mp_product_sku.price * cartItem.quantity;
          } else {
            totalPriceTemp +=
              cartItem.mp_product_sku.normal_price * cartItem.quantity;
            totalDiscountTemp +=
              (parseInt(cartItem.mp_product_sku.normal_price) -
                parseInt(cartItem.mp_product_sku.price)) *
              cartItem.quantity;
          }
        }
      }
    }
    setTotalPrice(totalPriceTemp);
    setTotalDiscount(totalDiscountTemp);
  };

  const onDeleteProductFromCart = () => {
    setLoadingSubmit(true);
    let data = {
      cart_ids: idSelected,
    };
    axiosInstance
      .post(`cart/delete-by-ids`, data)
      .then(res => {
        console.log(res.data.data);
        toast.show(t('common:successRemoveProductCart'), {
          placement: 'top',
          type: 'success',
          animationType: 'zoom-in',
          duration: 3000,
        });
        getCart();
        setSelectedIds([]);
      })
      .catch(error => {
        console.error('error onDeleteProductFromCart', error.response.data);
        error?.response.data
          ? toast.show(error.response.data.message, {
            placement: 'top',
            type: 'danger',
            animationType: 'zoom-in',
            duration: 3000,
          })
          : toast.show('Whoops, something went wrong!', {
            placement: 'top',
            type: 'danger',
            animationType: 'zoom-in',
            duration: 3000,
          });
      })
      .finally(() => {
        setLoadingSubmit(false);
        closeModal();
      });
  };

  const closeModal = () => {
    setModalConfirmDelete(false);
  };

  const onAddToWisthlist = item => {
    setLoadingSubmit(true);
    let url = 'my-wishlist/add';
    axiosInstance
      .post(url, {
        product_id: item.mp_product_id,
      })
      .then(response => {
        if (response.data.success) {
          toast.show(
            t(
              item.mp_wishlist == null
                ? 'common:successAddToWishList'
                : 'common:successRemoveFromWishList',
            ),
            {
              placement: 'top',
              type: 'success',
              animationType: 'zoom-in',
              duration: 3000,
            },
          );
          axiosInstance.get(`cart/get`).then(res => {
            let data = res.data.data;
            setCart(data);
          });
        }
      })
      .catch(error => console.log('error onAddToWisthlist', error))
      .finally(() => setLoadingSubmit(false));
  };

  const onUpdateQuantity = async (id, quantity, type, stock) => {
    let data = {
      cart_id: id,
      qty:
        type === 'minus'
          ? quantity - 1
          : type === 'add'
            ? quantity + 1
            : JSON.parse(quantity),
    };
    if (data.qty > 0) {
      if (data.qty <= stock) {
        setLoadingQuantity(true);
        axiosInstance
          .post('cart/update', data)
          .then(response => {
            if (response.data.success) {
              axiosInstance.get(`cart/get`).then(res => {
                let data = res.data.data;
                setCart(data);
              });
            }
          })
          .catch(error =>
            console.log('error onUpdateQuantity', error.response.data),
          )
          .finally(() => setLoadingQuantity(false));
      } else {
        toast.show(t('common:remainingStock') + ' ' + stock, {
          placement: 'top',
          type: 'warning',
          animationType: 'zoom-in',
          duration: 3000,
        });
      }
    }
  };

  const onBuy = () => {
    if (IsEmpty(selectedIds)) {
      toast.show(t('common:selectProduct'), {
        placement: 'top',
        type: 'warning',
        animationType: 'zoom-in',
        duration: 3000,
      });
    } else {
      setLoadingSubmit(true);
      let data = {
        cart_ids: selectedIds,
        lang: 'id',
      };
      axiosInstance
        .post(`cart/submit`, data)
        .then(res => {
          setSelectedIds([]);
          navigation.navigate(MarketplaceRouteName.CHECKOUT);
        })
        .catch(error => {
          console.error('error onBuy', error.response.data);
          error?.response.data
            ? toast.show(error.response.data.message, {
              placement: 'top',
              type: 'danger',
              animationType: 'zoom-in',
              duration: 3000,
            })
            : toast.show('Whoops, something went wrong!', {
              placement: 'top',
              type: 'danger',
              animationType: 'zoom-in',
              duration: 3000,
            });
        })
        .finally(() => {
          setLoadingSubmit(false);
        });
    }
  };
  // const addPwp = () => {
  //   setModalPwp(true)
  // }

  const scrollViewRef = React.createRef();

  const handleScrollTo = p => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };
  const handleOnScroll = event => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  return (
    <>
      {loading ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator
            size="large"
            color={themeSetting?.accent_color?.value}
          />
        </View>
      ) :

        cart != null && cart.length > 0 ?
          <>
            <Template scroll={true} url="cart">
              <View style={{ flexGrow: 1, padding: 8, flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                  <ArrowLeft2
                    size="24"
                    color="#000"
                    onPress={() => {
                      navigation.goBack();
                    }}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={{ fontSize: 18, fontWeight: '700' }}>
                    {t('common:myCart')}
                  </Text>
                </View>

                {cart.map((item, index1) => {
                  return (
                    <>
                      {JSON.stringify(item.carts).includes(
                        `"type":"auction"`,
                      ) && (
                          <>
                            <AuctionList
                              checkSellerCheckboxOnChange={
                                checkSellerCheckboxOnChange
                              }
                              index1={index1}
                              checkedSeller={checkedSeller}
                              setCheckedSeller={setCheckedSeller}
                              item={item}
                              checkedProduct={checkedProduct}
                              setCheckedProduct={setCheckedProduct}
                              onChangeQuantity={onChangeQuantity}
                              themeSetting={themeSetting}
                              quantity={quantity}
                              selectedIds={selectedIds}
                              checkProductCheckboxOnChange={
                                checkProductCheckboxOnChange
                              }
                              checkSellerCheckbox={checkSellerCheckbox}
                              onDeleteProductFromCart={onDeleteProductFromCart}
                              setModalConfirmDelete={setModalConfirmDelete}
                              setIdSelected={setIdSelected}
                              onAddToWisthlist={onAddToWisthlist}
                              onUpdateQuantity={onUpdateQuantity}
                              loadingQuantity={loadingQuantity}
                              indexQuantity={indexQuantity}
                              onBlurQuantity={onBlurQuantity}
                              onBuy={onBuy}
                              t={t}
                              type="auction"
                            />
                            <CustomDivider />
                          </>
                        )}
                      {JSON.stringify(item).includes(`"type":"general"`) && (
                        <>
                          <ContainerSeller
                            checkSellerCheckboxOnChange={
                              checkSellerCheckboxOnChange
                            }
                            index1={index1}
                            checkedSeller={checkedSeller}
                            setCheckedSeller={setCheckedSeller}
                            item={item}
                            checkedProduct={checkedProduct}
                            setCheckedProduct={setCheckedProduct}
                            onChangeQuantity={onChangeQuantity}
                            themeSetting={themeSetting}
                            quantity={quantity}
                            selectedIds={selectedIds}
                            checkProductCheckboxOnChange={
                              checkProductCheckboxOnChange
                            }
                            checkSellerCheckbox={checkSellerCheckbox}
                            onDeleteProductFromCart={onDeleteProductFromCart}
                            setModalConfirmDelete={setModalConfirmDelete}
                            setIdSelected={setIdSelected}
                            onAddToWisthlist={onAddToWisthlist}
                            onUpdateQuantity={onUpdateQuantity}
                            loadingQuantity={loadingQuantity}
                            indexQuantity={indexQuantity}
                            onBlurQuantity={onBlurQuantity}
                            onBuy={onBuy}
                            addPwp={addPwp}
                          />
                        </>
                      )}
                    </>
                  );
                })}

              </View>

            </Template>
            <View style={{ backgroundColor: '#fff' }}>

              <Summary
                totalPayment={totalPayment}
                totalPrice={totalPrice}
                totalDiscount={totalDiscount}
                loadingSubmit={loadingSubmit}
                onBuy={onBuy}
              />
            </View>

          </>

          :

          <Template scroll={true} url="cart">
            <View style={{ flex: 1, padding: 8, height: HEIGHT * 0.9 }}>
              <View style={{ flexDirection: 'row' }}>
                <ArrowLeft2
                  size="24"
                  color="#000"
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{ marginRight: 10 }}
                />
                <Text style={{ fontSize: 18, fontWeight: '700' }}>
                  {t('common:myCart')}
                </Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>

                <EmptyCard WIDTH={WIDTH} navigation={navigation} />
              </View>
            </View>
          </Template>

      }
      <Modal isVisible={modalConfirmDelete}>
        <View
          style={{
            height: 200,
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingVertical: 16,
            paddingHorizontal: 25,
          }}>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>
            {t('common:deleteProduct')}
          </Text>
          <Divider />
          <Text style={{ marginVertical: 16 }}>
            {t('common:confirmDelete')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 14,
            }}>
            <CustomButton
              style={{ width: '45%' }}
              loading={loadingSubmit}
              onPress={closeModal}
              disabled={loadingSubmit}
              secondary
              border
              title={t('common:cancel')}
            />
            <CustomButton
              style={{ width: '45%' }}
              loading={loadingSubmit}
              onPress={onDeleteProductFromCart}
              disabled={loadingSubmit}
              primary
              title={t('common:delete')}
            />
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={modalPwp}
        onBackdropPress={() => {
          setModalPwp(!modalPwp);
          setModalPwp(false);
        }}
        onBackButtonPress={() => {
          setModalPwp(!modalPwp);
          setModalPwp(false);
        }}
        propagateSwipe={true}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        swipeDirection={['down']}
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={300 - 200} // content height - ScrollView height
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingVertical: 16,
            paddingHorizontal: 14,
            maxHeight: HEIGHT * 0.9,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ fontWeight: '500', fontSize: 16 }}>
              Tambah Produk Lain
            </Text>
            <TouchableOpacity onPress={() => setModalPwp(false)} >
              <Text style={{ fontWeight: '500', fontSize: 16 }} >
                x
              </Text>
            </TouchableOpacity>
          </View>
          <Divider />
          {dataPwp && dataPwp.details.map((detail) => (
            <PwpModal
              detail={detail}
              t={t}
              setModalPwp={setModalPwp}
              getCart={getCart}
            />
          ))}
        </View>
      </Modal>
    </>
  );
}
