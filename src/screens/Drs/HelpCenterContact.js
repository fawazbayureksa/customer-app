import { useNavigation } from '@react-navigation/native';
import { FolderAdd } from 'iconsax-react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../../assets/theme/colors';
import CustomButton from '../../components/CustomButton';
import axiosInstance from '../../helpers/axiosInstance';
import DocumentPicker from 'react-native-document-picker';
import Upload from '../../helpers/Upload';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';

const WIDTH = Dimensions.get('window').width;

const HelpCenterContact = ({ route }) => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('pemesanan');
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    const [items, setItems] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [transaction, setTransaction] = useState();
    const [singleFile, setSingleFile] = useState(null);
    const navigation = useNavigation();
    const toast = useToast()
    const state = useSelector(state => state);
    useEffect(() => {
        getCategories()
    }, []);

    const getCategories = () => {
        setLoading(true);
        axiosInstance.get('drs/ticket/categories/get')
            .then((res) => {
                setItems(res.data.data)
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                setLoading(false);
            })
    }

    const submitResponse = () => {
        setLoading(true);
        let data = {
            category_id: value,
            title: title,
            description: detail,
            attachments: attachments,
            transaction_id: route?.params?.transaction_id,
        }
        axiosInstance.post('drs/ticket/submit', data)
            .then((res) => {
                console.log(res.data)
                toast.show('Success', {
                    placement: 'top',
                    type: 'success',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
                navigation.goBack()
            }).catch(error => {
                console.log(error.response.data.message)
            }).finally(() => {
                setLoading(false);
            })
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



    return (
        <ScrollView style={{ backgroundColor: colors.white }} nestedScrollEnabled={true}>
            <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
                <Text style={{ textAlign: "justify" }}>
                    Hai, {JSON.parse(state?.authReducer?.user)?.name}! Mohon maaf atas ketidaknyamanan Anda. Harap beritahu kami masalah yang sedang Anda hadapi.
                </Text>
            </View>
            <View style={{ marginHorizontal: 10, marginBottom: 20 }}>
                <Text style={{ marginBottom: 5, fontWeight: "600", color: "#404040" }}>
                    Kategori Permasalahan
                </Text>
                <DropDownPicker
                    zIndex={1000}
                    placeholder="Pilih"
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    listMode="SCROLLVIEW"
                    scrollViewProps={{
                        nestedScrollEnabled: true,
                    }}
                    style={{
                        borderWidth: 1,
                        borderRadius: 10,
                        color: '#000000',
                        backgroundColor: '#FFFFFF',
                        borderColor: colors?.line,
                    }}
                    containerStyle={{
                        zIndex: 1000,
                        flex: 1,
                    }}
                    dropDownContainerStyle={{
                        borderWidth: 1,
                        borderRadius: 10,
                        color: '#000000',
                        backgroundColor: '#FFFFFF',
                        borderColor: colors?.line,
                    }}
                />
            </View>
            <View style={{ marginHorizontal: 10, marginBottom: 20 }}>
                <Text style={{ marginBottom: 5, fontWeight: "600", color: "#404040" }}>
                    Judul
                </Text>
                <TextInput
                    style={[Styles.input, { borderColor: colors.line }]}
                    value={title}
                    onChangeText={text => setTitle(text)}
                    placeholder=""
                />
            </View>
            <View style={{ marginHorizontal: 10, marginBottom: 20 }}>
                <Text style={{ marginBottom: 5, fontWeight: "600", color: "#404040" }}>
                    Detail Permasalahan
                </Text>
                <TextInput
                    style={[Styles.input, { borderColor: colors.line }]}
                    value={detail}
                    onChangeText={text => setDetail(text)}
                    placeholder=""
                    numberOfLines={3}
                />
                <Text style={{ fontSize: 12, color: "#404040" }}>Min. 30 Karakter</Text>
            </View>
            <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
                <Text style={{ marginBottom: 5, fontWeight: "600", color: "#404040" }}>
                    Lampirkan File (Opsional)
                </Text>
                <View
                    style={[Styles.input, {
                        borderColor: colors.line,
                        height: 100,
                        justifyContent: "center",
                        alignItems: "center",
                        borderStyle: 'dashed'
                    }]}
                >
                    {!singleFile ?
                        <>
                            <FolderAdd
                                onPress={selectFile}
                                size="32"
                                color={colors.pasive}
                                variant="Outline"
                            />
                            <Text>Belum ada file</Text>
                        </>
                        :
                        <Text>
                            File Name: {singleFile[0].name}
                        </Text>
                    }
                </View>
                <Text style={{ fontSize: 12, color: "#404040" }}>Format: .jpeg .jpg .png .mp4 .mkv .mov</Text>
            </View>
            <CustomButton
                style={{
                    height: 44,
                    width: '95%',
                    alignSelf: 'center',
                    marginTop: 12,
                    marginBottom: 20,
                }}
                onPress={submitResponse}
                primary
                title="Kirim"
            />
            <CustomButton
                onPress={() => navigation.goBack()}
                style={{
                    height: 44,
                    width: '95%',
                    alignSelf: 'center',
                    marginTop: 12,
                    marginBottom: 20,
                }}
                secondary
                title="Kembali Ke FAQ"
            />
        </ScrollView>
    );
}

const Styles = StyleSheet.create({
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10
    },
})

export default HelpCenterContact;
