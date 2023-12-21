import React, { useState, useEffect } from 'react'
import { Dimensions, TextInput, KeyboardAvoidingView, Platform, View, StyleSheet, Button, TouchableHighlight, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { Colors, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import colors from '../../../assets/theme/colors';
import Modal from 'react-native-modal';
import { Image, VideoSquare } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import MediaGalery from '../../../helpers/MediaGalery';
import CustomButton from '../../../components/CustomButton/index'
import { useRef } from 'react';

const RichEditorText = ({ onEditorChange, initialContent }) => {
    const richText = React.useRef();
    const WIDTH = Dimensions.get('window').width * 0.95;
    const [modalImage, setModalImage] = useState(false);
    const [modalUploadImage, setModalUploadImage] = useState(false);
    const [imageGalery, setImageGalery] = useState(false);
    const [modalVideo, setModalVideo] = useState(false);
    const [urli, set_url] = useState('') // title form
    const [link, setLink] = useState("");
    let scrollRef = useRef();

    const onPressAddImage = () => {
        richText.current?.insertImage(link, 'width: auto;height:auto');
        setLink("")
        setModalImage(false)
    }

    const handleAddVideo = () => {
        setModalVideo(true)
    }

    const onPressAddVideo = () => {
        const linkVideo = link.slice(17)

        richText.current?.insertHTML(`
            <iframe src="https://www.youtube.com/embed/${linkVideo}" width="350" height="215" allowFullscreen="1"></iframe>
        `);
        setLink("")
        setModalVideo(false)
    }

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );


    const addImage = () => {
        richText.current?.insertImage(urli, 'width: auto;height:auto');
        setImageGalery(false)
    }
    const HEIGHT = Dimensions.get('window').height * 0.50;

    const handleCursorPosition = (scrollY) => {
        // Positioning scroll bar
        scrollRef.current.scrollTo({ y: scrollY - 30, animated: true });
    }

    return (
        <SafeAreaView>
            <ScrollView
                ref={scrollRef}
                nestedScrollEnabled={true}
                style={[styles.scroll]}
            >
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                    <RichEditor
                        editorStyle={{
                            contentCSSText: `
                            display: flex; 
                            flex-direction: column; 
                            min-height: 200px; 
                            position: absolute; 
                            top: 0; right: 0; bottom: 0; left: 0;`,
                        }}
                        ref={richText}
                        onChange={(desc) => onEditorChange(desc)}
                        style={{
                            flex: 1,
                            borderColor: colors?.line,
                            borderWidth: 1,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10
                        }}
                        useContainer={true}
                        initialHeight={HEIGHT}
                        enterKeyHint={'done'}
                        containerStyle={{ borderRadius: 24 }}
                        pasteAsPlainText={true}
                        initialContentHTML={initialContent}
                        onCursorPosition={handleCursorPosition}
                    />
                </KeyboardAvoidingView>
            </ScrollView>
            {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
            <RichToolbar
                style={{
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    backgroundColor: "#FFF",
                    borderWidth: 1,
                    borderColor: colors?.line
                }}
                editor={richText}
                actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.alignLeft,
                    actions.alignCenter,
                    actions.alignRight,
                    actions.insertVideo,
                    'insertImage',
                    actions.keyboard,
                ]}
                iconMap={{
                    [actions.heading1]: ({ tintColor }) => (<Text style={[{ color: tintColor }]}>H1</Text>),
                    insertImage: ({ tintColor }) => (<Image color={tintColor} variant="Bold" />)
                }}
                insertVideo={handleAddVideo}
                insertImage={() => setModalUploadImage(true)}
            />
            {/* </KeyboardAvoidingView> */}
            <Modal
                isVisible={modalImage}
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
                backdropOpacity={0.30}
                animationIn="fadeInDown"
                coverScreen={true}
                onBackdropPress={() => setModalImage(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: colors?.white,
                    maxHeight: 120,
                    width: WIDTH * 0.8,
                    padding: 10
                }}>
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text
                                style={{
                                    marginBottom: 10,
                                    fontSize: 16,
                                }}
                            >
                                Insert Link Image
                            </Text>
                        </View>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: colors?.line,
                                marginVertical: 10,
                                backgroundColor: colors?.white,
                                borderRadius: 10
                            }}
                            // label={t('forum:title_thread')}
                            onChangeText={(e) => setLink(e)}
                            multiline
                            numberOfLines={2}
                        />
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: colors?.white,
                        width: WIDTH * 0.8,
                        alignItems: "center",
                    }}
                >
                    <TouchableHighlight
                        style={{
                            backgroundColor: themeSetting?.accent_color?.value,
                            padding: 10,
                            borderRadius: 10,
                            marginVertical: 20
                        }}
                        onPress={onPressAddImage}
                    >
                        <Text style={{ color: colors?.white, fontSize: 12 }}>Add image</Text>
                    </TouchableHighlight>
                </View>
            </Modal >
            <Modal
                isVisible={modalVideo}
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
                backdropOpacity={0.30}
                animationIn="fadeInDown"
                coverScreen={true}
                onBackdropPress={() => setModalVideo(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: colors?.white,
                    maxHeight: 120,
                    width: WIDTH * 0.8,
                    padding: 10
                }}>
                    <View>
                        <Text
                            style={{
                                marginBottom: 10,
                                fontSize: 16
                            }}
                        >
                            Insert Link Video
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: colors?.line,
                                marginVertical: 10,
                                backgroundColor: colors?.white,
                                borderRadius: 10
                            }}
                            label='insert link embed'
                            onChangeText={(e) => setLink(e)}
                            multiline
                            numberOfLines={2}
                        />
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: colors?.white,
                        width: WIDTH * 0.8,
                        alignItems: "center",
                    }}
                >
                    <TouchableHighlight
                        style={{
                            backgroundColor: themeSetting?.accent_color?.value,
                            padding: 10,
                            borderRadius: 10,
                            marginVertical: 20
                        }}
                        onPress={onPressAddVideo}
                    >
                        <Text style={{ color: colors?.white, fontSize: 12 }}>Add Video</Text>
                    </TouchableHighlight>
                </View>
            </Modal >
            <Modal
                isVisible={imageGalery}
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
                backdropOpacity={0.30}
                animationIn="fadeInDown"
                coverScreen={true}
                onBackdropPress={() => setImageGalery(false)}
            >
                <View style={{ padding: 10, backgroundColor: "#FFF", width: WIDTH, borderRadius: 10 }}>
                    <TouchableOpacity onPress={() => setImageGalery(false)} style={{ alignItems: "flex-end" }}>
                        <Icon name='close' size={20} color={"#000"} />
                    </TouchableOpacity>
                    <MediaGalery themeSetting={themeSetting} set_url={set_url} urli={urli} addImage={addImage} />
                </View>
            </Modal>
            <Modal
                isVisible={modalUploadImage}
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
                backdropOpacity={0.30}
                animationIn="fadeInDown"
                coverScreen={true}
                onBackdropPress={() => setModalUploadImage(false)}
            >
                <View style={{ height: 200, backgroundColor: "#FFF", width: WIDTH, borderRadius: 10, padding: 10 }}>
                    <TouchableOpacity onPress={() => setModalUploadImage(false)} style={{ alignItems: "flex-end" }}>
                        <Icon name='close' size={20} color={"#000"} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <CustomButton
                            onPress={() => { setModalImage(true), setModalUploadImage(false) }}
                            primary
                            style={{ width: WIDTH * 0.80 }}
                            title="Insert Link"
                        />
                        <CustomButton
                            onPress={() => { setImageGalery(true), setModalUploadImage(false) }}
                            primary
                            style={{ width: WIDTH * 0.80 }}
                            title="Image Galery"
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    );
}

export default RichEditorText;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
    },
    rich: {
        maxHeight: 300,
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#e3e3e3',
    },
    topVi: {
        backgroundColor: '#fafafa',
    },
    richBar: {
        borderColor: '#efefef',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    richBarDark: {
        backgroundColor: '#191d20',
        borderColor: '#696969',
    },
    scroll: {
        backgroundColor: '#ffffff',
    },
    scrollDark: {
        backgroundColor: '#2e3847',
    },
    darkBack: {
        backgroundColor: '#191d20',
    },
    item: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#e8e8e8',
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        paddingHorizontal: 15,
    },

    input: {
        flex: 1,
    },

    tib: {
        textAlign: 'center',
        color: '#515156',
    },

    flatStyle: {
        paddingHorizontal: 12,
    },
});

