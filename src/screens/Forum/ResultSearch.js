import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, ActivityIndicator, ScrollView, Dimensions, Image } from 'react-native';
import colors from '../../assets/theme/colors';
import { ForumRouteName } from '../../constants/forum_route/forumRouteName';
import axiosInstance from '../../helpers/axiosInstance';
import EmptyCard from '../Marketplace/cart/components/EmptyCard';
import CardThread from './components/CardThread';

const ResultSearch = ({ route }) => {
    const WIDTH = Dimensions.get('window').width * 0.95;
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation()

    useEffect(() => {
        getForumThread();
    }, []);

    const getForumThread = (id) => {
        setLoading(true);
        let params = {
            page: 1,
            per_page: 10,
            search: route.params.search ? route.params.search : '',
            category_id: null
        }
        axiosInstance
            .get(`forum/thread/get`, { params })
            .then(res => {
                setData(res.data.data.data)
            }).catch(error => {
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
                        color="orange"
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
                            status={"search"}
                            type={"type_1"}
                            key={item.id}
                        />
                    ))
                        :
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 10,
                                marginHorizontal: 20
                            }}>
                            <Image source={require('../../assets/images/productNotFound.png')} style={{ width: 250, height: 250 }} />
                            <Text
                                style={{ fontSize: 20, fontWeight: "bold" }}
                            >Thread tidak ditemukan</Text>
                            <Text style={{ color: colors?.pasive }}>Thread akan tampil disini</Text>
                        </View>
                    }
                </ScrollView>
            }
        </>
    );
}

export default ResultSearch;
