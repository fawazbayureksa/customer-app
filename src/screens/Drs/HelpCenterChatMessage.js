import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft2, ArrowRight2, VideoSquare } from 'iconsax-react-native';
import { Dimensions, TextInput, TouchableOpacity, FlatList, ScrollView, Text, View, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import colors from '../../assets/theme/colors';
import CustomButton from '../../components/CustomButton';
import axiosInstance from '../../helpers/axiosInstance';
import { useToast } from 'react-native-toast-notifications';
import { MarketplaceRouteName } from '../../constants/marketplace_route/marketplaceRouteName';
import { drsRouteName } from '../../constants/drs_route/drsRouteName';
import moment from 'moment';
import { TicketAttachment } from './helper';
import DocumentPicker from 'react-native-document-picker';
import Upload from '../../helpers/Upload';
import convertCSS from '../../helpers/convertCSS';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
  import { MenuProvider } from 'react-native-popup-menu';

const ArrowBackButton = () => {
    const navigation = useNavigation();
    return (
        <ArrowLeft2
            size="24"
            color="#000"
            onPress={() => {
                navigation.goBack();
            }}
            style={{ marginRight: 5, marginLeft: -10 }}
        />
    );
}

const MenuButton = () => {
    return (
        <Icon
            name='more-vert'
            // onPress={() => toggleModal(item.id)}
            size={28}
            color={colors?.pasive}
            style={{ marginLeft: 80 }}
        />
    );
}

const HelpCenterChatMessage = ({ navigation, route }) => {
    const {ticketId} = route.params;
    const WIDTH = Dimensions.get('window').width * 0.95;
    const HEIGHT = Dimensions.get('window').height * 0.95;

    const { navigate } = useNavigation()
    const [loading, setLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState();
    const [transactionDetail, setTransactionDetail] = useState();
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');

    const [attachments, setAttachments] = useState([]);
    const [singleFile, setSingleFile] = useState(null);

    const scrollViewRef = useRef(null);

    const toast = useToast()

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const fontSize = convertCSS(themeSetting.body_typography.font_size);

    let prevDate = moment(selectedTicket?.created_at).format('DD MMMM YYYY');

    useEffect(() => {
        getTicket();
      }, []);

    const getTicket = () => {
        setLoading(true);
        axiosInstance
            .get(`drs/ticket/get?search=${search}`)
            .then(res => {
                setSelectedTicket(res.data.data.find((value, index, obj) => value.id === ticketId));
                // console.log("selected data-> ",res.data.data.find((value, index, obj) => value.id === ticketId));
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleSubmit = () => {
        if (!message)
        return;
        // console.log(message)
        setLoading(true)
        axiosInstance.post('drs/ticket/send-response', {
            ticket_id: selectedTicket?.id,
            response: message,
            attachments: attachments
            // attachments: this.state.attachments.map((item) => (item.filename))
        }).then((res) => {
            // console.log(res.data);
            setMessage('')
            setAttachments([]);
            setSingleFile(null);
            getTicket();
        }).catch((err) => {
            toast.show(err.response.data.message, {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
        }).finally(() => setLoading(false));
    }

    const handleResolve = () => {
        setLoading(true)
        axiosInstance.post('drs/ticket/resolve', {
            ticket_id: selectedTicket?.id
        }).then((res) => {
            console.log(res.data)
            toast.show('Success', {
                placement: 'top',
                type: 'success',
                animationType: 'zoom-in',
                duration: 3000,
            });
            navigation.navigate(drsRouteName.HELP_CENTER_CHAT)
        }).catch((err) => {
            toast.show(err.response.data.message, {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
        }).finally(() => setLoading(false));
    }

    const selectFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            setSingleFile(res);
            handleUploadFile(res)
        } catch (err) {
            setSingleFile(null);
            if (DocumentPicker.isCancel(err)) {
                toast.show('Canceled', {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            } else {
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    const selectImageFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            setSingleFile(res);
            handleUploadFile(res)
        } catch (err) {
            setSingleFile(null);
            if (DocumentPicker.isCancel(err)) {
                toast.show('Canceled', {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            } else {
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    }

    const handleUploadFile = (response) => {
        const formData = new FormData();
        if (response) {
            const tempPhoto = {
                uri: response[0]?.uri,
                type: response[0]?.type,
                name: response[0]?.name,
            };
            formData.append('file', tempPhoto);

            Upload.post(`drs/ticket/save-file`, formData)
                .then(response => {
                    toast.show('successfully upload file', {
                        placement: 'top',
                        type: 'success',
                        animationType: 'zoom-in',
                        duration: 3000,
                    });
                    let name = []
                    name.push(response.data.data)
                    setAttachments(name);
                }).catch(error => {
                    console.log("error upload gambar", error.response.data.message);
                })
        }
    }

    const goToTransactionDetail = () => {
        let transaction_information = selectedTicket?.ticket_customer_details?.find(value => value.key === 'transaction_information')
        if (!transaction_information){
            return
        } else {
            let transaction_information_value = JSON.parse(transaction_information.value)
            let transaction_code = transaction_information_value.find(x=>x.key === "transaction_code")
            navigate(MarketplaceRouteName.ORDER_DETAIL, {
                url: transaction_code.value,
              });
            console.log(transaction_code.value);
        }
    }

    return (
        <>
            <View style={{ padding: 10, zIndex: 10, maxHeight: 60, borderBottomWidth: 0.5, borderColor: colors.pasive }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                        <ArrowBackButton />
                        <View>
                            {
                                (selectedTicket?.ticket_statuses[selectedTicket.ticket_statuses.length - 1].status === 'pending') ?
                                    <>
                                        <Text
                                            style={{ fontSize: 16, fontWeight: "700" }}
                                        >
                                            {selectedTicket?.title} [Pending]
                                        </Text>
                                    </> :
                                    <>
                                        <Text
                                            style={{ fontSize: 16, fontWeight: "700" }}
                                        >
                                            {selectedTicket?.title}
                                        </Text>
                                    </>
                            }
                            
                            <Text
                                style={{ fontSize: 14, color: colors.textmuted }}
                            >
                                {selectedTicket?.ticket_number}</Text>
                        </View>
                    </View>
                    
                    <View style={{minHeight: 60, marginTop: 5}}>
                        <MenuProvider>
                            <Menu style={{minWidth: 100}}>
                                <MenuTrigger>
                                    <MenuButton />
                                </MenuTrigger>
                                <MenuOptions style={{ zIndex: 111 }}>
                                    {
                                        (selectedTicket?.ticket_customer_details?.find(value => value.key === 'transaction_information')) ?
                                            <>
                                                <MenuOption onSelect={goToTransactionDetail} >
                                                    <Text>Lihat Transaksi</Text>
                                                </MenuOption>
                                            </> :
                                            <>
                                            </>
                                    }
                                    {
                                        ((selectedTicket?.ticket_statuses[selectedTicket.ticket_statuses.length - 1].status === 'pending') || (selectedTicket?.ticket_statuses[selectedTicket.ticket_statuses.length - 1].status === 'resolved')) ?
                                            <></> :
                                            <>
                                                <MenuOption onSelect={handleResolve} >
                                                    <Text>Selesai</Text>
                                                </MenuOption>
                                            </>
                                    }
                                </MenuOptions>
                            </Menu>
                        </MenuProvider>
                    </View>
                </View>
            </View>
            <ScrollView
                style={{ backgroundColor: colors.white, zIndex: 1 }}
                ref={scrollViewRef} 
                onContentSizeChange={() => {scrollViewRef.current?.scrollToEnd()}}
            >
                <View style={{ width: WIDTH, marginHorizontal: 10, marginVertical: 10 }}>
                    <Text style={{ textAlign: "center", color: colors.textmuted }}>Hati-hati penipuan! Segala bentuk transaksi yang dilakukan di luar Tokodapur bukan tanggung jawab kami.</Text>
                </View>
                <View style={{ width: WIDTH, marginHorizontal: 10, marginBottom: 5 }}>
                    <Text style={{ textAlign: "center", color: colors.textmuted }}>
                        {moment(selectedTicket?.created_at).format('DD MMMM YYYY, HH : mm')}
                    </Text>
                </View>
                {
                    selectedTicket?.ticket_responses?.map((data, index) => {
                        let currentDate = moment(data?.created_at).format('DD MMMM YYYY');
                        let showDate;
                        if (prevDate) {
                            if (prevDate === currentDate) {
                                showDate = false
                            } else {
                                showDate = prevDate;
                                prevDate = currentDate
                            }
                        }
                        else {
                            showDate = false;
                            prevDate = currentDate
                        }
                        return (
                            <>
                                {
                                    (showDate) ?
                                    <>
                                        <View style={{ width: WIDTH, marginHorizontal: 10, marginBottom: 5 }}>
                                            <Text style={{ textAlign: "center", color: colors.textmuted }}>
                                                {moment(data?.created_at).format('DD MMMM YYYY')}
                                            </Text>
                                        </View>
                                    </>:
                                    <></>
                                }
                                <View style={[styles.bubblePosition, (data?.created_by.substring(0, 8) === 'customer') ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }]}>
                                    <View style={[styles.bubbleStyle, (data?.created_by.substring(0, 8) === 'customer') ? { backgroundColor: "#DCDCDC" } : { backgroundColor: "#FFFFFF" }]}>
                                        <Text style={{ color: "#404040" }}>
                                            {data.response}
                                        </Text>
                                        {
                                            data?.ticket_response_media?.map((value, index) => (
                                                <TicketAttachment key={value.id} id={value.id} type={value.type} media={value.media} />
                                            ))
                                        }
                                        <Text style={{ textAlign: "right", color: colors.textmuted, marginTop: 5 }}>{moment(data.created_at).format('HH : mm')}</Text>
                                    </View>
                                </View>
                            </>
                        )
                    }
                    )
                }
            </ScrollView >
            {
                ((selectedTicket?.ticket_statuses[selectedTicket.ticket_statuses.length - 1].status === 'pending') || (selectedTicket?.ticket_statuses[selectedTicket.ticket_statuses.length - 1].status === 'resolved')) ?
                    <>
                    </> :
                    <>
                        <View
                            style={{
                                backgroundColor: '#fff',
                                padding: 12,
                                borderColor: 'rgba(10, 0, 0, 0.1)',
                                borderWidth: 1,
                            }}>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',

                                }}>
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: colors.line,
                                        width: WIDTH * 0.90,
                                        borderRadius: 10,
                                        paddingVertical: 5,
                                        paddingLeft: 10,
                                        marginRight: 10
                                    }}
                                    placeholder={(singleFile) ? "Tulis Pesan Sebelum Mengirim File": "Tulis Pesan Anda"}
                                    onChangeText={value => (setMessage(value))}
                                    value={message}
                                />
                                <TouchableOpacity onPress={() => handleSubmit()}>
                                    <Icon name='send' size={30} color={themeSetting.accent_color.value} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                {
                                    (singleFile) ?
                                        <>
                                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                                <View style={{ width: '30%' }}>
                                                    {
                                                        (singleFile[0]?.type?.substring(0, 5) === 'image') ?
                                                            <>
                                                                <Image
                                                                    source={{ uri: singleFile[0]?.uri }}
                                                                    style={{ height: 80, width: 80, borderRadius: 10 }}
                                                                />
                                                            </> :
                                                            <>
                                                                <Icon name='insert-drive-file' size={80} color={colors.pasive} />
                                                            </>
                                                    }
                                                </View>
                                                <View style={{ width: '65%', marginTop: 10 }}>
                                                    <Text style={{ fontSize: fontSize * 0.9, fontWeight: "700", }}>
                                                        {singleFile[0]?.name}
                                                    </Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setSingleFile(null);
                                                        setAttachments([]);
                                                    }}
                                                    style={{ width: '5%' }}>
                                                    <Text style={{ fontSize: fontSize * 1.2, fontWeight: "700", color: 'red' }}>
                                                        x
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </> :
                                        <>
                                            <TouchableOpacity
                                                onPress={selectFile}
                                            >
                                                <Icon name='attach-file' size={30} color={colors.pasive} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={selectImageFile}
                                            >
                                                <Icon name='photo' size={30} color={colors.pasive} />
                                            </TouchableOpacity>
                                            {/* <TouchableOpacity>
                                                    <VideoSquare
                                                        size="30"
                                                        color={colors.pasive}
                                                        variant="Bold"
                                                    />
                                                </TouchableOpacity> */}
                                        </>
                                }
                                
                            </View>
                        </View>
                    </>
            }           
        </>
    );
}

const styles = StyleSheet.create({
    bubblePosition: {
        width: '95%',
        marginHorizontal: 10,
        marginVertical: 5,
        // justifyContent: "flex-end",
        flexDirection: "row"
    },
    bubbleStyle: {
        maxWidth: '80%',
        minWidth: '25%',
        // backgroundColor: "#FFFFFF",
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.line
    }
})

export default HelpCenterChatMessage;
