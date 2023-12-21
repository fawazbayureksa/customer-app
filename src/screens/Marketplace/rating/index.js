import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import colors from '../../../assets/theme/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import GetMedia from '../../../components/common/GetMedia';
import CustomButton from '../../../components/CustomButton';
import Currency from '../../../helpers/Currency';
import DocumentPicker from 'react-native-document-picker';
import Upload from '../../../helpers/Upload';
import { useToast } from 'react-native-toast-notifications';
import axiosInstance from '../../../helpers/axiosInstance';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const Index = ({ route }) => {

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const WIDTH = Dimensions.get('window').width * 0.95;
    // const [text, setText] = useState('')
    const [rating, set_rating] = useState([])
    const [product_rating, set_product_rating] = useState([])
    const [file, setFile] = useState(null);
    const [seller_rating, set_seller_rating] = useState()
    const [review_file, set_review_file] = useState([]);
    const [transaction, setTransaction] = useState()
    const [error, setError] = useState()

    const navigation = useNavigation()

    useEffect(() => {
        if (route.params.item) {
            setTransaction(route.params.item)
            let rating = [];
            route.params.item.mp_transaction_details.map((value, index) => {
                rating = [...rating, {
                    product_id: value.mp_product_id,
                    rating: [[]],
                    review: "",
                    review_file: []
                }]
            })

            set_product_rating(rating)
        }
        else return
    }, []);


    const toast = useToast()

    const ratingProduct = (rating, index) => {
        let list = [...product_rating]
        let rate = []
        for (let i = 1; i <= rating; i++) {
            rate.push(i)
            // list[index].rating.push(i)
            list[index].rating.splice(0, rating, rate)
        }
        set_product_rating(list)
    }

    const sentReview = () => {
        if (!validation()) return


        let data = {
            seller_id: parseInt(transaction.mp_seller_id),
            transaction_id: parseInt(transaction.id),
            seller_rating: parseInt(seller_rating),
            product_rating: product_rating.map((i) => ({
                product_id: i.product_id,
                rating: i.rating[0].length,
                review: i.review,
                review_file: i.review_file
            }))
        }
        // console.log(data)
        // return
        axiosInstance.post('review/save', data)
            .then((res) => {
                console.log(res.data)
                toast.show('Success', {
                    placement: 'top',
                    type: 'success',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
                navigation.goBack()
            }).catch(error => {
                console.log(error.response.data.message)
            })
    }
    const onChangeReview = (text, index) => {
        product_rating[index].review = text
    }


    const selectFile = async (index) => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles]
            });
            setFile(res);
            handleUploadFile(res, index)
        } catch (err) {
            setFile(null);
            if (DocumentPicker.isCancel(err)) {
                toast.show('Canceled', {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            } else {
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    const handleUploadFile = (response, index) => {
        const formData = new FormData();
        if (response) {
            const tempPhoto = {
                uri: response[0]?.uri,
                type: response[0]?.type,
                name: response[0]?.name,
            };
            formData.append('file', tempPhoto);
            Upload.post(`review/uploadFile`, formData)
                .then(response => {
                    let list = [...product_rating]
                    list[index].review_file.push(response.data.data)
                    set_product_rating(list)
                    toast.show('successfully upload file', {
                        placement: 'top',
                        type: 'success',
                        animationType: 'zoom-in',
                        duration: 3000,
                    });
                }).catch(error => {
                    console.log("error upload gambar", error.response.data.message);
                })
        }
    }

    const validation = () => {
        let validate = true;
        let error = {}
        product_rating.map(e => {
            if (e.rating.length === 0) {
                validate = false
                error.rating = "Berikan untuk bintang produk ini"
            }
        })
        if (!seller_rating) {
            validate = false
            error.ratingSeller = "Berikan pendapat tentang seller ini"
        }
        setError(error)
        return validate
    }

    const { t } = useTranslation()

    return (
        <>
            <ScrollView>
                <View style={{ backgroundColor: colors.white, paddingVertical: 20 }}>
                    <Text style={{ textAlign: "center" }}>
                        {t('faq:how_is_your_shopping_experience_with')} {transaction?.mp_seller?.name}?
                    </Text>
                    {/* how feel */}
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => set_seller_rating(1)}>
                            <Icon
                                name='sentiment-very-dissatisfied'
                                color={seller_rating === 1 ? themeSetting?.accent_color?.value : colors.pasive}
                                size={77}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => set_seller_rating(3)}>
                            <Icon
                                name='sentiment-satisfied'
                                color={seller_rating === 3 ? themeSetting?.accent_color?.value : colors.pasive}
                                size={77}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => set_seller_rating(5)}>
                            <Icon
                                name='sentiment-very-satisfied'
                                color={seller_rating === 5 ? themeSetting?.accent_color?.value : colors.pasive}
                                size={77}
                            />
                        </TouchableOpacity>
                    </View>
                    {error?.ratingSeller &&
                        <View style={{ backgroundColor: 'rgba(255, 0, 0, 0.63)', width: WIDTH, marginHorizontal: 10, padding: 5, borderRadius: 10 }}>
                            <Text style={{ textAlign: "center", color: colors?.white }}>{error?.ratingSeller}</Text>
                        </View>
                    }
                </View>
                {transaction && transaction?.mp_transaction_details?.map((value, index) => (
                    <View style={{ backgroundColor: colors.white, marginTop: 10, paddingVertical: 10 }}>
                        <View
                            style={{
                                width: WIDTH,
                                borderRadius: 8,
                                padding: 8,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}>
                            <GetMedia
                                folder="marketplace/products"
                                filename={value.mp_transaction_product.mp_transaction_product_images[0].filename}
                                style={{
                                    width: WIDTH * 0.3,
                                    height: WIDTH * 0.3,
                                    backgroundColor: colors.pasive,
                                    resizeMode: "center"
                                }}
                            />
                            <View style={{ width: WIDTH / 2.3, flexDirection: "column", justifyContent: "space-between" }}>
                                <Text
                                    style={{ color: "#404040" }}
                                >
                                    {value?.mp_transaction_product.mp_transaction_product_informations[0].name}
                                </Text>
                                {value.mp_transaction_product.mp_transaction_product_sku_variants.map(variant => (
                                    <Text style={{ color: colors.textmuted, marginVertical: 10 }}>
                                        {variant.name}:{' '}
                                        {variant.mp_transaction_product_sku_variant_option.name}
                                    </Text>
                                ))}
                                <Text style={{ color: colors.textmuted, color: "#404040" }}>Rp{Currency(value.total_price)}</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", width: WIDTH / 3 }}>
                                <Text style={{ color: colors.textmuted }}>{value.quantity} produk</Text>
                                <Text style={{ color: colors.textmuted, color: "#404040", fontWeight: "700" }}>
                                    Rp{Currency(value.total_price)}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                width: WIDTH,
                                borderRadius: 8,
                                padding: 8,
                            }}>
                            <Text
                                style={{
                                    fontWeight: "700",
                                    color: themeSetting?.accent_color?.value
                                }}
                            >
                                Hai {transaction.mp_customer.name}! {t('faq:do_you_like_this_product')}?
                            </Text>
                            <Text>{t('faq:leave_a_review_of_this_product')}</Text>
                            {/* Rate */}
                            <View style={{ flexDirection: "row", marginVertical: 10 }}>
                                {[1, 2, 3, 4, 5].map((rate, i) => (
                                    <TouchableOpacity onPress={() => ratingProduct(rate, index)}>
                                        <Icon
                                            name='star'
                                            color={product_rating[index].rating[0].includes(i + 1) ? "#FFD600" : colors.pasive}
                                            size={24}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {error?.rating &&
                                <View style={{ backgroundColor: 'rgba(255, 0, 0, 0.63)', width: WIDTH, marginHorizontal: 5, padding: 5, borderRadius: 10 }}>
                                    <Text style={{ textAlign: "center", color: colors?.white }}>{error?.rating}</Text>
                                </View>
                            }
                            <Text
                                style={{
                                    fontWeight: "700",
                                }}
                            >
                                {t('faq:write_review')}
                            </Text>
                            <TextInput
                                style={[Styles.input, { borderColor: colors.line }]}
                                numberOfLines={5}
                                onChangeText={(e) => onChangeReview(e, index)}
                            />
                        </View>
                        <View style={{
                            width: WIDTH,
                            padding: 8,
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                            flexWrap: "wrap"
                        }}>
                            <View
                                style={{
                                    borderColor: colors.line,
                                    borderWidth: 1,
                                    width: 100,
                                    height: 100,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <TouchableOpacity onPress={() => selectFile(index)}>
                                    <Icon
                                        name='add'
                                        color={"#FFD600"}
                                        size={42}
                                    />
                                </TouchableOpacity>
                                <Text style={{ textAlign: "center", marginHorizontal: 10 }}>Tambah Foto/Video</Text>
                            </View>
                            {product_rating && product_rating[index].review_file.map((item) => (
                                <>
                                    <GetMedia
                                        folder="product_review"
                                        filename={item}
                                        style={{ width: 100, height: 100, marginHorizontal: 5, borderRadius: 10 }}
                                    />
                                </>
                            ))}
                        </View>
                    </View>
                ))}

            </ScrollView>
            <View style={{ backgroundColor: colors.white }}>
                <CustomButton
                    onPress={sentReview}
                    primary
                    title="Kirim"
                    style={{ width: WIDTH, marginHorizontal: 10 }}
                />
            </View>
        </>
    );
}

const Styles = StyleSheet.create({
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10
    },
})

export default Index;
