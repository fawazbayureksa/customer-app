import { Image, TextInput, ScrollView, Dimensions, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Alert } from 'react-native'
import React, { useState } from 'react'
import colors from '../../assets/theme/colors';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles'
import { ForumRouteName } from '../../constants/forum_route/forumRouteName'
import SelectBox from 'react-native-multi-selectbox'
import axiosInstance from '../../helpers/axiosInstance';
import { xorBy } from 'lodash';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import convertCSS from '../../helpers/convertCSS';
import { useToast } from 'react-native-toast-notifications';
import ModalAlert from './components/ModalAlert';
import { useEffect } from 'react';
import { MainRouteName } from '../../constants/mainRouteName';

export default function ReportComment({ route }) {
    const state = useSelector(state => state);
    const items = [
        {
            id: 'sara',
            item: 'Sara'
        },
        {
            id: 'pornografi',
            item: 'Pornografi'
        },
        {
            id: 'judi',
            item: 'Judi'
        },
        {
            id: 'lainnya',
            item: 'Lainnya'
        },
    ];
    const WIDTH = Dimensions.get('window').width * 0.95;
    const [text, setText] = useState("")
    const [selectedItems, setSelectedItems] = useState([])
    const [selectedCategory, setselectedCategory] = useState([])
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const onMultiChange = () => {
        return (item) => setselectedCategory(xorBy(selectedCategory, [item], 'id'))
    }
    const [success, setModalSuccess] = useState(false);
    const [error, setModalError] = useState(false);
    const toast = useToast()
    const { t } = useTranslation()
    const { navigate } = useNavigation();
    const navigation = useNavigation();

    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);


    useEffect(() => {

        if (!isLoggedIn) {
            navigation.replace(MainRouteName.LOGIN)
        }
    }, []);

    const onReportCommment = () => {

        if (text == "") {
            toast.show(t('forum:information_required'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            return
        } else if (selectedCategory.length < 1) {
            toast.show(t('forum:category_required'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            return
        }

        let ItemCategory = []
        selectedCategory.forEach(i => ItemCategory.push(i.item))


        let data = {
            forum_thread_id: route.params.thread_id,
            forum_thread_comment_id: route.params.coment_id,
            description: text,
            category: ItemCategory
        }

        axiosInstance
            .post(`forum/thread/comment/report/save`, data)
            .then(res => {
                console.log(res.data.message)
                toast.show(t('forum:success_report'), {
                    placement: 'top',
                    type: 'success',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
                navigation.goBack()
            }).catch(res => {
                toast.show(res.response.data.message, {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
                console.log(res.response.data.message)
            })
    }


    return (
        <ScrollView style={{ backgroundColor: colors.white }}>
            <View style={[styles.container, { width: WIDTH, marginLeft: 8 }]}>
                <Text style={{ textAlign: "justify", fontSize: convertCSS(themeSetting.body_typography.font_size), fontWeight: "400", marginVertical: 10 }}>
                    {t('forum:sorry_for').replace('name', JSON.parse(state?.authReducer?.user)?.name)}
                </Text>
                <View>
                    <Text style={{ fontSize: convertCSS(themeSetting.body_typography.font_size), fontWeight: "600" }}>
                        {t('forum:report_category')}
                    </Text>
                    <SelectBox
                        label=""
                        options={items}
                        selectedValues={selectedCategory}
                        onMultiSelect={onMultiChange()}
                        onTapClose={onMultiChange()}
                        isMulti
                        inputPlaceholder={t('forum:select')}
                    />
                </View>
                <SafeAreaView style={{ marginTop: 24 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600" }}>
                        {t('forum:information')}
                    </Text>
                    <View style={{ width: WIDTH }}>
                        <TextInput
                            style={{ marginVertical: 10, borderRadius: 10, backgroundColor: colors?.white, borderWidth: 1, borderColor: colors?.line }}
                            multiline
                            onChangeText={(e) => setText(e)}
                            numberOfLines={3}
                        />
                    </View>
                </SafeAreaView>
                <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity
                        style={[stylesReport.button, { backgroundColor: themeSetting?.accent_color?.value }]}
                        onPress={() => onReportCommment()}
                    >
                        <Text style={{ color: colors?.white, fontWeight: "600", fontSize: 14 }}>
                            {t('send')}
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
            <ModalAlert
                show={success}
                title={"Success"}
                message={"Laporan berhasil dikirim"}
            />
            <ModalAlert
                show={error}
                title={"Error"}
                message={"Laporan Gagal dikirim"}
            />
        </ScrollView >
    )
}



export const stylesReport = StyleSheet.create({
    button: {
        height: 40,
        borderRadius: 10,
        marginTop: 10,
        flex: 1,
        width: "100%",
        justifyContent: "center", alignItems: "center",
        shadowColor: "gray",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    }
})