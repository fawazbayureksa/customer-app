import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import GetMedia from '../../../components/common/GetMedia';
import axiosInstance from '../../../helpers/axiosInstance';

const Followers = () => {
    const [dataFollower, setDataFollower] = useState([])
    const [loading, setLoading] = useState(false);
    const WIDTH = Dimensions.get('window').width;

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );


    useEffect(() => {
        getFollowers()
    }, [])
    const toast = useToast()

    const getFollowers = () => {
        axiosInstance.get('ecommerce/customer/getFollowers')
            .then((res) => {
                let data = res.data.data
                setDataFollower(data.data)
            }).catch(error => {
                console.log(error)
            })
    }

    const onFollow = (id, status) => {

        let data = {
            mp_customer_id: id,
            is_follow: status
        }
        axiosInstance.post('ecommerce/customer/follow', data)
            .then((res) => {
                console.log(res.data);
                toast.show(res.data.message, {
                    placement: 'top',
                    type: 'success',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
                getFollowers()
            }).catch((err) => {
                toast.show(err.response.data.message, {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            })
    }


    return (
        <ScrollView
            style={{ backgroundColor: "#FFF" }}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={getFollowers} />
            }
            scrollEventThrottle={400}
        >
            {dataFollower && dataFollower.map((item) => (
                <View key={item?.id} style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 10 }}>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                        <GetMedia
                            folder="customer"
                            filename={item?.data_follower?.profile_picture}
                            style={{
                                marginRight: 10, width: 40, height: 40, borderRadius: 50
                            }}
                        />
                        <Text>{item?.data_follower?.name}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => onFollow(item?.data_follower?.id, !item.is_following)}
                        style={{
                            backgroundColor: !item.is_following ? themeSetting.accent_color.value : "#000",
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
                            {!item.is_following ? 'Ikuti' : 'Berhenti Ikuti'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
}

export default Followers;
