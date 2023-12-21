import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../../../assets/theme/colors';

const TabCategoryWebinar = ({ catgeoryList, onChangeTab, selectedTab }) => {
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const state = useSelector(state => state);

    return (
        <ScrollView horizontal={true}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                marginVertical: 10,
                marginLeft: 5
            }}>
                <TouchableOpacity
                    onPress={() => onChangeTab("Semua", "")}
                    style={[styles.rounded, styles.borderGray, { backgroundColor: selectedTab === "Semua" ? themeSetting?.accent_color?.value : '#fff' }]}>
                    <Text style={{ color: selectedTab === "Semua" ? '#FFF' : colors?.pasive }}>Semua</Text>
                </TouchableOpacity>
                {catgeoryList.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.rounded,
                        {
                            backgroundColor: selectedTab === category.label ? themeSetting?.accent_color?.value : '#fff',
                            borderWidth: selectedTab === category.label ? 0 : 1,
                            borderColor: selectedTab === category.label ? themeSetting?.accent_color?.value : colors?.line
                        }
                        ]}>
                        <Text
                            onPress={() => onChangeTab(category.label, category.value)}
                            style={{
                                color:
                                    selectedTab === category.label ? '#FFF' : colors?.pasive,
                            }}>
                            {category.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    rounded: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 36, borderRadius: 38,
        marginHorizontal: 5,
        width: "auto",
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    borderGray: {
        borderColor: colors?.line,
        borderWidth: 1,
        backgroundColor: "#FFF"
    },
});

export default TabCategoryWebinar