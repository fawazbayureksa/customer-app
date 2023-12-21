import React from 'react'
import { styles } from "./styles"
import { Button, Dimensions, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import colors from '../../assets/theme/colors';
import axiosInstance from '../../helpers/axiosInstance';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';
import RichEditorText from './components/RichEditor';
import { Send } from 'iconsax-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

export default function ReplyThread({ route }) {
    const richText = React.useRef();
    const [text, setText] = React.useState("")
    const navigation = useNavigation();
    const { t } = useTranslation()
    const WIDTH = Dimensions.get('window').width * 0.95;
    const toast = useToast();
    const themeSetting = useSelector(
        state => state.themeReducer?.themeSetting?.theme,
    );

    const onSaveComment = async () => {

        const account = JSON.parse(await AsyncStorage.getItem('isAccount'))

        if (text == "") {
            toast.show(t('forum:comment_required'), {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            return
        }
        let data = {
            forum_thread_id: route.params.idThread,
            content: text,
            quote_id: 0,
            user_type: account ? account : "customer", //customer / seller
        }
        axiosInstance.post('forum/thread/comment/save', data)
            .then(res => {
                console.log(res.data.message)
                navigation.goBack()
            }).catch(error => {
                toast.show(error.response.data.message, {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
                // if (error.response.data.message == "Max character content : 250") {
                //     toast.show(t('forum:max_chart'), {
                //         placement: 'top',
                //         type: 'danger',
                //         animationType: 'zoom-in',
                //         duration: 3000,
                //     });
                // }

            })
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

    const onEditorChange = (desc) => {
        setText(desc)
    }

    return (
        <ScrollView style={{ backgroundColor: colors?.white }}>
            <View style={[styles.container, { marginTop: 10, marginHorizontal: 10 }]}>
                <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 10 }}>
                    {/* {t('forum:write_comment')} */}
                    Tuliskan Komentar
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
            </View>
        </ScrollView>
    )
}

