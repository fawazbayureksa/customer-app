import { ActivityIndicator, Button, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import colors from '../../../assets/theme/colors';
import { ForumRouteName } from '../../../constants/forum_route/forumRouteName'
import CardThread from './../components/CardThread'
import CustomButton from '../../../components/CustomButton';

const MyDraft = ({ data, getThread, navigate, loading, themeSetting }) => {
    const WIDTH = Dimensions.get('window').width * 0.95;

    return (
        <>
            {loading ?
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <ActivityIndicator
                        color={themeSetting?.accent_color?.value}
                        size={'large'}
                        style={{ padding: 10 }}
                    />
                </View>
                :
                <ScrollView style={{ backgroundColor: colors?.white }}>
                    {data.length > 0 ? data.map((item) => (
                        <CardThread
                            item={item}
                            getForum={getThread}
                            status={"draft"}
                            type={"type_2"}
                            key={item.id}
                        />
                    ))
                        :
                        <View style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            marginHorizontal: 20,
                            marginVertical: 10
                        }}>
                            <Image source={require('../../../assets/images/empty_folder.png')} />
                            <Text
                                style={{ fontSize: 20, fontWeight: "bold" }}
                            >Belum Ada Draft</Text>
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

export default MyDraft;
