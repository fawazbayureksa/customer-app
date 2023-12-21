import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { IMAGE_URL } from "@env"
const ForumMaster = ({ data, theme, width }) => {



    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Shadow distance={2} radius={3}>
                <View style={{ padding: 10, width: width }}>
                    <Text style={{ fontWeight: "700" }}>Forum Master</Text>
                    {data.map((item, index) => (
                        <View style={{ alignItems: "center", flexDirection: "row" }} key={item.id}>
                            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <Text style={{ fontSize: 16, fontWeight: "600", color: theme.accent_color?.value }}>#{index + 1}</Text>
                                <Image
                                    source={{
                                        uri: `${IMAGE_URL}public/customer/${item.profile_picture}`,
                                    }} style={{ marginHorizontal: 10, width: 24, height: 24, borderRadius: 50 }} />
                                <Text>{item.name}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </Shadow>
        </View>
    );
}

const styles = StyleSheet.create({})

export default ForumMaster;
