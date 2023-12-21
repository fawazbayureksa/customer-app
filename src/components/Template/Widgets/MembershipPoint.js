import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { MainRouteName } from '../../../constants/mainRouteName';
import axiosInstance from '../../../helpers/axiosInstance';
import Currency from '../../../helpers/Currency';

const MembershipPoint = ({ data }) => {
    const { navigate } = useNavigation()
    const [level, setLevel] = useState()
    const WIDTH = Dimensions.get('window').width * 0.95;
    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            getLevelAndPoint()
        }
    }, [])


    const getLevelAndPoint = () => {
        axiosInstance.get('membership/getMasterData')
            .then((res) => {
                setLevel(res.data.data)
            }).catch(error => {
                console.log('getLevelAndPoint', error.response.data)
            })
    }

    return (
        <>
            {(level && isLoggedIn) &&
                <View>
                    {data.type === "type_1" &&
                        <View style={[{
                            alignSelf: "center",
                            backgroundColor: data.background_color,
                            width: WIDTH,
                            shadowColor: "#000",
                            // borderRadius: 5,
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.22,
                            shadowRadius: 2.22,
                            padding: 10
                        }]}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                                <Image
                                    source={require('../../../assets/images/Exclude.png')}
                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                />
                                <TouchableOpacity
                                    onPress={() => navigate(MainRouteName.MEMBERSHIP)}
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                    <View style={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}>
                                        <Text
                                            style={{
                                                color: data.text_color,
                                                fontSize: 10,
                                                fontWeight: "600"
                                            }}
                                        >
                                            {level?.cashPointCustomName}
                                        </Text>
                                        <View style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}>
                                            <Text
                                                style={{
                                                    color: data.text_color,
                                                    marginRight: 5,
                                                    fontWeight: "bold",
                                                    fontSize: 16,
                                                }}>
                                                {Currency(level?.currentCashPoint)}
                                            </Text>
                                            <Text style={{ fontWeight: "400", color: data.text_color, }}>
                                                poin
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ borderColor: "#DCDCDC", borderWidth: 1, marginHorizontal: 40, height: 40 }} />
                                    <View style={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}>
                                        <Text style={{
                                            color: data.text_color,
                                            fontWeight: "600",
                                            fontSize: 10
                                        }}>
                                            {level?.customerLevel?.name}
                                        </Text>
                                        <View style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}>
                                            <Text
                                                style={{
                                                    color: data.text_color,
                                                    fontWeight: "bold"
                                                }}>
                                                {Currency(level?.currentLoyaltyPoint)}
                                            </Text>
                                            <Text style={{ fontWeight: "400", color: data.text_color, fontSize: 12, alignSelf: "flex-end" }}>
                                                /500.000 cookies
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    {data.type === "type_2" &&
                        <View style={[{
                            alignSelf: "center",
                            backgroundColor: data.background_color,
                            width: WIDTH,
                            shadowColor: "#000",
                            // borderRadius: 5,
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.22,
                            shadowRadius: 2.22,
                            padding: 10
                        }]}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <TouchableOpacity
                                    onPress={() => navigate(MainRouteName.MEMBERSHIP)}
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                    <View style={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}>
                                        <View style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}>
                                            <Image
                                                source={require('../../../assets/images/Exclude.png')}
                                                style={{ width: 12, height: 12, resizeMode: "contain", marginRight: 5 }}
                                            />
                                            <Text
                                                style={{
                                                    color: data.text_color,
                                                    fontSize: 10,
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {level?.cashPointName}
                                            </Text>
                                        </View>
                                        <View style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}>
                                            <Text
                                                style={{
                                                    color: data.text_color,
                                                    marginRight: 5,
                                                    fontWeight: "bold",
                                                    fontSize: 16,
                                                }}>
                                                {Currency(level?.currentCashPoint)}
                                            </Text>
                                            <Text style={{ fontWeight: "400", color: data.text_color, }}>
                                                poin
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ borderColor: "#DCDCDC", borderWidth: 1, marginHorizontal: 40, height: 40 }} />
                                    <View style={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}>
                                        <Text style={{
                                            color: data.text_color,
                                            fontWeight: "600",
                                            fontSize: 10
                                        }}>
                                            {level?.levelName}
                                        </Text>
                                        <View style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}>
                                            <Text
                                                style={{
                                                    color: data.text_color,
                                                    fontWeight: "bold"
                                                }}>
                                                {Currency(level?.currentLoyaltyPoint)}
                                            </Text>
                                            <Text style={{ fontWeight: "400", color: data.text_color, fontSize: 12, alignSelf: "flex-end" }}>
                                                /500.000 cookies
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </View>
            }
        </>
    );
}

const styles = StyleSheet.create({})

export default MembershipPoint;
