import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { Shadow } from 'react-native-shadow-2';
import { useTranslation } from 'react-i18next';
import GetMedia from '../../../../components/common/GetMedia';
import truncate from '../../../../helpers/truncate';
import { useNavigation } from '@react-navigation/native';
import { AuctionRouteName } from '../../../../constants/auction_route/auctionRouteName';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import convertDate from '../../detail_auction/helpers/convertDate';
import convertTime from '../../detail_auction/helpers/convertTime';
import CountdownComponent from '../../history/components/CountdownComponent';
import Currency from '../../../../helpers/Currency';
import convertCSS from '../../../../helpers/convertCSS';

const WIDTH = Dimensions.get('window').width;

const MyOngingAuctionCard = ({ item, index, language }) => {
    const { t } = useTranslation();
    const { navigate } = useNavigation();

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    let highestBid = item?.mp_product_auction_bid[0].bid_price;
    item?.mp_product_auction_bid.map((bid) => {
        if (bid.mp_product_auction_bid > highestBid) {
            highestBid = bid.mp_product_auction_bid;
        }
    })

    return (
        <TouchableOpacity
            style={{ width: WIDTH * 0.93, marginRight: 5 }}
            onPress={() =>
                navigate(
                    AuctionRouteName.DETAIL_AUCTION,
                    {
                        productSlug: item.slug,
                        sellerSlug: item?.mp_seller?.slug,
                        product_id: item?.id
                    },
                )
            }>
            <LinearGradient
                colors={['#6A83C2', '#25396C']}
                style={{
                    height: 99,
                    flexDirection: 'row',
                    padding: 6,
                    borderRadius: 5,
                }}>
                <GetMedia
                    folder="marketplace/products"
                    filename={item?.mp_product_images[0]?.filename}
                    style={{
                        // marginVertical: 5,
                        width: WIDTH * 0.20,
                        height: WIDTH * 0.20,
                    }}
                />
                <View
                    style={{
                        marginLeft: 10,
                        justifyContent: 'center',
                    }}>
                    {item?.mp_product_informations.map((sub, i) => {
                        return (
                            <View key={i}>
                                {sub.language_code == language && (
                                    <Text
                                        style={{
                                            fontSize:
                                                convertCSS(
                                                    themeSetting.body_typography
                                                        .font_size,
                                                ) * 1.2,
                                            fontWeight: '700',
                                            color: '#fff',
                                        }}>
                                        {truncate(sub.name)}
                                    </Text>
                                )}
                            </View>
                        );
                    })}
                    <Text style={{ color: '#fff', fontSize: 10 }}>
                        Penawaran Tertinggi
                    </Text>
                    <Text
                        style={{
                            fontSize:
                                convertCSS(
                                    themeSetting.body_typography.font_size,
                                ) * 1.2,
                            fontWeight: '700',
                            color: '#fff',
                        }}>
                        Rp {Currency(highestBid)}
                    </Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default MyOngingAuctionCard