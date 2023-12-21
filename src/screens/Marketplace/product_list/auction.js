import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Template from '../../../components/Template';
import axiosInstance from '../../../helpers/axiosInstance';
import BodyProduct from '../components/BodyProduct';
import FloatingButton from '../components/FloatingButton';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import { Searchbar } from 'react-native-paper';
import SellerArea from '../components/SellerArea';
import ProductCategory from '../components/ProductCategory';
import { useSelector } from 'react-redux';
import RangePrice from '../components/RangePrice';
import Rating from '../components/Rating';
import DeliveryMethod from '../components/DeliveryMethod';

const WIDTH = Dimensions.get('window').width;

export default function AuctionList({ route }) {
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const initFilter = {
        rating: '',
        search: route?.params?.search,
        order_by: 'date',
        order: 'desc',
        length: 7,
        category: '',
        area: '',
        delivery_method: '',
        min_price: '',
        max_price: '',
        type: 'auction',
    };

    useEffect(() => {
        getCmsProductList();
        getCategory();
        getSellerArea();
        getDeliveryMethod();
    }, []);

    const [sections, setSections] = useState([]);
    const [showFilterButton, setShowFilterButton] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filter, setFilter] = useState(initFilter);
    const [category, setCategory] = useState([]);
    const [sellerArea, setSellerArea] = useState([]);
    const [deliveryMethod, setDeliveryMethod] = useState([]);
    const { t } = useTranslation();

    const getCmsProductList = () => {
        axiosInstance
            .get(`cms/getProductList`)
            .then(res => {
                let data = res.data.data;
                let sections = [];
                if (data && data) {
                    res.data.data.forEach(section => {
                        if (JSON.parse(section?.style).visibility_mobile == true) {
                            sections.push(section);
                            section.rows.forEach(row => {
                                // rows.push(row);
                                row.columns.forEach(column => {
                                    // columns.push(column);
                                    column.components.forEach(component => {
                                        component.value = JSON.parse(component.value);
                                        // components.push(component);
                                        if (component.style) {
                                            component.style = JSON.parse(component.style) || {};
                                        }
                                    });
                                    column.style = JSON.parse(column.style) || {};
                                });
                                row.style = JSON.parse(row.style) || {};
                            });
                        }
                        section.style = JSON.parse(section.style) || {};
                    });
                }
                setSections(sections);
                setShowFilterButton(
                    JSON.stringify(sections).includes('product_filter'),
                );
            })
            .catch(error => {
                console.error('getProductList', error);
            });
    };

    const onChangeSearch = text => {
        setFilter({ ...filter, search: text });
    };

    const onChangeFilter = (type, value) => {
        setFilter({ ...filter, [type]: value });
    };

    const getCategory = () => {
        axiosInstance
            .get(`ecommerce/products/categories/get`)
            .then(res => {
                setCategory(res.data.data);
            })
            .catch(error => {
                console.error('getProductList', error);
            });
    };

    const getSellerArea = () => {
        axiosInstance
            .get(`ecommerce/products/seller-area/get`)
            .then(res => {
                setSellerArea(res.data.data);
            })
            .catch(error => {
                console.error('getProductList', error);
            });
    };

    const getDeliveryMethod = () => {
        axiosInstance
            .get(`ecommerce/products/delivery-methods/get`)
            .then(res => {
                setDeliveryMethod(res.data.data);
            })
            .catch(error => {
                console.error('getProductList', error);
            });
    };

    return (
        <>
            <Template scroll={true} url="products">
                <View
                    style={{
                        flexGrow: 1,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        flex: 1,
                    }}>
                    <BodyProduct data={sections} filter={filter} typeName={"auction"} />
                </View>
            </Template>
            {showFilterButton && (
                <FloatingButton
                    style={{
                        position: 'absolute',
                        bottom: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        left: 0,
                        right: 0,
                    }}
                    onPress={() => setShowFilterModal(true)}
                />
            )}
            <Modal isVisible={showFilterModal}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                    }}>
                    <ScrollView>
                        <View
                            style={{
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                marginVertical: 10,
                            }}>
                            <TouchableOpacity>
                                <Text
                                    style={{ fontSize: 18, fontWeight: '700', color: '#303030' }}>
                                    Filter
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                                <Text
                                    style={{ fontSize: 18, fontWeight: '700', color: '#303030' }}>
                                    X
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={{ marginVertical: 8, paddingHorizontal: 3 }}>
                <Searchbar
                  placeholder="Search"
                  onChangeText={onChangeSearch}
                  value={filter.search}
                />
              </View> */}
                        <TouchableOpacity
                            onPress={() => {
                                setShowFilterModal(false);
                                setFilter(initFilter);
                            }}
                            style={{ marginVertical: 10 }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: '700',
                                    color: '#F54C4C',
                                    textAlign: 'right',
                                }}>
                                Hapus Filter
                            </Text>
                        </TouchableOpacity>

                        <ProductCategory
                            filter={filter}
                            themeSetting={themeSetting?.accent_color?.value}
                            category={category}
                            onChangeFilter={onChangeFilter}
                        />

                        <SellerArea
                            style={{ marginVertical: 4 }}
                            area={sellerArea}
                            onChangeFilter={onChangeFilter}
                            filter={filter}
                            themeSetting={themeSetting?.accent_color?.value}
                        />

                        <RangePrice onChangeFilter={onChangeFilter} filter={filter} />

                        <Rating
                            onChangeFilter={onChangeFilter}
                            filter={filter}
                            themeSetting={themeSetting?.accent_color?.value}
                        />
                        <DeliveryMethod
                            deliveryMethod={deliveryMethod}
                            onChangeFilter={onChangeFilter}
                            filter={filter}
                            themeSetting={themeSetting?.accent_color?.value}
                        />
                    </ScrollView>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    textCategory: { marginVertical: 2 },
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: 'black',
});
