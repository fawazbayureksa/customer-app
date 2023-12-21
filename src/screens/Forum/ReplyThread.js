import React, { useState, useEffect } from 'react'
import { styles } from "./styles"
import { Image, Dimensions, KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity, View } from 'react-native'
import { Colors, Text, TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler'
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useNavigation } from '@react-navigation/native';
import colors from '../../assets/theme/colors';
import { IMAGE_URL } from "@env"
import { ForumRouteName } from '../../constants/forum_route/forumRouteName';
import axiosInstance from '../../helpers/axiosInstance';
import RenderHtml from 'react-native-render-html';
import { useTranslation } from 'react-i18next';
import RichEditorText from './components/RichEditor';
import WebView from 'react-native-webview';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import moment from 'moment';
import { Send, Verify } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function ReplyThread({ route }) {
    const richText = React.useRef();
    const [text, setText] = useState()
    const { navigate } = useNavigation();
    const navigation = useNavigation();
    const { t } = useTranslation()
    const WIDTH = Dimensions.get('window').width * 0.95;
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const onSaveComment = async () => {
        const account = JSON.parse(await AsyncStorage.getItem('isAccount'))
        let data = {
            forum_thread_id: route.params.thread_id,
            content: text,
            user_type: account ? account : "customer", //customer / seller
            quote_id: route.params.coment_id,
        }
        axiosInstance.post(`forum/thread/comment/save`, data).then(res => {
            console.log(res.data.message)
            navigation.goBack()
        }).catch(error => {
            console.log(error.response.data.message)
        })
    }

    const onEditorChange = (desc) => {
        setText(desc)
    }


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Send
                    size="26"
                    color={themeSetting?.accent_color?.value}
                    variant="Bold"
                    onPress={() => onSaveComment()}
                />
            ),
        });
    });

    const renderersProps = {
        img: {
            enableExperimentalPercentWidth: false,
            imagesInitialDimensions: WIDTH
        },
        iframe: {
            scalesPageToFit: true,
            webViewProps: {
            }
        },
    };


    const renderers = {
        iframe: IframeRenderer,
    };

    const customHTMLElementModels = {
        iframe: iframeModel
    };
    const tagsStyles = {
        img: {
            maxHeight: parseInt(WIDTH) / 2.1,
            // typeof WIDTH == 'number' ? parseInt(WIDTH) * 0.5 : WIDTH,
            width: WIDTH * 0.8,
        },
    };


    return (
        <ScrollView style={{ backgroundColor: colors?.white }}>
            <View style={[styles.card, { width: "95%", backgroundColor: "#F5F5F5" }]}>
                <View style={styles.section}>
                    <Image
                        style={styles.profil}
                        source={{
                            uri: `${IMAGE_URL}public/customer/${route.params.picture}`,
                        }}
                    />
                    <View style={{ marginLeft: 10 }}>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <Text style={{ fontSize: 14 }}>{route.params.name}</Text>
                            <Verify
                                size="20"
                                color="#FF8A65"
                                variant="Bold"

                            />
                        </View>
                        <Text style={{ fontSize: 12, color: "gray" }}>{moment(new Date(route.params.created_at)).fromNow()}</Text>
                    </View>

                </View>
                <RenderHtml
                    source={{ html: `${route.params.content}` }}
                    contentWidth={WIDTH * 0.9}
                    enableExperimentalMarginCollapsing={true}
                    WebView={WebView}
                    renderers={renderers}
                    renderersProps={renderersProps}
                    tagsStyles={tagsStyles}
                    customHTMLElementModels={customHTMLElementModels}

                />
            </View>
            <View style={[styles.container, { marginTop: 10, marginHorizontal: 10 }]}>
                <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 10 }}>
                    {t('forum:write_your_reply')}
                </Text>
                <RichEditorText
                    onEditorChange={onEditorChange}
                />
                {/* <Text style={{
                    color: colors?.danger,
                    marginTop: 10,
                    fontStyle: "italic"
                }}>
                    * {t('forum:max_chart')}
                </Text> */}
                {/* <View style={{ marginTop: "20%", width: WIDTH }}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: themeSetting?.accent_color?.value  }]}
                        onPress={() => onSaveComment()}
                    >
                        <Text style={{ color: colors?.white, fontWeight: "600", fontSize: 14 }}>
                            {t('send')}
                        </Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </ScrollView>
    )
}

