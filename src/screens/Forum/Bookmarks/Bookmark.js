import { ActivityIndicator, Button, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Category, Edit, Eye, Like1, MessageText, Shop, TickCircle, Trash } from 'iconsax-react-native'
import { useSelector } from 'react-redux';
import colors from '../../../assets/theme/colors';
import { useNavigation } from '@react-navigation/native';
import { ForumRouteName } from '../../../constants/forum_route/forumRouteName'
import axiosInstance from '../../../helpers/axiosInstance';
import { IMAGE_URL } from "@env"
import CardThread from './../components/CardThread'
import { stylesDetail, styles } from '../styles';

const Bookmark = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const state = useSelector(state => state);
    const WIDTH = Dimensions.get('window').width * 0.95;
    const navigation = useNavigation()
    useEffect(() => {
        getForumThread()
        const willFocusSubscription = navigation.addListener('focus', () => {
            getForum();
        });
        return willFocusSubscription;
    }, []);

    const getForumThread = () => {
        setLoading(true);
        axiosInstance
            .get(`forum/thread/bookmark/list`)
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
    const getForum = () => {
        axiosInstance
            .get(`forum/thread/bookmark/list`)
            .then(res => {
                setData(res.data.data.data)
            })
            .catch(error => {
                console.error(error);
            })
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
                        color="orange"
                        size={'small'}
                        style={{ padding: 10 }}
                    />
                </View>
                :
                <ScrollView style={{ backgroundColor: colors?.white }}>
                    {data.length > 0 ? data.map((item) => (
                        <CardThread item={item} getForum={getForum} status={"bookmark"} type={"type_1"} key={item.id} />
                    ))
                        :
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                marginHorizontal: 20
                            }}>
                            <Image source={require('../../../assets/images/empty_folder.png')} />
                            <Text
                                style={{ fontSize: 20, fontWeight: "bold" }}
                            >Belum Ada Bookmark</Text>
                            <Text style={{ color: colors?.pasive }}>Thread yang anda simpan akan tampil disini</Text>
                        </View>
                    }
                </ScrollView>
            }
        </>
    );
}

export default Bookmark;
