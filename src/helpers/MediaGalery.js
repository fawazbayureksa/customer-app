import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, TouchableHighlight, Image, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import colors from '../assets/theme/colors';
import axiosInstance from './axiosInstance';
import { IMAGE_URL } from "@env"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Upload from './Upload';
import { useToast } from 'react-native-toast-notifications';

const MediaGalery = (props) => {
    const [filename, set_filename] = useState('') //upload name
    const [loading, set_loading] = useState(false) //loading when uploading
    const [compress, set_compress] = useState(true) // should uploaded image be compressed

    const [records, set_records] = useState([])
    const [page, set_page] = useState(1)
    const [page_count, set_page_count] = useState(0)

    const [name, set_name] = useState('') // title form
    const [selected, set_selected] = useState(null) // selected image

    const [errors, set_errors] = useState({})
    const [photo, setPhoto] = useState(null);
    const WIDTH = Dimensions.get('window').width * 0.95;
    const HEIGHT = Dimensions.get('window').height * 0.50;
    const toast = useToast()

    useEffect(() => {
        getMediaGallery()
    }, [page])

    const getMediaGallery = () => {
        let params = {
            page: page,
            per_page: 25,
        }
        axiosInstance.get(`media/getMediaGallery`, { params })
            .then(res => {
                // console.log(res.data.data.data)
                set_records(res.data.data.data)
                set_page_count(res.data.data.last_page)
            }).catch(error => {
                console.error('error getMediaGaleri: ', error.response.data);
            })
    }
    const deletePublicImage = () => {
        axiosInstance.delete(`media/deletePublicImage/${selected.id}`)
            .then(res => {
                console.log(res.data)
                getMediaGallery()
                set_selected()
            }).catch(error => {
                console.error('error DeleteMediaGalery: ', error.response.data);
            })
    }

    const selectImage = async (index) => {
        let select = records[index]
        if (selected) {
            if (select.id == selected.id) {
                set_selected()
            } else {
                let url = await ImageGetPublicUrl("customer", select.filename)
                props.set_url(url)
                set_selected(select)
            }
        } else {
            let url = await ImageGetPublicUrl("customer", select.filename)
            props.set_url(url)
            set_selected(select)
        }
    }

    const handleUploadPhoto = (response) => {
        const formData = new FormData();
        if (response) {
            const tempPhoto = {
                uri: response?.assets[0]?.uri,
                type: response?.assets[0]?.type,
                name: response?.assets[0]?.fileName,
            };

            formData.append('file', tempPhoto);

            Upload.post(`media/uploadImage`, formData).
                then(response => {
                    toast.show('Upload successfully', {
                        placement: 'top',
                        type: 'success',
                        animationType: 'zoom-in',
                        duration: 3000,
                    });
                    console.log(response.data.message)
                    getMediaGallery()
                }).catch(error => {
                    console.log("error upload gambar", error.response.data.message);
                })
        }
    }
    const handleChoosePhoto = () => {
        launchImageLibrary({ noData: true }, (response) => {
            console.log(response);
            if (response.didCancel !== true) {
                if (response?.assets[0]?.fileSize > 1024000) {
                    toast.show('Ukuran gambar lebih dari 1 mb', {
                        placement: 'top',
                        type: 'danger',
                        animationType: 'zoom-in',
                        duration: 3000,
                    });
                } else {
                    setPhoto(response);
                    handleUploadPhoto(response)
                }
            } else {
                setPhoto()
            }
        });

    }


    return (
        <ScrollView>
            <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap" }}>
                {records.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => selectImage(index)} style={{ marginTop: 10, }}>
                        <Image
                            source={{
                                uri: `${IMAGE_URL}public/customer/${item.filename}`,
                            }}
                            style={{
                                width: WIDTH * 0.2,
                                height: WIDTH * 0.2,
                                alignSelf: 'center',
                                marginRight: 4,
                                borderRadius: 5,
                                borderWidth: selected && selected.id === item.id ? 2 : 0,
                                borderColor: selected && selected.id === item.id ? props.themeSetting?.accent_color?.value : "#FFF"
                            }}
                        />
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{ justifyContent: "flex-end", marginTop: 20 }}>
                {selected &&
                    <TouchableOpacity
                        onPress={deletePublicImage}
                        style={{
                            backgroundColor: "red",
                            padding: 10,
                            borderRadius: 10,
                            marginVertical: 10,
                            alignItems: "center"
                        }}
                    >
                        <Text style={{ color: colors?.white, fontSize: 12 }} >Delete image</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity
                    onPress={props.addImage}
                    style={{
                        backgroundColor: props.themeSetting?.accent_color?.value,
                        padding: 10,
                        borderRadius: 10,
                        marginVertical: 10,
                        alignItems: "center"
                    }}
                >
                    <Text style={{ color: colors?.white, fontSize: 12 }} >Select image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleChoosePhoto}
                    style={{
                        backgroundColor: "grey",
                        padding: 10,
                        borderRadius: 10,
                        alignItems: "center"
                    }}>
                    <Text style={{ color: colors?.white, fontSize: 12 }}>Upload Image</Text>
                </TouchableOpacity >
            </View>
        </ScrollView >
    );
}

export default MediaGalery;

export const ImageGetPublicUrl = async (folder, filename) => {
    if (!folder || !filename) {
        return ''
    }

    let params = {
        folder: folder,
        filename: filename
    }
    return await axiosInstance.get(`images/getPublicUrl`, { params }).then(response => {
        return response.data
    }).catch(error => {
        console.log(error)
    })
}
