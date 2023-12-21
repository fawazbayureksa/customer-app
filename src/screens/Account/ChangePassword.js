import { Eye, EyeSlash } from 'iconsax-react-native';
import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import colors from '../../assets/theme/colors';
import CustomButton from '../../components/CustomButton';
import axiosInstance from '../../helpers/axiosInstance';
import CustomAlert from '../Forum/components/CustomAlert';

const WIDTH = Dimensions.get('window').width * 0.95;

const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [passwordNew, setPasswordNew] = useState('');
    const [passwordConfirmNew, setPasswordConfirmNew] = useState('');
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [eyeIcon, setEyeIcon] = useState(false);
    const [eyeIconNew, setEyeIconNew] = useState(false);
    const [eyeIconiConfirNew, setEyeIconConfirmNew] = useState(false);
    const [modalSuccesUpdate, setModalSuccesUpdate] = useState(false);
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const toast = useToast()

    const changePassword = () => {

        if ((password === '') || (passwordNew === '') || (passwordConfirmNew === '')) {
            toast.show('Lengkapi form terlebih dahulu', {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            return
        }

        setIsLoading(true)
        let data = {
            old_password: password,
            new_password: passwordNew,
        }
        axiosInstance.post('password/change', data)
            .then((res) => {
                console.log(res.data);
                setPassword('')
                setPasswordNew('')
                setPasswordConfirmNew('')
                setModalSuccesUpdate(true)
            }).catch((err) => {
                toast.show(err.response.data.message, {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            }).finally(() => setIsLoading(false));
    }


    return (
        <View style={[Styles.container, { backgroundColor: colors.white }]}>
            <Text style={{ marginHorizontal: 10, fontSize: 14, fontSize: 24, fontWeight: '700', marginTop: 10 }}>Akun Anda tidak aman?</Text>
            <Text style={{ marginHorizontal: 10, fontSize: 14, marginVertical: 20 }}>Jangan khawatir, silahkan buat kata sandi baru.</Text>
            <Text style={Styles.label}>Kata Sandi Sebelumnya</Text>
            <View style={{ display: 'flex', flexDirection: 'row', marginHorizontal: 10, }}>
                <TextInput
                    style={Styles.inputPassword}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry={!eyeIcon}
                // placeholder="password"
                />
                <TouchableOpacity style={Styles.icon} onPress={() => setEyeIcon(!eyeIcon)} >
                    {eyeIcon === false ?
                        <Eye
                            variant='Bold'
                            size="28"
                            color={colors?.pasive}
                        />
                        :
                        <EyeSlash
                            variant='Bold'
                            size="28"
                            color={colors?.pasive}
                        />
                    }
                </TouchableOpacity>
            </View>
            <Text style={Styles.label}>Kata Sandi Baru</Text>
            <View style={{ display: 'flex', flexDirection: 'row', marginHorizontal: 10, }}>
                <TextInput
                    style={Styles.inputPassword}
                    value={passwordNew}
                    onChangeText={text => setPasswordNew(text)}
                    secureTextEntry={!eyeIconNew}
                // placeholder="password"
                />
                <TouchableOpacity style={Styles.icon} onPress={() => setEyeIconNew(!eyeIconNew)} >
                    {eyeIconNew === false ?
                        <Eye
                            size="28"
                            variant='Bold'
                            color={colors?.pasive}
                        />
                        :
                        <EyeSlash
                            size="28"
                            color={colors?.pasive}
                            variant='Bold'
                        />
                    }
                </TouchableOpacity>
            </View>
            <Text style={Styles.label}>Konfirmasi Kata Sandi Baru</Text>
            <View style={{ display: 'flex', flexDirection: 'row', marginHorizontal: 10, }}>
                <TextInput
                    style={Styles.inputPassword}
                    value={passwordConfirmNew}
                    onChangeText={text => setPasswordConfirmNew(text)}
                    secureTextEntry={!eyeIconiConfirNew}
                // placeholder="password"
                />
                <TouchableOpacity style={Styles.icon} onPress={() => setEyeIconConfirmNew(!eyeIconiConfirNew)} >
                    {eyeIconiConfirNew === false ?
                        <Eye
                            size="28"
                            color={colors?.pasive}
                            variant='Bold'
                        />
                        :
                        <EyeSlash
                            size="28"
                            variant='Bold'
                            color={colors?.pasive}
                        />
                    }
                </TouchableOpacity>
            </View>
            <CustomButton
                loading={loading}
                onPress={changePassword}
                style={{
                    height: 44,
                    width: '95%',
                    alignSelf: 'center',
                    marginTop: 12,
                }}
                primary
                disabled={(passwordNew !== passwordConfirmNew) || loading}
                title="Simpan"
            />
            <CustomAlert
                modalVisible={modalSuccesUpdate}
                setModalVisible={setModalSuccesUpdate}
                message={'Berhasil Ubah Kata sandi'}
            />
        </View>
    );
}

const Styles = StyleSheet.create({
    icon: {
        position: "relative",
        marginLeft: -40,
        alignSelf: "center",
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    headerTitle: {
        marginVertical: 10,
        marginHorizontal: 10,
        alignSelf: 'flex-start',
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        width: WIDTH,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderColor: colors?.line,
        borderRadius: 10
    },
    inputPassword: {
        width: WIDTH,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderColor: colors?.line,
        borderRadius: 10
    },
    label: {
        fontWeight: '600',
        marginHorizontal: 10,
        alignSelf: 'flex-start',
        fontSize: 14,
    },

});


export default ChangePassword;
