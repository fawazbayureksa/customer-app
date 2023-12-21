import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import GetMedia from '../../../components/common/GetMedia';
import CustomButton from '../../../components/CustomButton/index';
import axiosInstance from '../../../helpers/axiosInstance';
const Following = () => {

    const WIDTH = Dimensions.get('window').width;

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const [dataFollower, setDataFollower] = useState([])
    const [dataFollowing, setDataFollowing] = useState([])
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getFollowing()
    }, [])

    const toast = useToast()

    const getFollowing = () => {
        axiosInstance.get('ecommerce/customer/getFollowing')
            .then((res) => {
                let data = res.data.data
                console.log(data)
                setDataFollowing(data.data)
            }).catch(error => {
                console.log(error)
            })
    }

    const onFollow = (id, status, id_seller, type) => {

        let data = {
            mp_customer_id: id,
            mp_seller_id: id_seller,
            is_follow: false
        }
        axiosInstance.post(`ecommerce/${type}/follow`, data)
            .then((res) => {
                console.log(res.data);
                toast.show(res.data.message, {
                    placement: 'top',
                    type: 'success',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
                getFollowing()
            }).catch((err) => {

                console.log(err.response.data)
                // toast.show(err.response.data.message, {
                //     placement: 'top',
                //     type: 'danger',
                //     animationType: 'zoom-in',
                //     duration: 3000,
                // });
            })
    }

    return (
        <ScrollView
            style={{ backgroundColor: "#FFF" }}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={getFollowing} />
            }
            scrollEventThrottle={400}
        >

            {dataFollowing && dataFollowing.map((item) => (
                <View key={item.id} style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 10 }}>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                        {item.mp_customer_id !== 0 ?
                            <GetMedia
                                folder="customer"
                                filename={item?.profile_picture}
                                style={{
                                    marginRight: 10, width: 40, height: 40, borderRadius: 50
                                }}
                            />
                            :
                            <GetMedia
                                folder="seller"
                                filename={item?.profile_picture}
                                style={{
                                    marginRight: 10, width: 40, height: 40, borderRadius: 50
                                }}
                            />
                        }
                        <Text>{item?.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onFollow(item?.mp_customer_id, item.is_following, item.mp_seller_id, item.type)}
                        style={{
                            backgroundColor: "#000",
                            height: "auto",
                            width: 111,
                            height: 30,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 5,
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            style={{
                                // color: themeSetting.accent_color.text,
                                color: "#FFF",
                                fontSize: 12,
                                fontWeight: "600",
                            }}
                        >
                            Berhenti Ikuti
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}

        </ScrollView>
    );
}

export default Following;

