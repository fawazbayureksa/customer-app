import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, TextInput, Button, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { login } from '../../redux/actions/auth';
import { MainRouteName } from '../../constants/mainRouteName';
import { MarketplaceRouteName } from '../../constants/marketplace_route/marketplaceRouteName';
import colors from '../../assets/theme/colors';
import { Eye, EyeSlash, Google, Facebook, CalendarSearch } from 'iconsax-react-native'
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axiosInstance from '../../helpers/axiosInstance';
import { useToast } from 'react-native-toast-notifications';

const WIDTH = Dimensions.get('window').width * 0.95;

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [eyeIcon, setEyeIcon] = useState(false);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [company_name, set_company_name] = useState();
    const [tnc, setTnc] = useState();
    const navigation = useNavigation();
    const [eyeIconConfirm, setEyeIconConfirm] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const toast = useToast()

    useEffect(() => {
        getMasterDataRegister()
    }, [])

    const onClickIcon = () => {
        setEyeIcon(!eyeIcon)
    }
    const showDatePicker = () => {
        setIsDatePickerVisible(!isDatePickerVisible);
    };

    const dispatch = useDispatch();

    const onLogin = () => {
        setIsLoading(true);
        let user = {
            username,
            password,
        };
        dispatch(login(user))
            .then(response => {
                if (response.data.success) {
                    navigation.replace(MainRouteName.HOME_NAVIGATOR);
                }
            })
            .catch(error => {
                console.log('error onLogin', error);
                // navigation.replace(MainRouteName.LOGIN);
            })
            .finally(() => setIsLoading(false));
    };

    const hideDatePicker = () => {
        setIsDatePickerVisible(!isDatePickerVisible);
    };
    const handleDatePicker = date => {
        setDateOfBirth(date);
    };

    const { navigate } = useNavigation()

    const validation = () => {
        let validate = true;

        if (!username) {
            validate = false;
        } else if (!password) {
            validate = false;
        } else if (!email) {
            validate = false;
        }

        return validate

    }

    const getMasterDataRegister = () => {
        axiosInstance.get(`auth/getMasterDataRegister`).then(res => {
            set_company_name(res.data.data.company_name)
            setTnc(res.data.data.terms_and_conditions)
        }).catch((error) => {
            console.log(error.response.data)
        })
    }

    const handlePasswordChange = (e) => {
        setConfirmPassword(e)
        if (password !== e) {
            setErrorPassword(true)
        } else {
            setErrorPassword(false)
        }
    }

    const onSubmit = () => {
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
            name: username,
            email: email,
            date_of_birth: dateOfBirth,
            phone_number: '+62' + phoneNumber,
            password: password
        };
        // console.log(data);
        // return
        axiosInstance.post(`auth/register`, data).then(res => {
            console.log(res.data);
            navigate(MainRouteName.EMAIL_SENT, { companyName: company_name, email: email });
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

    return (
        <ScrollView style={{ backgroundColor: colors.white }}>
            <View style={Styles.container}>
                <Image
                    source={require('../../assets/images/login/vector3.png')}
                    style={{
                        width: WIDTH,
                    }}
                />
                <Text style={Styles.headerTitle}>Register</Text>
                <Text style={Styles.label}>Nama</Text>
                <TextInput
                    style={Styles.input}
                    value={username}
                    onChangeText={text => setUsername(text)}
                    placeholder="nama"
                />
                <Text style={Styles.label}>Tanggal lahir</Text>
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
                        width: WIDTH,
                        marginBottom: 24
                    }}
                    onPress={() => showDatePicker()}>
                    {dateOfBirth ? (
                        <Text style={{ fontWeight: '400' }}>
                            {moment(dateOfBirth).format('DD MMMM YYYY')}
                        </Text>
                    ) : (
                        <Text style={{ color: colors.pasive }}>tanggal lahir</Text>
                    )}
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDatePicker}
                    onCancel={hideDatePicker}
                />

                <Text style={Styles.label}>Nomor Telepon</Text>
                <View style={{ marginBottom: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ color: "#000", fontSize: 16, marginRight: 10 }}>+62</Text>
                    <TextInput
                        style={Styles.inputNumberPhone}
                        value={phoneNumber}
                        onChangeText={text => setPhoneNumber(text)}
                        placeholder="no telepon"
                    />
                </View>
                <Text style={Styles.label}>Email</Text>
                <TextInput
                    style={Styles.input}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    placeholder="email"
                />
                <Text style={Styles.label}>Password</Text>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <TextInput
                        style={Styles.inputPassword}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={!eyeIcon}
                        placeholder="password"
                    />
                    <TouchableOpacity style={Styles.icon} onPress={() => onClickIcon()} >
                        {eyeIcon === false ?
                            <Eye
                                size="28"
                                color={colors?.pasive}
                                variant="Bold"
                            />
                            :
                            <EyeSlash
                                variant="Bold"
                                size="28"
                                color={colors?.pasive}
                            />
                        }
                    </TouchableOpacity>
                </View>
                <Text style={Styles.label}>Konfirmasi Kata Sandi</Text>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <TextInput
                        style={Styles.inputPassword}
                        value={confirmPassword}
                        onChangeText={text => handlePasswordChange(text)}
                        secureTextEntry={!eyeIconConfirm}
                        placeholder="konfirmasi password"
                    />
                    <TouchableOpacity style={Styles.icon} onPress={() => setEyeIconConfirm(!eyeIconConfirm)} >
                        {eyeIconConfirm === false ?
                            <Eye
                                size="28"
                                color={colors?.pasive}
                                variant="Bold"
                            />
                            :
                            <EyeSlash
                                variant="Bold"
                                size="28"
                                color={colors?.pasive}
                            />
                        }
                    </TouchableOpacity>
                </View>
                {errorPassword &&
                    <View style={{ backgroundColor: 'rgba(255, 0, 0, 0.63)', width: WIDTH, marginHorizontal: 5, padding: 5, borderRadius: 10 }}>
                        <Text style={{ textAlign: "left", color: colors?.white, fontWeight: "600" }}>Password tidak sama</Text>
                    </View>
                }
                <Text style={{ marginTop: 24 }}>
                    Dengan klik daftar, maka anda telah menyetujui
                </Text>
                <TouchableOpacity style={[Styles.labelTnc]} onPress={() => navigate(MainRouteName.EMAIL_SENT, { companyName: company_name, email: email })} >
                    <Text style={[{ color: themeSetting?.accent_color?.value, fontWeight: '600' }]}>
                        Syarat dan Ketentuan
                    </Text>
                </TouchableOpacity>
                <Text style={{ color: 'red' }}>{error}</Text>
                <CustomButton
                    primary
                    onPress={onSubmit}
                    disabled={(password !== confirmPassword) || loading}
                    loading={loading}
                    style={{ marginVertical: 20, width: WIDTH }}
                    title="Daftar"
                >
                    <Text style={{ color: colors?.white }}>Daftar</Text>
                </CustomButton>
                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 10 }}>
                    <Text>Sudah punya akun?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.replace(MainRouteName.LOGIN)}
                    >
                        <Text style={{ color: themeSetting?.accent_color?.value, fontWeight: 'bold' }}> Masuk</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView >
    );
};
export default Register;
const Styles = StyleSheet.create({
    icon: {
        position: "relative",
        marginLeft: -30,
        marginTop: 0,
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
        marginBottom: 24,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderColor: colors?.line,
        borderRadius: 10
    },
    inputNumberPhone: {
        width: WIDTH * 0.90,
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
        marginBottom: 5,
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
        fontWeight: "600"
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

