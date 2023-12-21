import { useNavigation } from '@react-navigation/native';
import { ArrowDown2, ArrowRight2, ArrowUp2, CloseCircle, SearchNormal1 } from 'iconsax-react-native';
import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, Dimensions, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import colors from '../../assets/theme/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GetMedia from '../../components/common/GetMedia';
import Modal from 'react-native-modal';
import { drsRouteName } from '../../constants/drs_route/drsRouteName';
import axiosInstance from '../../helpers/axiosInstance';
import { useEffect } from 'react';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { PaymentStatusText, StatusText } from '../../helpers/PaymentStatusText';
import Currency from '../../helpers/Currency';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/CustomButton/index'
import { useToast } from 'react-native-toast-notifications';

const Faq = ({ route }) => {
    const [transaction, setTransaction] = useState()
    const [loading, setLoading] = useState(false);
    const [mostFaq, setMostFaq] = useState([])
    const [searchFaq, setSearchFaq] = useState([])
    const [faq, setFaq] = useState([])
    const [selectedMostFaq, setSelectedMostFaq] = useState()
    const [modal, setModal] = useState(false)
    const [modalHelp, setModalHelp] = useState(false)
    const [response, setResponse] = useState('')
    const [message, setMessage] = useState('')
    const { navigate } = useNavigation();
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const [search, setSearch] = useState('');
    const WIDTH = Dimensions.get('window').width * 0.95;
    const HEIGHT = Dimensions.get('window').height;
    const state = useSelector(state => state);

    useEffect(() => {
        getMostViewFaqs()
        getFaq()
    }, []);

    useEffect(() => {
        if (route?.params?.item) setTransaction(route.params.item)
        else setTransaction()
    }, []);

    const getSearchFaq = () => {
        if (!search) return
        // setLoading(true);
        axiosInstance.get(`drs/faq/search?search=${search}`)
            .then((res) => {
                setSearchFaq(res.data.data)
                // console.log(res.data.data)
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                setLoading(false);
            })
    }
    const getMostViewFaqs = () => {
        // setLoading(true);
        axiosInstance.get('drs/faq/most-view/get')
            .then((res) => {
                setMostFaq(res.data.data)
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                setLoading(false);
            })
    }

    const getFaq = () => {
        // setLoading(true);
        axiosInstance.get('drs/faq/get')
            .then((res) => {
                setFaq(res.data.data)
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                setLoading(false);
            })
    }

    const handleModalFaq = (item) => {
        setSelectedMostFaq(item)
        setModal(!modal)
    }

    const { t } = useTranslation();

    const closeTransaction = () => { setTransaction() }

    const toast = useToast()

    const onSubmitRespon = () => {
        let data = {
            faq_id: selectedMostFaq.id,
            response: response,
            message: message
        }
        // console.log(data)
        // return
        axiosInstance.post('drs/faq/submit-response', data)
            .then((res) => {
                console.log(res.data);
                setModalHelp(false)
                toast.show(res.data.message, {
                    placement: 'top',
                    type: 'success',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            }).catch((err) => {
                toast.show(err.response.data.message, {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            })
    }

    const handleRespon = (status) => {
        setResponse(status)
        setModalHelp(true)
    }


    return (
        <>

            {loading ?
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                    }}>
                    <ActivityIndicator
                        color="orange"
                        size={'small'}
                        style={{ padding: 10 }}
                    />
                </View>
                :
                <ScrollView>
                    <View style={{ backgroundColor: colors.white, paddingVertical: 20 }}>
                        <View
                            style={{
                                width: WIDTH,
                                marginTop: 10
                            }}
                        >
                            <Image
                                source={require('../../assets/images/help_banner.png')}
                                style={{ width: "100%", resizeMode: 'contain', height: HEIGHT * 0.20 }}
                            />
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginHorizontal: "10%",
                                color: themeSetting?.accent_color?.value
                            }}>
                                Hallo, {JSON.parse(state?.authReducer?.user)?.name}! {t('faq:what_can_help')}
                            </Text>
                        </View>
                        <View
                            style={{
                                width: WIDTH,
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                                justifyContent: 'center',
                                marginHorizontal: 10,
                            }}
                        >
                            <TextInput
                                style={{
                                    backgroundColor: colors?.line,
                                    width: WIDTH * 0.85,
                                    borderTopLeftRadius: 10,
                                    borderBottomLeftRadius: 10,
                                    padding: 5,
                                    paddingLeft: 30,
                                }}
                                value={search}
                                placeholder={t('faq:search_help')}
                                onChangeText={(e) => setSearch(e)}
                            />
                            <View style={{
                                backgroundColor: themeSetting?.accent_color?.value,
                                padding: 7,
                                width: WIDTH * 0.10,
                                borderTopRightRadius: 10,
                                borderBottomRightRadius: 10,
                            }}>
                                <TouchableOpacity onPress={getSearchFaq}>
                                    <SearchNormal1
                                        size="24"
                                        color={colors.white}
                                        style={{ marginRight: -25, zIndex: 99, marginLeft: 0 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={{ textAlign: 'center', marginHorizontal: 10 }}>
                            {t('faq:example')} {t('faq:delivery_estimate')}
                        </Text>
                    </View>
                    {searchFaq.length > 0 &&
                        <View style={{ backgroundColor: colors.white, marginTop: 10, paddingVertical: 20 }}>
                            <View style={{ marginHorizontal: 10, flexDirection: "row", justifyContent: "space-between" }}>
                                <Text
                                    style={{ fontSize: 14, fontWeight: "700" }}
                                > {t('faq:result_search')}
                                </Text>
                                <TouchableOpacity onPress={() => { setSearchFaq([]); setSearch('') }}>
                                    <Text
                                        style={{ fontSize: 14, fontWeight: "700", color: colors?.danger }}
                                    >
                                        {t('faq:close_search')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {searchFaq.map((item, index) => (
                                <View style={{ marginHorizontal: 10, marginTop: 10 }} key={index}>
                                    <Shadow distance={3} startColor={'#00000010'} radius={8} >
                                        <View style={{ width: WIDTH, padding: 10 }}>
                                            <Collapse>
                                                <CollapseHeader>
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                            marginTop: 10,
                                                        }}>
                                                        <Text
                                                            style={{ fontSize: 14, fontWeight: "700", color: "#404040" }}
                                                        >
                                                            {item?.title}
                                                        </Text>
                                                        {/* <TouchableOpacity onPress={onCollapse}>
                                                {!collapse ? */}
                                                        <ArrowDown2
                                                            size="22"
                                                            color="grey"
                                                            variant="Bold"
                                                        />
                                                        {/* }
                                            </TouchableOpacity> */}
                                                    </View>
                                                </CollapseHeader>
                                                <CollapseBody>
                                                    <TouchableOpacity onPress={() => handleModalFaq(item)}>
                                                        {/* {collapse && */}
                                                        <>
                                                            <Text>
                                                                {truncate(item?.description)}
                                                            </Text>
                                                            <Text
                                                                style={{ fontSize: 14, fontWeight: "700", color: themeSetting.accent_color.value }}
                                                            >
                                                                Selengkapnya
                                                            </Text>
                                                        </>
                                                        {/* } */}
                                                    </TouchableOpacity>
                                                </CollapseBody>
                                            </Collapse>
                                        </View>
                                    </Shadow>
                                </View>
                            ))}
                        </View>
                    }
                    {/* Transaction */}
                    {transaction &&
                        <View style={{ backgroundColor: colors.white, marginTop: 10, paddingVertical: 20 }}>
                            <View style={{ marginHorizontal: 10, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text
                                    style={{ fontSize: 14, fontWeight: "700" }}
                                >Pesanan yang bermasalah</Text>
                                <TouchableOpacity onPress={closeTransaction}>
                                    <Text
                                        style={{ fontSize: 12, fontWeight: "700", color: colors.danger }}
                                    >Tutup Transaksi</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                                <Shadow distance={3} startColor={'#00000010'} radius={8}>
                                    <View
                                        style={{
                                            width: WIDTH,
                                            backgroundColor: '#fff',
                                            borderRadius: 8,
                                            padding: 8,
                                            borderWidth: 1,
                                            borderColor: 'rgba(10, 0, 0, 0.1)',
                                            justifyContent: 'space-between',
                                        }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            borderBottomWidth: 0.5,
                                            borderBottomColor: colors.line,
                                            paddingBottom: 5
                                        }}>
                                            <View style={{ width: WIDTH / 3, flexDirection: 'row' }}>
                                                <Icon
                                                    name="check-circle"
                                                    size={20}
                                                    color={themeSetting?.accent_color?.value}
                                                />
                                                <Text>
                                                    {transaction.mp_transaction_details[0]?.mp_transaction?.mp_seller
                                                        ? transaction?.mp_transaction_details[0]?.mp_transaction?.mp_seller
                                                            ?.name
                                                        : transaction.mp_seller.name}
                                                </Text>
                                            </View>
                                            <View style={{ width: WIDTH / 3, flexDirection: 'row', alignItems: "center", justifyContent: "space-around" }}>
                                                <Icon
                                                    name="message"
                                                    size={20}
                                                    color={themeSetting?.accent_color?.value}
                                                />
                                                <Text numberOfLines={2} style={{ width: WIDTH / 4 }}>Hubungi Penjual</Text>
                                            </View>
                                            <View style={{ width: WIDTH / 4, alignItems: "flex-end" }}>
                                                {transaction?.last_status?.status ? (
                                                    <PaymentStatusText data={transaction?.last_status?.status} />
                                                ) : (
                                                    <StatusText
                                                        data={transaction?.last_status?.mp_transaction_status_master_key}
                                                    />
                                                )}
                                            </View>
                                        </View>
                                        <View style={{
                                            borderBottomWidth: 0.5,
                                            borderBottomColor: colors.line,
                                            paddingBottom: 5,
                                            flexDirection: 'row', justifyContent: "space-between"
                                        }}>
                                            <GetMedia
                                                folder="marketplace/products"
                                                filename={
                                                    transaction?.mp_transaction_details[0]?.mp_transaction_product?.mp_transaction_product_images[0]?.filename
                                                }
                                                style={{
                                                    width: WIDTH * 0.3,
                                                    height: WIDTH * 0.3,
                                                    backgroundColor: colors.white,
                                                    resizeMode: "center"
                                                }}
                                            />
                                            <View style={{ width: WIDTH / 3 }}>
                                                <Text numberOfLines={1}
                                                    style={{ fontSize: 14, fontWeight: "700" }}
                                                >
                                                    {
                                                        transaction.mp_transaction_details[0].mp_transaction_product
                                                            .mp_transaction_product_informations[0].name
                                                    }
                                                </Text>
                                                {transaction.mp_transaction_details[0].mp_transaction_product.mp_transaction_product_sku_variants.map(
                                                    variant => (
                                                        <View key={variant.id}>
                                                            <Text>
                                                                {variant.name}:{' '}
                                                                {variant.mp_transaction_product_sku_variant_option.name}
                                                            </Text>
                                                        </View>
                                                    ),
                                                )}
                                                <Text numberOfLines={1}>
                                                    Rp{Currency(transaction.mp_transaction_details[0].mp_transaction_product.mp_transaction_product_sku.price)}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text numberOfLines={1}
                                                >
                                                    {transaction.mp_transaction_details[0].quantity}{' '}
                                                    {t('common:product')}
                                                </Text>
                                                <Text numberOfLines={1}>Rp
                                                    {Currency(transaction?.mp_transaction_details[0]?.grand_total)}

                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{
                                            paddingVertical: 20,
                                            flexDirection: 'row',
                                            justifyContent: "space-between"
                                        }}>
                                            <View style={{ width: WIDTH / 3 }}>
                                                <Text>{t('common:totalPayment')}</Text>
                                            </View>
                                            <View>
                                                <Text numberOfLines={1}>Rp  {Currency(
                                                    transaction?.mp_transaction_details[0]?.mp_transaction?.grand_total
                                                        ? transaction?.mp_transaction_details[0]?.mp_transaction
                                                            ?.grand_total
                                                        : transaction?.mp_transaction_details[0].grand_total,
                                                )}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Shadow>
                            </View>
                        </View>
                    }
                    {/* Most Faq */}
                    <View style={{ backgroundColor: colors.white, marginTop: 10, paddingVertical: 20 }}>
                        <View style={{ marginHorizontal: 10 }}>
                            <Text
                                style={{ fontSize: 14, fontWeight: "700" }}
                            >
                                {t('faq:faq')}
                            </Text>
                        </View>
                        {mostFaq && mostFaq.map((item, index) => (
                            <View style={{ marginHorizontal: 10, marginTop: 10 }} key={index}>
                                <Shadow distance={3} startColor={'#00000010'} radius={8} >
                                    <View style={{ width: WIDTH, padding: 10 }}>
                                        <Collapse>
                                            <CollapseHeader>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        marginTop: 10,
                                                    }}>
                                                    <Text
                                                        style={{ fontSize: 14, fontWeight: "700", color: "#404040" }}
                                                    >
                                                        {item?.title}
                                                    </Text>
                                                    <ArrowDown2
                                                        size="22"
                                                        color="grey"
                                                        variant="Bold"
                                                    />
                                                </View>
                                            </CollapseHeader>
                                            <CollapseBody>
                                                <TouchableOpacity onPress={() => handleModalFaq(item)}>
                                                    <>
                                                        <Text>
                                                            {truncate(item?.description)}
                                                        </Text>
                                                        <Text
                                                            style={{ fontSize: 14, fontWeight: "700", color: themeSetting.accent_color.value }}
                                                        >
                                                            {t('faq:more')}
                                                        </Text>
                                                    </>
                                                </TouchableOpacity>
                                            </CollapseBody>
                                        </Collapse>
                                    </View>
                                </Shadow>
                            </View>
                        ))}
                    </View>
                    {/* All FAQ */}
                    <View style={{ backgroundColor: colors.white, marginTop: 10, paddingVertical: 20 }}>
                        <View style={{ marginHorizontal: 10 }}>
                            <Text
                                style={{ fontSize: 14, fontWeight: "700", marginBottom: 10 }}
                            >
                                {t('faq:other_topic')}
                            </Text>

                            {faq.map((item, index) => (
                                <View key={index} style={{ marginVertical: 5 }}>
                                    <Shadow distance={3} startColor={'#00000010'} radius={5} >
                                        <View style={{ width: WIDTH, padding: 10 }}>
                                            <Text
                                                style={{ fontSize: 14, fontWeight: "700", color: "#404040" }}
                                            >
                                                {item?.title}
                                            </Text>
                                            <TouchableOpacity onPress={() => handleModalFaq(item)} style={{ marginVertical: 10 }}>
                                                <>
                                                    <Text>
                                                        {truncate(item?.description)}
                                                    </Text>
                                                </>
                                            </TouchableOpacity>
                                        </View>
                                    </Shadow>
                                </View>
                            ))}
                        </View>
                    </View>
                    <Modal
                        isVisible={modal}
                        onBackdropPress={() => setModal(false)}
                        propagateSwipe={true}
                        style={styles.view}
                        swipeDirection={['down']}
                    >
                        <View
                            style={{
                                backgroundColor: '#fff',
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                paddingVertical: 20,
                                paddingHorizontal: 14,
                                maxHeight: HEIGHT * 0.80,
                            }}>
                            <View
                                style={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                    flexDirection: "row",
                                    marginBottom: 20,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "600"
                                    }}
                                >
                                    {t('faq:help')}
                                </Text>
                                <TouchableOpacity onPress={() => { setModal(!modal); setSelectedMostFaq() }}>
                                    <Text style={{ fontSize: 18, fontWeight: "700" }}>
                                        X
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView nestedScrollEnabled={true}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    color: "#404040",
                                    marginBottom: 20
                                }}>
                                    {selectedMostFaq?.title}
                                </Text>
                                <Text>
                                    {selectedMostFaq?.description}
                                </Text>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    color: "#404040",
                                    marginVertical: 20
                                }}>
                                    {t('faq:article_helps')}
                                </Text>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <TouchableOpacity
                                        onPress={() => handleRespon('helpful')}
                                        style={{
                                            padding: 10,
                                            backgroundColor: "#F3F3F3",
                                            paddingHorizontal: 20
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: "700",
                                                color: "#6FC32E"
                                            }}
                                        >
                                            {t('faq:yes')}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={{ marginHorizontal: 20 }}> {t('faq:or')}</Text>
                                    <TouchableOpacity
                                        onPress={() => handleRespon('not_helpful')}
                                        style={{
                                            padding: 10,
                                            backgroundColor: "#F3F3F3",
                                            paddingHorizontal: 20
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: "700",
                                                color: "#F81D1D"
                                            }}
                                        > {t('faq:no')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    color: "#404040",
                                    marginVertical: 20
                                }}>
                                    {t('faq:need_helps')}
                                </Text>
                                <ScrollView horizontal={true}>
                                    <View style={{ flexDirection: "row", marginVertical: 10, }}>
                                        {faq.map((item, index) => (
                                            <View key={index} style={{ marginHorizontal: 10, }}>
                                                <Shadow distance={3} startColor={'#00000010'} radius={5} >
                                                    <View style={{ width: WIDTH / 2, padding: 10 }}>
                                                        <Text
                                                            style={{ fontSize: 14, fontWeight: "700", color: "#404040" }}
                                                        >
                                                            {item?.title}
                                                        </Text>
                                                        <TouchableOpacity onPress={() => handleModalFaq(item)} style={{ marginVertical: 10 }}>
                                                            <>
                                                                <Text numberOfLines={2}>
                                                                    {truncate(item?.description)}
                                                                </Text>
                                                            </>
                                                        </TouchableOpacity>
                                                    </View>
                                                </Shadow>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    color: "#404040",
                                    marginVertical: 20
                                }}>
                                    {t('faq:other_topic')}
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        padding: 10,
                                        backgroundColor: "#F3F3F3",
                                        paddingHorizontal: 20,
                                        width: 138
                                    }}
                                    onPress={() => { navigate(drsRouteName.HELP_CENTER_CONTACT, { transaction_id: transaction ? transaction.id : null }); setModal(false) }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: "700",
                                            color: themeSetting.accent_color.value
                                        }}
                                    >{t('faq:contact_support')}</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </Modal>
                    <Modal
                        isVisible={modalHelp}
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        onBackdropPress={() => setModalHelp(!modalHelp)}
                    >
                        <View style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            maxHeight: WIDTH / 1.5,
                            padding: 10,
                        }}>
                            <View
                                style={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                    flexDirection: "row",
                                    // marginBottom: 20,
                                }}
                            >
                                <Text style={{ fontWeight: "600" }}>Respon Anda (Optional)</Text>
                                <TouchableOpacity onPress={() => setModalHelp(!modalHelp)}>
                                    <Text style={{ fontSize: 18, fontWeight: "700" }}>
                                        X
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={{ borderWidth: 1, borderColor: colors?.line, marginVertical: 5, width: WIDTH, backgroundColor: colors?.white, borderRadius: 10 }}
                                label={t('forum:title_thread')}
                                onChangeText={(e) => setMessage(e)}
                                multiline
                                numberOfLines={3}
                            />
                            <CustomButton
                                loading={loading}
                                onPress={onSubmitRespon}
                                style={{
                                    height: 40,
                                    width: WIDTH,
                                    alignSelf: 'center',
                                    marginTop: 12,
                                }}
                                primary
                                title="Kirim"
                            />
                        </View>
                    </Modal>
                </ScrollView >
            }
        </>
    );
}


const truncate = str => {
    if (str.length > 30) {
        return str.slice(0, 80) + '...';
    } else {
        return str;
    }
};

const styles = StyleSheet.create({
    view: {
        justifyContent: 'flex-end',
        margin: 0,
    },
})

export default Faq;