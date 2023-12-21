import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, TextInput, Button, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { login } from '../../redux/actions/auth';
import { MainRouteName } from '../../constants/mainRouteName';
import { MarketplaceRouteName } from '../../constants/marketplace_route/marketplaceRouteName';
import colors from '../../assets/theme/colors';
import { Eye, EyeSlash, Google, Facebook } from 'iconsax-react-native'
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import axiosInstance from '../../helpers/axiosInstance';

const WIDTH = Dimensions.get('window').width * 0.95;

const ForgetPassword = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [eyeIcon, setEyeIcon] = useState(false);

    const navigation = useNavigation();

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const onClickIcon = () => {
        setEyeIcon(!eyeIcon)
    }
    const toast = useToast()
    const dispatch = useDispatch();

    const sendEmail = () => {
        if (!validation()) {
            toast.show('Lengkapi data terlebih dahulu', {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
            return
        }
        setIsLoading(true)
        let data = {
            email: email,
        };
        axiosInstance.post(`auth/forgotPassword`, data).then(res => {
            console.log(res.data);
            toast.show(res.data.message, {
                placement: 'top',
                type: 'success',
                animationType: 'zoom-in',
                duration: 3000,
            });
            navigation.navigate(MainRouteName.EMAIL_SENT, { companyName: "Tokodapur", email: email, type: "forgotPassword" })
        }).catch((error) => {
            console.log(error.response.data)
            toast.show(error.response.data.message, {
                placement: 'top',
                type: 'danger',
                animationType: 'zoom-in',
                duration: 3000,
            });
        }).finally(() => setIsLoading(false));
    }

    const validation = () => {
        let validate = true;
        if (!email) {
            validate = false;
        }
        return validate

    }


    return (
        <ScrollView>
            <View style={Styles.container}>
                <Image
                    source={require('../../assets/images/login/vector2.png')}
                    style={{
                        width: WIDTH,
                    }}
                />
                <Text style={Styles.headerTitle}>Lupa Kata Sandi?</Text>
                <Text style={{ marginHorizontal: 10, textAlign: 'justify', marginVertical: 10 }}>
                    Jangan khawatir. Anda masih bisa membuat kata sandi baru. Silahkan masukkan email yang digunakan oleh akun Anda.
                </Text>
                <Text style={Styles.label}>Email</Text>
                <TextInput
                    style={Styles.input}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    placeholder="email"
                />
                <TouchableOpacity
                    onPress={sendEmail}
                    disabled={loading}
                    style={[Styles.button, { backgroundColor: themeSetting?.accent_color?.value, marginVertical: 20 }]}
                >
                    <Text style={{ color: colors?.white }}>Kirim</Text>
                </TouchableOpacity>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text>Baru di tokodapur?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.replace(MainRouteName.REGISTER)}
                    >
                        <Text style={{ color: themeSetting?.accent_color?.value, fontWeight: 'bold' }}> Daftar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};
export default ForgetPassword;
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
        marginHorizontal: 10,
        alignSelf: 'flex-start',
        fontSize: 14,
    },
    labelTnc: {
        marginHorizontal: 10,
        marginTop: 10,
        fontSize: 14,
    },
    button: {
        width: WIDTH,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }
});

