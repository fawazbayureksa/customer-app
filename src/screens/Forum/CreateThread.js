import React, { useState, useEffect } from 'react'
import { styles } from "./styles"
import { TextInput, Alert, Button, Dimensions, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Colors, Text } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useNavigation } from '@react-navigation/native';
import colors from '../../assets/theme/colors';
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import axiosInstance from '../../helpers/axiosInstance';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';
import { Image, VideoSquare } from 'iconsax-react-native';
import RichEditorText from './components/RichEditor';
import SelectCategory from './components/SelectCategory';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateThread() {
    const [text, setText] = React.useState("")
    const [selectedCategory, setselectedCategory] = React.useState([])
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [listCategories, setListCategories] = useState()
    const richText = React.useRef();
    const WIDTH = Dimensions.get('window').width * 0.95;
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalImage, setModalImage] = useState(false);

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const { t } = useTranslation()
    useEffect(() => {
        getCategory()
    }, []);


    const { navigate } = useNavigation();
    const navigation = useNavigation();

    const onMultiChange = () => {
        return (item) => setselectedCategory(xorBy(selectedCategory, [item], 'id'))
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
                console.error('error getCategory: ', error.response);
            }).finally(() => {
                setLoading(false);
            });
    }

    const toast = useToast()

    const onSaveThread = async (status) => {
        const account = JSON.parse(await AsyncStorage.getItem('isAccount'))

        if (text == "") {
            toast.show(t('forum:title_required'), {
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
        } else if (description == "") {
            toast.show(t('forum:thread_required'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            return
        }

        let idCategory = []
        selectedCategory.forEach(i => idCategory.push(i.id))

        let params = {
            title: text,
            content: description,
            user_type: account ? account : "customer", //customer / seller
            status: status == "published" ? "published" : "draft", //published / draft
            category_id: idCategory,
            id: 0
        }
        axiosInstance
            .post(`forum/thread/save`, params)
            .then(res => {
                console.log(res.data.message)
                toast.show(res.data.message, {
                    placement: 'top',
                    type: 'success',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
                navigation.goBack()
            }).catch(error => {
                console.log(error.response.data.message);
                toast.show(error.response.data.message, {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            })
    }

    const onEditorChange = (desc) => {
        setDescription(desc)
    }


    return (
        <ScrollView style={{ backgroundColor: colors?.white }}>
            <View style={[styles.container, { marginTop: 10, marginHorizontal: 10 }]}>
                <Text style={{ fontSize: 14, fontWeight: "600" }}>
                    {t('forum:title_thread')}
                </Text>
                <View>
                    <TextInput
                        style={{ borderWidth: 1, borderColor: colors?.line, marginVertical: 10, width: WIDTH, backgroundColor: colors?.white, borderRadius: 10 }}
                        label={t('forum:title_thread')}
                        onChangeText={(e) => setText(e)}
                        multiline
                        numberOfLines={3}
                    />
                </View>
                <Text style={{ fontSize: 14, fontWeight: "600" }}>
                    {t('forum:select_category')}
                </Text>
                <SelectCategory
                    listCategories={listCategories}
                    selectedCategory={selectedCategory}
                    onMultiChange={onMultiChange}
                />
                <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 10 }}>
                    {t('forum:content_thread')}
                </Text>
                <RichEditorText
                    onEditorChange={onEditorChange}

                />
            </View>
            <View style={[styles.container, { marginTop: 10, marginHorizontal: 10 }]}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginVertical: 10 }}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: themeSetting?.accent_color?.value }]}
                        onPress={() => onSaveThread("published")}
                    >
                        <Text style={{ color: colors?.white, fontWeight: "600", fontSize: 14 }}>
                            {t('send')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
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
    )
}

