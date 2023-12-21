import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../../../assets/theme/colors';
import convertCSS from '../../../helpers/convertCSS';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CustomDivider, Divider } from '../../../components/Divider';
import DropDownPicker from 'react-native-dropdown-picker';
import axiosInstance from '../../../helpers/axiosInstance';
import { IMAGE_URL } from '@env';
import Card from './components/Card';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';
import { MainRouteName } from '../../../constants/mainRouteName';
import { ChatRouteName } from '../../../constants/chat_route/ChatRouteName';
import { useNavigation } from '@react-navigation/native';
import TabInformation from './components/TabInformation';

const Index = ({ route }) => {
    const [indexStatusSelected, setIndexStatusSelected] = useState(0);
    const WIDTH = Dimensions.get('window').width;
    const [labelOpen, setLabelOpen] = useState(false);
    const [labelValue, setLabelValue] = React.useState('all');
    const [LabelItem, setLabelItem] = React.useState([]);

    const [sortOpen, setSortOpen] = useState(false);
    const [sortValue, setSortValue] = React.useState();

    const [data, setData] = useState({});
    const [dataSeller, setDataSeller] = useState({});
    const [dataProduct, setDataProduct] = useState([]);
    const [isLoadMore, setIsLoadMore] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [lastPage, setLastPage] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [page, setPage] = useState(1);
    const [isFollowed, setIsFollowed] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [information, setInformation] = useState([]);
    const [CategorySeller, setCategorySeller] = useState([
        { key: 'produk', label: 'Produk' },
        { key: 'live_streaming', label: 'Live Streaming' },
        { key: 'forum', label: 'Forum' }
    ]);
    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const toast = useToast();
    const navigation = useNavigation();
    const { navigate } = useNavigation();
    const { t } = useTranslation();

    const SortItem = [
        { value: "newest", label: "Terbaru" },
    ]

    useEffect(() => {
        getDetailSeller(route.params.seller_slug)
    }, [])

    useEffect(() => {
        getProduct()
    }, [labelValue, sortValue])

    const getDetailSeller = (slug) => {
        setLoading(true)
        axiosInstance.get(`ecommerce/seller/find?seller_slug=${slug}`)
            .then(res => {
                let labelOptions = [{ label: "Semua", value: "all" }]
                let data = res.data.data;
                setData(data);
                res.data.data.sellerData.labels.forEach((value =>
                    labelOptions.push({ label: value.name, value: value.id })
                ))
                setLabelItem(labelOptions)
                setDataSeller(data.sellerData)
                setIsFollowed(data.sellerData?.follow?.is_follow);
                let information = data.sellerData.informations[0].section
                let section = JSON.parse(information)
                setInformation(section)
                CategorySeller.push({ label: section[0].title, key: section[0].title })
                setCategorySeller(CategorySeller)
            })
            .catch(err => {
                console.log('error Detail Seller', err.response.data.message);
            })
        setLoading(false)
    }

    const getProduct = () => {
        setLoading(true)
        axiosInstance.get(`ecommerce/seller/product?seller_slug=${route?.params?.seller_slug}&search=&label=${labelValue == 'all' ? 0 : labelValue}&order_column=${sortValue ? sortValue : ''}&order_dir=asc&per_page=10&page=${currentPage}`)
            .then(res => {
                let data = res.data.data;
                setDataProduct(data.data);
                setLastPage(data.data.last_page)
            })
            .catch(error => {
                console.log('error getProductSeller', error.response.data);
            }).finally(() => {
                setLoading(false)
            })
    }

    const handlePagination = async () => {
        let newPage = currentPage + 1;
        if (newPage > lastPage) {
            return;
        } else if (isLoadMore) {
            return;
        } else {
            setIsLoadMore(true);
            await axiosInstance
                .get(`ecommerce/seller/product?seller_slug=${route?.params?.seller_slug}&search=&label=${labelValue == 'all' ? 0 : labelValue}&order_column=${sortValue ? sortValue : ''}&order_dir=asc&per_page=10&page=${newPage}`)
                .then(res => {
                    const newList = dataProduct.concat(res.data.data.data);
                    setDataProduct(newList);
                    setCurrentPage(newPage);
                })
                .finally(() => setIsLoadMore(false));
        }
    };

    const onFollow = () => {

        if (!isLoggedIn) {
            navigate(MainRouteName.LOGIN);
            return
        }

        setLoadingSubmit(true);
        let params = {
            is_follow: !isFollowed,
            mp_seller_id: dataSeller.id,
        };
        // console.log(params);
        // return
        let url = 'ecommerce/seller/follow';
        axiosInstance
            .post(url, params)
            .then(response => {
                if (response.data.success) {
                    toast.show(
                        t(isFollowed ? 'common:successUnfollow' : 'common:successFollow'),
                        {
                            placement: 'top',
                            type: 'success',
                            animationType: 'zoom-in',
                            duration: 3000,
                        },
                    );
                    setIsFollowed(!isFollowed);
                }
                getDetailSeller()
            })
            .catch(error => console.log('error onAddToCart', error.response.data))
            .finally(() => setLoadingSubmit(false));
    };

    const goChat = () => {
        navigation.push(ChatRouteName.CHAT_MESSAGE, { newUser: { id: dataSeller.id, type: "seller" } })
    }
    const renderFooter = () => {
        return (
            <>
                {isLoadMore && (
                    <ActivityIndicator
                        color={'#2C465C'}
                        size={'small'}
                        style={{ padding: 10 }}
                    />
                )}
            </>
        );
    };

    return (
        <>
            {loading ?
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                }}>
                    <ActivityIndicator
                        color={themeSetting.accent_color.value}
                        size={'large'}
                        style={{ padding: 10 }}
                    />
                </View>
                :
                <ScrollView nestedScrollEnabled style={{ backgroundColor: colors.white }}>
                    <Image
                        style={{
                            width: WIDTH,
                            height: WIDTH * 0.25,
                            backgroundColor: "#ececec"
                        }}
                        source={{
                            uri: `${IMAGE_URL}public/seller/${dataSeller?.cover_picture}`,
                        }}
                    />
                    <View style={[styles.section, { marginTop: 10, marginHorizontal: 10 }]}>
                        <Image
                            source={{
                                uri: `${IMAGE_URL}public/seller/${dataSeller?.logo}`,
                            }}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                backgroundColor: "#ececec"
                            }}
                        />
                        <View
                            style={{ marginLeft: 10 }}
                        >
                            <Text
                                style={{
                                    fontSize: convertCSS(themeSetting.h5_typography.font_size),
                                    fontWeight: "700"
                                }}
                            >
                                {dataSeller?.name}
                            </Text>
                            <View style={[styles.section, { marginTop: 10 }]}>
                                <Text
                                    style={{ fontSize: convertCSS(themeSetting.body_typography.font_size), marginRight: 10 }}
                                >
                                    0 following
                                </Text>
                                <Text>|</Text>
                                <Text
                                    style={{ fontSize: convertCSS(themeSetting.body_typography.font_size), marginLeft: 10 }}
                                >
                                    {data?.sellerFollower} followers
                                </Text>
                            </View>
                            <View style={[styles.section, { marginTop: 10 }]}>
                                <TouchableOpacity
                                    onPress={goChat}
                                    style={[styles.buttonDraft, { borderWidth: 1, borderColor: colors?.line, marginRight: 10, height: 30, backgroundColor: colors?.white }]}>
                                    <Text
                                        style={{ color: themeSetting?.accent_color?.value }}
                                    >Hubungi</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onFollow} style={[styles.buttonDraft, { height: 30, backgroundColor: themeSetting?.accent_color?.value }]}>
                                    <Text
                                        style={{ color: colors?.white }}
                                    >

                                        {t(isFollowed ? 'common:unfollow' : 'common:follow')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={[
                        styles.section, {
                            marginTop: 20,
                            marginHorizontal: 10,
                            justifyContent: "space-around",
                        }]}>
                        <View>
                            <Text>Ulasan Produk</Text>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <Text style={{
                                    fontSize: convertCSS(themeSetting.h2_typography.font_size),
                                    fontWeight: "600"
                                }}>
                                    {data?.sellerRating}
                                </Text>
                                <Text style={{
                                    alignSelf: "flex-end"
                                }}>
                                    /5
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                {[1, 2, 3, 4, 5].map(rating => (
                                    <Icon name="star" size={16} color="#FFC107" />
                                ),
                                )}
                            </View>
                            <Text>({data?.sellerReview} Ulasan)</Text>
                        </View>
                        <View style={{ alignSelf: "flex-start" }}>
                            <Text>{data?.soldProduct} Produk Terjual</Text>
                            <Text>{data?.successTransaction} Transaksi Berhasil</Text>
                        </View>
                    </View>
                    <CustomDivider />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                        <View style={{ paddingVertical: 8, flexDirection: 'row', width: "100%" }}>
                            {
                                CategorySeller.map((item, index) => {
                                    return (
                                        <View style={{ width: WIDTH / 3 }}>
                                            <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 8, alignSelf: "center" }} onPress={() => setIndexStatusSelected(index)}>
                                                <Text style={{
                                                    color: indexStatusSelected == index ? themeSetting.accent_color.value : '#A6A6A6',
                                                    fontWeight: indexStatusSelected == index ? '700' : '400'
                                                }}>{item.label}</Text>
                                            </TouchableOpacity>
                                            <View style={{
                                                marginVertical: 5, height: 3, backgroundColor: indexStatusSelected == index ? themeSetting.accent_color.value : '#DCDCDC'
                                            }} />
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                    {indexStatusSelected === 0 &&
                        <>
                            <View style={{ marginHorizontal: 10, marginTop: 5 }}>
                                <Text style={{ marginTop: 5, marginBottom: 5 }}>Label</Text>
                                <DropDownPicker
                                    zIndex={1000}
                                    open={labelOpen}
                                    items={LabelItem}
                                    setOpen={setLabelOpen}
                                    value={labelValue}
                                    setValue={setLabelValue}
                                    listMode="SCROLLVIEW"
                                    // placeholder="Choose a label"
                                    placeholderStyle={{ color: 'grey' }}
                                    scrollViewProps={{
                                        nestedScrollEnabled: true,
                                    }}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(10, 0, 0, 0.1)',
                                    }}
                                    dropDownContainerStyle={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(10, 0, 0, 0.1)',
                                    }}
                                />
                                <Text style={{ marginTop: 10, marginBottom: 5 }}>Urutkan</Text>
                                <DropDownPicker
                                    zIndex={888}
                                    open={sortOpen}
                                    items={SortItem}
                                    setOpen={setSortOpen}
                                    value={sortValue}
                                    setValue={setSortValue}
                                    listMode="SCROLLVIEW"
                                    placeholder="Choose"
                                    placeholderStyle={{ color: 'grey' }}
                                    scrollViewProps={{
                                        nestedScrollEnabled: true,
                                    }}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(10, 0, 0, 0.1)',
                                    }}
                                    dropDownContainerStyle={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(10, 0, 0, 0.1)',
                                    }}
                                />
                            </View>
                            <View style={{ marginHorizontal: 6, marginTop: 5, width: "100%" }}>
                                <FlatList
                                    data={dataProduct}
                                    keyExtractor={(item, index) => item.id}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View
                                                style={{
                                                    marginHorizontal: 5,
                                                }}>
                                                <Card
                                                    item={item}
                                                    index={index}
                                                    type={""}
                                                />
                                            </View>
                                        );
                                    }}
                                    onEndReachedThreshold={0.2}
                                    numColumns={2}
                                    onEndReached={() => handlePagination()}
                                    ListFooterComponent={renderFooter}
                                />
                            </View>
                        </>
                    }
                    {indexStatusSelected > 2 &&
                        <TabInformation infromation={information} />
                    }
                </ScrollView>
            }</>
    );
}

const styles = StyleSheet.create({
    section: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
    },
    buttonDraft: {
        height: 40,
        borderRadius: 5,
        marginTop: 10,
        width: "100%",
        flex: 1,
        justifyContent: "center", alignItems: "center",
    }
    ,
})

export default Index;
