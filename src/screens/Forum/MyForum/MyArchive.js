import { Button, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Category, Edit, Eye, Like1, MessageText, Shop, TickCircle, Trash } from 'iconsax-react-native'
import { useSelector } from 'react-redux';
import colors from '../../../assets/theme/colors';
import axiosInstance from '../../../helpers/axiosInstance';
import CardThread from './../components/CardThread'
import { styles } from '../styles';
import { ActivityIndicator } from 'react-native-paper';
import CustomButton from '../../../components/CustomButton';
import { ForumRouteName } from '../../../constants/forum_route/forumRouteName';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyArchive = ({ navigate, themeSetting }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const WIDTH = Dimensions.get('window').width * 0.95;

    useEffect(() => {
        getForumThread();
    }, []);

    const getForumThread = async () => {
        const account = JSON.parse(await AsyncStorage.getItem('isAccount'))
        setLoading(true);
        let params = {
            page: 1,
            per_page: 20,
            status: "archive",
            user_type: account
        }
        axiosInstance
            .get(`forum/thread/getListThreadSelf`, { params })
            .then(res => {
                setData(res.data.data.data)
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            {loading ?
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                    }}>
                    <ActivityIndicator
                        color={themeSetting?.accent_color?.value}
                        size={'small'}
                        style={{ padding: 10 }}
                    />
                </View>
                :
                <ScrollView style={{ backgroundColor: colors?.white }}>
                    {data.length > 0 ? data.map((item) => (
                        <CardThread
                            item={item}
                            getForum={getForumThread}
                            status={"archive"}
                            type={"type_3"}
                            key={item.id}
                        />
                    ))
                        :
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                marginHorizontal: 20,
                                marginVertical: 10
                            }}>
                            <Image source={require('../../../assets/images/empty_folder.png')} />
                            <Text
                                style={{ fontSize: 20, fontWeight: "bold" }}
                            >Belum Ada Arsip</Text>
                            <Text style={{ color: colors?.pasive }}>Draft thread anda akan tampil disini</Text>
                            <CustomButton
                                onPress={() => navigate(ForumRouteName.CREATE_THREAD)}
                                title="Buat Thread Baru"
                                primary
                                style={{ width: WIDTH }}
                            />
                        </View>
                    }
                </ScrollView>
            }
        </>
    );
}

export default MyArchive;
