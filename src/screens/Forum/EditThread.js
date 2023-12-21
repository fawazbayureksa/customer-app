import React, { useState, useEffect } from 'react'
import { styles } from "./styles"
import { Image, Dimensions, TextInput, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TouchableHighlight, TouchableOpacity, View, Button, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import { Colors, Text } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import colors from '../../assets/theme/colors';
import { xorBy } from 'lodash'
import axiosInstance from '../../helpers/axiosInstance';
import { useTranslation } from 'react-i18next';
import SelectCategory from './components/SelectCategory';
import RichEditorText from './components/RichEditor';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Edithread({ route }) {
    const [text, setText] = React.useState()
    const [content, setContent] = React.useState()
    const [selectedCategory, setselectedCategory] = useState([])
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState();
    const [listCategories, setListCategories] = useState()
    const [dataDetail, setDataDetail] = useState()
    const WIDTH = Dimensions.get('window').width * 0.95;
    useEffect(() => {
        getCategory()
        getDetailThread()
    }, []);

    const toast = useToast()

    const { navigate } = useNavigation();
    const navigation = useNavigation();

    const onMultiChange = () => {
        return (item) => setselectedCategory(xorBy(selectedCategory, [item], 'id'))
    }
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const { t } = useTranslation()

    const getDetailThread = () => {
        setLoading(true)
        axiosInstance
            .get(`forum/thread/detailForumThread/${route.params.idThread}`)
            .then(res => {
                setDataDetail(res.data.data)
                setText(res.data.data.title)
                setselectedCategory(
                    res.data.data.categories.map((i) => ({
                        id: i.forum_category_id,
                        item: i.name
                    }))
                )
                setContent(res.data.data.content)
            }).catch(error => {
                console.error('error getDetail: ', error.response.data.message);
            }).finally(() => {
                setLoading(false);
            });
    }


    const getCategory = () => {
        setLoading(true)
        axiosInstance
            .get('forum/categories/get')
            .then(res => {
                setListCategories(res.data.data.map(i => ({
                    id: i.id,
                    item: i.name
                })))
            }).catch(error => {
                console.error('error getCategory: ', error.response.data.message);
            }).finally(() => {
                setLoading(false);
            });
    }

    const onSaveThread = async (status) => {
        const account = JSON.parse(await AsyncStorage.getItem('isAccount'))

        let idCategory = []
        selectedCategory.forEach(i => idCategory.push(i.id))

        let params = {
            title: text,
            content: content,
            user_type: account ? account : "customer", //customer / seller
            status: status == "published" ? "published" : "draft", //published / draft
            category_id: idCategory,
            id: route.params.idThread
        }

        axiosInstance.post(`forum/thread/save`, params).then(res => {
            toast.show(res.data.message, {
                placement: 'top',
                type: 'success',
                animationType: 'zoom-in',
                duration: 3000,
            });
            navigation.goBack()
        }).catch(error => {
            toast.show(error.response.data.message, {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
        })
    }

    const onEditorChange = (desc) => {
        setContent(desc)
    }
    return (
        <>
            {!dataDetail ?
                (
                    <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
                        <ActivityIndicator
                            color={themeSetting?.accent_color?.value}
                            size={'large'}
                            style={{ padding: 10 }}
                        />
                    </View>
                ) :
                <ScrollView style={{ backgroundColor: colors?.white }}>
                    <View style={[styles.container, { marginTop: 10, marginHorizontal: 10 }]}>
                        <Text style={{ fontSize: 14, fontWeight: "600" }}>
                            {t('forum:title_thread')}
                        </Text>
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                            <View style={{ width: WIDTH }}>
                                <TextInput
                                    style={{ borderWidth: 1, borderColor: colors?.line, marginVertical: 10, width: WIDTH, backgroundColor: colors?.white, borderRadius: 10 }}
                                    label={t('forum:title_thread')}
                                    onChangeText={(e) => setText(e)}
                                    multiline
                                    numberOfLines={3}
                                    value={text}
                                />
                            </View>
                        </KeyboardAvoidingView>
                        <SelectCategory
                            listCategories={listCategories}
                            selectedCategory={selectedCategory}
                            onMultiChange={onMultiChange}
                        />
                        <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 10 }}>
                            {t('forum:content_thread')}
                        </Text>
                        {dataDetail?.content != null &&
                            <RichEditorText
                                onEditorChange={onEditorChange}
                                initialContent={content}
                            />
                        }
                        <View style={{ marginVertical: 20, width: WIDTH }}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: themeSetting?.accent_color?.value }]}
                                onPress={() => onSaveThread("published")}
                            >
                                <Text style={{ color: colors?.white, fontWeight: "600", fontSize: 14 }}>
                                    Kirim
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors?.white }]}
                                onPress={() => onSaveThread("draft")}
                            >
                                <Text style={{ color: themeSetting?.accent_color?.value, fontWeight: "600", fontSize: 14 }}>
                                    {t('forum:save_as_draft')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            }
        </>
    )
}

