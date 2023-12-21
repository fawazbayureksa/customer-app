import { StyleSheet, Text, View, Button, useWindowDimensions, ScrollView, Dimensions, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Animated, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import ForumList from './ForumList';
import ForumCarousel from './components/ForumCarousel';
import { useSelector } from 'react-redux';
import { styles } from './styles';
import { Edit } from 'iconsax-react-native';
import { useToast } from 'react-native-toast-notifications';
import { MainRouteName } from '../../constants/mainRouteName';
import { ForumRouteName } from '../../constants/forum_route/forumRouteName';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../helpers/axiosInstance';
import Template from '../../components/Template';

export default function Index() {
    const [tabName, setTabName] = useState([])
    const [selectedTab, setSelectedTab] = useState("semua");
    const [id, setId] = useState();
    const toast = useToast();
    const { t } = useTranslation()
    const { navigate } = useNavigation();
    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    useEffect(() => {
        getCategory()
    }, []);

    const onChangeTab = (item, id) => {
        setSelectedTab(item)
        setId(id)
    }
    const getCategory = () => {

        let category = []

        axiosInstance
            .get('forum/categories/get')
            .then(res => {
                category =
                    res.data.data.map((item) => (
                        item.parent_id == null && {
                            name: item.name,
                            id: item.id
                        }
                    ))
                setTabName(category.filter(x => !!x))
            }).catch(error => {
                console.error('error getCategory: ', error.response);
            })
    }

    const handleIsLoggedIn = (to) => {
        if (isLoggedIn == true) {
            navigate(ForumRouteName.CREATE_THREAD)
        } else {
            toast.show(t('forum:please_login'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            navigate(MainRouteName.LOGIN);
            return
        }
    }

    return (
        <Template scroll={false} theme={themeSetting} refresh={true} url="/ForumList">
            <ScrollView
                stickyHeaderIndices={[1]}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                <ForumCarousel />
                <Tab
                    selectedTab={selectedTab}
                    tabName={tabName}
                    onChangeTab={onChangeTab}
                />
                {selectedTab === 'Semua' && (
                    <ForumList />
                )}
                {selectedTab !== 'Semua' && (
                    <ForumList category_id={id} />
                )}
            </ScrollView>
            <TouchableOpacity
                onPress={() => handleIsLoggedIn()}
                style={[styles.floatingButton, { backgroundColor: themeSetting?.accent_color?.value }]}
            >
                <Edit
                    size="22"
                    color="#FFF"
                />
            </TouchableOpacity>
        </Template>

    );
}

const Tab = ({ tabName, onChangeTab, selectedTab }) => {
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const WIDTH = Dimensions.get('window').width;
    return (
        <>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: "row", maxHeight: 50, maxWidth: WIDTH, width: WIDTH, backgroundColor: "#FFFFFF" }}>
                <View>
                    <TouchableOpacity
                        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                    >
                        <Text
                            onPress={() => onChangeTab("semua")}
                            style={{
                                color: selectedTab === "semua" ? themeSetting?.accent_color?.value : '#000',
                                fontWeight: selectedTab === "semua" ? '700' : '400',
                            }}>
                            Semua
                        </Text>
                    </TouchableOpacity>
                    <View style={{ marginVertical: 5, height: selectedTab == "semua" ? 3 : 2, backgroundColor: selectedTab == "semua" ? themeSetting?.accent_color?.value : '#DCDCDC' }} />
                </View>
                {tabName.map((item, index) => {
                    return (
                        <View key={index}>
                            <TouchableOpacity
                                style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                            >
                                <Text
                                    onPress={() => onChangeTab(item.name, item.id)}
                                    style={{
                                        color: selectedTab === item.name ? themeSetting?.accent_color?.value : '#000',
                                        fontWeight: selectedTab === item.name ? '700' : '400',
                                    }}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                            <View style={{ marginVertical: 5, height: selectedTab == item.name ? 3 : 2, backgroundColor: selectedTab == item.name ? themeSetting?.accent_color?.value : '#DCDCDC' }} />
                        </View>
                    );
                })
                }
            </ScrollView>
        </>
    )
}
