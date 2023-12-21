import { useNavigation } from '@react-navigation/native';
import { ArrowLeft2, ArrowRight2, VideoSquare } from 'iconsax-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, Text, View, StyleSheet, Image, Linking } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import colors from '../../../assets/theme/colors';
import CustomButton from '../../../components/CustomButton';
import moment from 'moment';
import { WebsocketContext, ChatMessageType, WebsocketPayloadType } from '../../../helpers/websocket/WebsocketHelper';
import { IMAGE_URL } from "@env";
import { MarketplaceRouteName } from '../../../constants/marketplace_route/marketplaceRouteName';
import convertCSS from '../../../helpers/convertCSS';
import { useToast } from 'react-native-toast-notifications';
import RNFetchBlob from "rn-fetch-blob";

const ChatBubbleMessage = ({message}) => {
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const { navigate } = useNavigation()
    const toast = useToast()

    const WIDTH = Dimensions.get('window').width * 0.95;
    const HEIGHT = Dimensions.get('window').height * 0.95;
    const fontSize = convertCSS(themeSetting.body_typography.font_size);
    const dirs = RNFetchBlob.fs.dirs;


    let thisProduct = {"slug" : message?.data?.slug, "mp_seller": message?.data?.mp_seller};
    const dataUri64 = `data:;base64,${message.data}`

    const navigateToProduct = (inputProduct) => {
        console.log("clear");
        navigate(MarketplaceRouteName.PRODUCT_DETAIL, { product: inputProduct })
        
    }

    const downloadAttachment = async() => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission Required',
                    message:
                        'Application needs access to your storage to download File',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Start downloading
                getFileAttachment();
                console.log('Storage Permission Granted.');
            } else {
                // If permission denied then show alert
                Alert.alert('Error', 'Storage Permission Not Granted');
            }
        } catch (err) {
            // To handle permission related exception
            console.log('++++' + err);
        }
        
    }

    const getFileAttachment = async() => {
        let pathFile = RNFetchBlob.fs.dirs.DownloadDir + '/' + message.message
        RNFetchBlob.fs.createFile(pathFile, message.data, 'base64')
            .then((res) => {
                console.log("file ", res);
                // let status = res.info().status;
                // console.log("The file saved to ", res.path());
                // console.log(status);
                toast.show('Download Success', {
                    placement: 'top',
                    type: 'success',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            })
            // Something went wrong:
            .catch((errorMessage) => {
                console.log(errorMessage);
                toast.show('Download Failed, File may already exist', {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            });
    }

    let typeMessageDisplay = {
        position: "",
        color: ""
    }

    if (message.user_type === "customer") {
        typeMessageDisplay = {
            position: "flex-end",
            color: "#DCDCDC"
        }
    } else {
        typeMessageDisplay = {
            position: "flex-start",
            color: "#FFFFFF"
        }
    }
    
    return (
        <>
            <View style={{
                width: WIDTH,
                marginHorizontal: 10,
                marginVertical: 5,
                justifyContent: typeMessageDisplay.position,
                flexDirection: "row"
            }}>
                <View style={{
                    // width: '80%',
                    maxWidth: '80%',
                    minWidth: '25%',
                    backgroundColor: typeMessageDisplay.color,
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: colors.line
                }}>
                    {
                        (message.type === ChatMessageType.Text) ?
                            <>
                                <Text style={{ color: "#404040" }}>
                                    {message.message}
                                </Text>
                            </> :
                            (message.type === ChatMessageType.Product) ?
                                <>
                                    {
                                        (message.data) ?
                                            <>
                                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigateToProduct(thisProduct)}>
                                                    <View style={{ width: '30%' }}>
                                                        <Image
                                                            source={{ uri: `${IMAGE_URL}public/marketplace/products/${message?.data?.mp_product_images[0]?.filename}` }}
                                                            style={{ height: 80, width: '100%', borderRadius: 10 }}
                                                        />
                                                    </View>
                                                    <View style={{ width: '65%', marginLeft: '5%' }}>
                                                        <Text style={{ fontSize: fontSize * 0.9, fontWeight: "700", }}>
                                                            {message?.data?.mp_product_informations[0]?.name}
                                                        </Text>
                                                        <Text style={{ color: "#404040" }}>
                                                            {message?.data?.mp_seller?.name}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </> :
                                            <>
                                                <Text style={{ color: "#404040" }}>
                                                    Invalid Product
                                                </Text>
                                            </>
                                    }
                                </> :
                                <>
                                    <TouchableOpacity style={{ flexDirection: 'column', justifyContent: 'center' }}
                                        onPress={() => downloadAttachment()}
                                    >
                                        <View style={{ alignItems: 'center', width: '100%' }}>
                                            {
                                                (message.message.slice(-3) == 'jpg' || message.message.slice(-3) == 'png'|| message.message.slice(-3) == 'jpeg') ?
                                                    <>
                                                        <Image
                                                            source={{ uri: dataUri64 }} //for android only, ios need adjustment
                                                            style={{ height: 100, width: 100, borderRadius: 10 }}
                                                        />
                                                    </> :
                                                    <>
                                                        <Icon
                                                            name='insert-drive-file'
                                                            // onPress={() => toggleModal(item.id)}
                                                            size={64}
                                                            color={colors?.pasive}
                                                            style={{ marginLeft: 10 }}
                                                        />
                                                    </>
                                            }
                                        </View>
                                        <Text style={{ color: "blue", marginTop: 5 }}>
                                            {message.message}
                                        </Text>
                                    </TouchableOpacity>
                                </>
                    }
                    <Text style={{ textAlign: "right", color: colors.textmuted }}>{moment(message.created_at).format('HH : mm')}</Text>
                </View>
            </View>
        </>
    )
}

export default ChatBubbleMessage