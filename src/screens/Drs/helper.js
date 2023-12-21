import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SearchNormal1 } from 'iconsax-react-native';
import { Dimensions, Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, PermissionsAndroid, Platform } from 'react-native';
import colors from '../../assets/theme/colors';
import { drsRouteName } from '../../constants/drs_route/drsRouteName';
import axiosInstance from '../../helpers/axiosInstance';
import truncate from '../../helpers/truncate';
import moment from 'moment';
import RNFetchBlob from "rn-fetch-blob";
import { API_URL, Origin } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useToast } from 'react-native-toast-notifications';

export const TicketAttachment = (props) => {
    const [showImagePreview, setShowImagePreview] = useState(false)
    const [src, setSrc] = useState('')
    const [loading, setLoading] = useState(false);

    const toast = useToast()

    useEffect(() => {
        if (!props.id) return;
        if (props.type === "img") {
            getTicketImageAttachment()
        }
    }, [props.id])

    const getTicketImageAttachment = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        RNFetchBlob.config({
            // add this option that makes response data to be stored as a file,
            // this is much more performant.
            // appendExt: "jpg",
            fileCache: true,
          }).fetch(
            "GET", `${API_URL}drs/ticket/attachment/${props.id}`, {
            Authorization : `Bearer ${token}`,
            Origin: Origin
        })
            .then((res) => {
                let status = res.info().status;
                console.log(status);
                if (status == 200) {
                    // the conversion is done in native code
                    let base64Str = res.base64();
                    
                    // the following conversions are done in js, it's SYNC
                    let text = res.text();
                    let json = res.json();
                    setSrc(res.path());
                    // console.log(res.path());
                } else {
                    // handle other status codes
                }
            })
            // Something went wrong:
            .catch((errorMessage, statusCode) => {
                // error handling
            });
    }

    const getTicketFileAttachment = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        let dirs = RNFetchBlob.fs.dirs.DownloadDir;
        RNFetchBlob.config({
            // path: dirs.DocumentDir + "/downloads",
            fileCache: true,
            addAndroidDownloads: {
                path:
                    dirs + '/' +
                    props?.media,
                description: 'downloading file...',
                notification: true,
                // useDownloadManager works with Android only
                useDownloadManager: true,
              }
          }).fetch(
            "GET", `${API_URL}drs/ticket/attachment/${props.id}`, {
            Authorization : `Bearer ${token}`,
            Origin: Origin
        })
            .then((res) => {
                // let status = res.info().status;
                // console.log("The file saved to ", res.path());
                // console.log("Res->", res);
                toast.show('Download Success', {
                    placement: 'top',
                    type: 'success',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            })
            // Something went wrong:
            .catch((errorMessage, statusCode) => {
                // error handling
                // console.log(errorMessage);
                toast.show('Download Failed', {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            });
    }

    const downloadFile = async () => {
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
                getTicketFileAttachment();
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

    return (
        <View style={{ marginTop: 15, width: '100%' }}>
            {
                (props.type === "img") ?
                    <>
                        <TouchableOpacity style={{alignItems: 'center'}} onPress={() => getTicketFileAttachment()}>
                            <Image
                                source={{ uri: `file://${src}` }} //for android only, ios need adjustment
                                style={{ height: 100, width: 100, borderRadius: 10 }}
                            /> 
                        </TouchableOpacity>
                    </> :
                    <>
                        <TouchableOpacity style={{alignItems: 'center'}} onPress={() => downloadFile()}>
                            <Icon
                                name='insert-drive-file'
                                // onPress={() => toggleModal(item.id)}
                                size={64}
                                color={colors?.pasive}
                                style={{ marginLeft: 10 }}
                            />
                        </TouchableOpacity>
                    </>
            }
            <Text style={{color: 'blue'}}>{truncate(props?.media)}</Text>
        </View>
    )
}