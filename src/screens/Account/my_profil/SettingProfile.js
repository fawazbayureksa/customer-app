import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../../../assets/theme/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { CalendarSearch, Camera, PictureFrame, Verify } from 'iconsax-react-native';
import axiosInstance from '../../../helpers/axiosInstance';
import { IMAGE_URL } from "@env"
import CustomAlert from '../../Forum/components/CustomAlert';
import { ActivityIndicator } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Upload from '../../../helpers/Upload';
import { useNavigation } from '@react-navigation/native';
import { MainRouteName } from '../../../constants/mainRouteName';
import GetMedia from '../../../components/common/GetMedia';
const SettingProfile = () => {

    const [email_verified, set_email_verified] = useState(false);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [value, setValue] = useState(null);
    const [email, setEmail] = useState("");
    const [numberPhone, setNumberPhone] = useState();
    const [picture, setPicture] = useState();
    const [modalSuccesUpdate, setModalSuccesUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([
        { label: 'Laki-laki', value: 'male' },
        { label: 'Perempuan', value: 'female' },
    ]);
    const [isDatePickerVisible, setIsDatePickerVisible] = React.useState(false);
    const [date, setDate] = useState();
    const [photo, setPhoto] = useState(null);
    const toast = useToast()

    const { navigate } = useNavigation();
    const showDatePicker = () => {
        setIsDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setIsDatePickerVisible(false);
    };

    const handleDatePicker = date => {
        setDate(date);
        hideDatePicker();
    };
    const WIDTH = Dimensions.get('window').width * 0.95;
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );


    useEffect(() => {
        getMasterDataProfile()
    }, [])

    const getMasterDataProfile = () => {
        setLoading(true);
        axiosInstance.get('profile/get')
            .then(res => {
                let data = res.data.data
                setName(data.name);
                setEmail(data.email);
                if (res.data.data.email_verified_at) {
                    set_email_verified(true)
                } else {
                    set_email_verified(false)
                }
                setNumberPhone(data.phone_number);
                setDate(data.date_of_birth);
                setValue(res.data.data.gender)
                setPicture(res.data.data.profile_picture)
            }).catch(error => {
                console.error('error getCategory: ', error.response.data.message);
            }).finally(() => {
                setLoading(false);
            })
    }


    const updateProfile = () => {

        if (!validate()) {
            toast.show('Lengkapi data terlebih dahulu', {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            return
        }

        let data = {
            name: name,
            date_of_birth: date,
            gender: value,
        }
        axiosInstance.post('profile/update', data)
            .then((res) => {
                setModalSuccesUpdate(true)
                getMasterDataProfile();
            }).catch((err) => {
                console.log('update profil', err.response.data.message);
            })
    }

    const validate = () => {
        let validation = true;
        if (name === '') {
            validation = false;
        }
        if (value === null) {
            validation = false;
        }
        if (date === '') {
            validation = false;
        }
        if (numberPhone === '') {

            validation = false;
        }

        return validation;
    };

    const onSaveProfile = () => {
        updateProfile()
        changePhoneNumber()
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

            Upload.post(`profile/change/profile-picture`, formData).
                then(response => {
                    toast.show('Update Profile picture successfully', {
                        placement: 'top',
                        type: 'success',
                        animationType: 'zoom-in',
                        duration: 3000,
                    });
                    setPhoto()
                    getMasterDataProfile()
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


    const changePhoneNumber = () => {
        if (!validate()) return

        let data = {
            phone_number: numberPhone,
        }
        axiosInstance.post('profile/change/phone-number', data)
            .then((res) => {
                setModalSuccesUpdate(true)
                getMasterDataProfile();
            }).catch((err) => {
                console.log('changePhoneNumber', err.response.data.message);
            })
    }
    return (
        <>
            {loading ?
                <View
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                    <ActivityIndicator
                        size="small"
                        color={colors.bgColor}

                    />
                </View>
                :
                <ScrollView style={{ backgroundColor: colors.white }}>
                    <View
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <View style={{ marginTop: 20 }}>
                            {!photo ?
                                <GetMedia
                                    folder="customer"
                                    filename={picture}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 50
                                    }}
                                />
                                :
                                <Image
                                    source={{
                                        uri: photo?.assets[0].uri,
                                    }}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 50
                                    }}
                                />
                            }

                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: 80,
                                    right: 15,
                                    backgroundColor: colors.white,
                                    borderRadius: 50
                                }}
                                onPress={handleChoosePhoto}
                            >
                                <Camera
                                    variant='Bold'
                                    size={20}
                                    color={colors?.bgColor}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        width: WIDTH,
                        marginHorizontal: 10,
                        marginVertical: 10,
                    }}>
                        <Text style={{ fontWeight: 'bold' }}>Kontak Informasi</Text>
                        <Text style={{ marginTop: 10 }}>Nama</Text>
                        <TextInput
                            style={[Styles.input, { borderColor: colors.line }]}
                            value={name}
                            onChangeText={text => setName(text)}
                            placeholder="Nama"
                        />
                        <Text style={{ marginTop: 10 }}>Tanggal Lahir</Text>
                        <TouchableOpacity
                            style={{
                                height: 48,
                                borderRadius: 10,
                                paddingHorizontal: 10,
                                marginTop: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                color: colors.line,
                                backgroundColor: '#FFFFFF',
                                borderColor: colors.line,
                                borderWidth: 1,
                            }}
                            onPress={showDatePicker}>
                            {date ? (
                                <Text style={{ fontWeight: '300' }}>
                                    {moment(date).format('DD MMMM YYYY')}
                                </Text>
                            ) : (
                                <Text style={{ color: '#000' }}></Text>
                            )}
                            <CalendarSearch size="28" color={colors.pasive} />
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleDatePicker}
                            onCancel={hideDatePicker}
                        />

                        <Text style={{ marginTop: 10, marginBottom: 5 }}>Jenis Kelamin</Text>
                        <DropDownPicker
                            zIndex={3000}
                            placeholder=""
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
                    <View style={{
                        width: WIDTH,
                        marginHorizontal: 10,
                        marginVertical: 10,
                    }}>
                        <Text style={{ fontWeight: 'bold' }}>Keamanan Akun</Text>
                        <View style={{ marginTop: 10, display: 'flex', flexDirection: "row", justifyContent: 'space-between' }}>
                            <View>
                                <Text>Email</Text>
                            </View>
                            {email_verified ?
                                <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Verify
                                        size="16"
                                        color="#6FC32E"
                                        variant="Bold"
                                    />
                                    <Text
                                        style={{
                                            color: "#6FC32E",
                                        }}
                                    >
                                        Diverifikasi
                                    </Text>
                                </View>
                                :
                                <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Verify
                                        size="16"
                                        color={colors?.grey}
                                        variant="Bold"
                                    />
                                    <Text
                                        style={{
                                            color: colors?.grey,
                                        }}
                                    >
                                        Belum di verifikasi
                                    </Text>
                                </View>
                            }
                        </View>
                        <TextInput
                            style={[Styles.input, { borderColor: colors.line }]}
                            value={email}
                            onChangeText={text => setEmail(text)}
                            placeholder="Email"
                            editable={!email_verified}
                        />
                        <Text style={{ marginTop: 10 }}>Nomor Telepon</Text>
                        <TextInput
                            style={[Styles.input, { borderColor: colors.line }]}
                            value={numberPhone}
                            onChangeText={text => setNumberPhone(text)}
                            placeholder="Nomor Telepon"
                        />
                        <Text style={{ marginTop: 10 }}>Password</Text>
                        <View style={{ marginTop: 10, flex: 1, flexDirection: 'row' }}>
                            <Text style={{ color: colors.pasive, marginRight: 10, fontStyle: 'italic' }}>Terakhir diubah 19 Juni 2022</Text>
                            <TouchableOpacity onPress={() => navigate(MainRouteName.CHANGE_PASSWORD)}>
                                <Text style={{ color: themeSetting?.accent_color?.value, fontWeight: 'bold' }}>Ubah Password</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={onSaveProfile}
                            style={[Styles.button, { marginVertical: 10, backgroundColor: themeSetting?.accent_color?.value }]}
                        >
                            <Text style={{ color: colors?.white }}>Simpan</Text>
                        </TouchableOpacity>
                    </View>
                    <CustomAlert
                        modalVisible={modalSuccesUpdate}
                        setModalVisible={setModalSuccesUpdate}
                        message={'Berhasil Update Data'}
                    />
                </ScrollView >
            }
        </>
    );
}



export default SettingProfile;


const Styles = StyleSheet.create({
    icon: {
        position: "relative",
        marginLeft: -30,
        alignSelf: "center",
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerTitle: {
        marginVertical: 10,
        marginHorizontal: 10,
        alignSelf: 'flex-start',
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10
    },
    inputPassword: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10
    },

    label: {
        marginHorizontal: 10,
        alignSelf: 'flex-start',
        fontSize: 14,
    },
    labelForgetPass: {
        marginHorizontal: 10,
        marginTop: 10,
        alignSelf: 'flex-end',
        fontSize: 14,
    },
    button: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }
});
