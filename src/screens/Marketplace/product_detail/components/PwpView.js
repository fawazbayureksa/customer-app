import React from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { IMAGE_URL } from '@env';
import Currency from '../../../../helpers/Currency';
import { CustomDivider } from '../../../../components/Divider';
import { useState } from 'react';
import Modal from 'react-native-modal';
import { CloseCircle } from 'iconsax-react-native';
import WebDisplay from '../../../Forum/components/WebDisplay';

const PwpView = ({ pwp, detail, themeSetting }) => {
    const [modal, setModal] = useState(false)
    const [dataModal, setDataModal] = useState(false)
    const WIDTH = Dimensions.get('window').width * 0.95;
    const truncate = str => {
        if (str.length > 30) {
            return str.slice(0, 30) + '...';
        } else {
            return str;
        }
    };
    const getPercentDiscount = (price, discount) => {
        return `${Math.floor(100 - (price * 100) / discount)}%`;
    };

    const onModal = () => {
        setModal(true)
    }

    if (pwp && pwp.details && pwp.details.length > 0)
        return (
            <>
                <View style={{ display: "flex", backgroundColor: themeSetting?.accent_color?.value, padding: 10 }}>
                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: "700", }}>
                        Ada Paket Diskon PWP!
                    </Text>
                    <Text style={{ color: '#FFF', marginVertical: 10 }} >
                        Mau dapat diskon lebih? Beli juga produk paket PWP di samping dan rasakan hematnya! syarat dan ketentuan berlaku.
                    </Text>
                    <TouchableOpacity onPress={() => onModal()}>
                        <Text style={{ color: '#FFF', fontWeight: "700" }}>
                            Pelajari lebih lanjut
                        </Text>
                    </TouchableOpacity>
                    {pwp.details.map((item, index) => {
                        if (item.mp_product_id === detail.id) return null;
                        else return (
                            <View style={{ marginTop: 10 }} key={index}>
                                <Shadow distance={3} startColor={'#00000010'} radius={8}>
                                    <View
                                        style={{
                                            width: WIDTH * 0.5,
                                            backgroundColor: '#fff',
                                            borderRadius: 6,
                                            padding: 10,
                                            height: 280,
                                            borderColor: 'rgba(10, 0, 0, 0.1)',
                                            justifyContent: 'space-between',
                                            shadowColor: '#000',
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            elevation: 5,
                                        }}>
                                        <Image
                                            source={{
                                                uri: `${IMAGE_URL}public/marketplace/products/${item.mp_product.mp_product_images[0].filename}`,
                                            }}
                                            style={{
                                                resizeMode: 'cover',
                                                borderRadius: 8,
                                                width: (WIDTH / 2) * 0.7,
                                                height: 200,
                                                justifyContent: 'center',
                                                alignSelf: 'center',
                                            }}
                                        />
                                        <Text numberOfLines={2} style={{ fontWeight: "600" }}> {item.mp_product.mp_product_informations[0]?.name}</Text>
                                        {parseInt(item.mp_product.mp_product_skus.find(x => x.is_main).normal_price) > 0 &&
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View
                                                    style={{
                                                        padding: 2,
                                                        backgroundColor: themeSetting?.accent_color?.value,
                                                        borderRadius: 2,
                                                    }}>
                                                    <Text style={{ fontSize: 12 }}>
                                                        {getPercentDiscount(
                                                            item.mp_product_skus[0].price,
                                                            item.mp_product_skus[0].normal_price,
                                                        )}
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={{
                                                        marginLeft: 5,
                                                        textDecorationLine: 'line-through',
                                                        fontSize: 12,
                                                    }}>
                                                    Rp {Currency(item.mp_product_skus[0].normal_price)}
                                                </Text>
                                            </View>
                                        }
                                        <Text
                                            style={{
                                                marginLeft: 5,
                                                fontSize: 12,
                                                fontWeight: 'bold'
                                            }}>
                                            Rp {Currency(item.mp_product.mp_product_skus.find(x => x.is_main).price)}
                                        </Text>
                                    </View>
                                </Shadow>
                            </View>
                        )
                    })}
                </View>
                <Modal
                    isVisible={modal}
                    onBackdropPress={() => {
                        setModal(!modal)
                    }}
                    onBackButtonPress={() => {
                        setModal(!modal)
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            paddingVertical: 16,
                            paddingHorizontal: 14,
                            maxHeight: '100%',
                        }}>
                        <View
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                marginBottom: 20,
                            }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                }}>

                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setModal(!modal)
                                }}>
                                {/* <CloseCircle size="22" color="#000" variant="Bold" /> */}
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: '700',
                                    }}
                                >
                                    x
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <WebDisplay
                            html={pwp.informations[0].terms_and_conditions}
                        />
                    </View>
                </Modal>
                <CustomDivider />
            </>
        );
    else return null
}

const styles = StyleSheet.create({})

export default PwpView;
