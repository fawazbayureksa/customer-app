import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../helpers/axiosInstance';
import convertCSS from '../../../helpers/convertCSS';
import { styles } from '../styles';
import colors from '../../../assets/theme/colors';

const TabCategory = ({ catgeoryList, onChangeTab, selectedTab }) => {
    // const [catgeoryList, setCategoryList] = useState([]);
    // const [tabName, setTabName] = useState([])
    // const [selectedTab, setSelectedTab] = useState("Semua");
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    // const [id, setId] = useState();
    // useEffect(() => {
    //     getcategoriesForum();
    // }, []);

    // const onChangeTab = (item,id) => {
    //     setSelectedTab(item)
    //     setId(id)
    // }
    // const getcategoriesForum = () => {

    //     let category = []

    //     axiosInstance
    //         .get('forum/categories/get')
    //         .then(res => {
    //             category =
    //                 res.data.data.map((item) => (
    //                     item.parent_id !== null && {
    //                         name: item.name,
    //                         id: item.id
    //                     }
    //                 ))
    //             setCategoryList(category.filter(x => !!x))
    //         }).catch(error => {
    //             console.error('error getCategory: ', error.response);
    //         })
    // }
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
                    onPress={() => onChangeTab("Semua")}
                    style={[styles.rounded, styles.borderGray, { backgroundColor: selectedTab === "Semua" ? themeSetting?.accent_color?.value : '#fff' }]}>
                    <Text style={{ color: selectedTab === "Semua" ? '#FFF' : colors?.pasive }}>Semua</Text>
                </TouchableOpacity>
                {catgeoryList.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.rounded,
                        {
                            backgroundColor: selectedTab === category.name ? themeSetting?.accent_color?.value : '#fff',
                            borderWidth: selectedTab === category.name ? 0 : 1,
                            borderColor: selectedTab === category.name ? themeSetting?.accent_color?.value : colors?.line
                        }
                        ]}>
                        <Text
                            onPress={() => onChangeTab(category.name, category.id)}
                            style={{
                                color:
                                    selectedTab === category.name ? '#FFF' : colors?.pasive,
                            }}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

export default TabCategory;
