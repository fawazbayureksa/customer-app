import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import colors from '../../../assets/theme/colors';
import CardThread from './../components/CardThread'
import CustomButton from '../../../components/CustomButton';
import { ForumRouteName } from '../../../constants/forum_route/forumRouteName';

const MyPost = ({ data, getThread, navigate, loading, themeSetting }) => {
    const WIDTH = Dimensions.get('window').width * 0.95;
    return (
        <>
            {loading ?
                <View style={{ flex: 1, justifyContent: "center" }}>
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
                            status={"mypost"}
                            type={"type_1"}
                            key={item.id}
                        />
                    ))
                        :
                        <View style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            marginHorizontal: 20
                        }}>
                            <Image source={require('../../../assets/images/empty_folder.png')} />
                            <Text
                                style={{ fontSize: 20, fontWeight: "bold" }}
                            >Belum Ada Postingan</Text>
                            <Text style={{ color: colors?.pasive }}>Thread anda akan tampil disini</Text>
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

export default MyPost;
