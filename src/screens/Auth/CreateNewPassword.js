import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, TextInput, Button, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { login } from '../../redux/actions/auth';
import { MainRouteName } from '../../constants/mainRouteName';
import { MarketplaceRouteName } from '../../constants/marketplace_route/marketplaceRouteName';
import colors from '../../assets/theme/colors';
import { Eye, EyeSlash, Google, Facebook } from 'iconsax-react-native'

const WIDTH = Dimensions.get('window').width * 0.95;

const CreateNewPassword = ({ navigation }) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [eyeIcon, setEyeIcon] = useState(false);
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const onClickIcon = () => {
        setEyeIcon(!eyeIcon)
    }

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

    return (
        <ScrollView>
            <View style={Styles.container}>
                <Image
                    source={require('../../assets/images/login/vector1.png')}
                    style={{
                        width: WIDTH,
                    }}
                />
                <Text style={Styles.headerTitle}>Buat Password Baru</Text>

                <Text style={Styles.label}>Password</Text>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <TextInput
                        style={Styles.inputPassword}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={true}
                        placeholder="password"
                    />
                    <TouchableOpacity style={Styles.icon} onPress={() => onClickIcon()} >
                        {eyeIcon === false ?
                            <Eye
                                size="28"
                                color={colors?.pasive}
                            />
                            :
                            <EyeSlash
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
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={true}
                        placeholder="konfirmasi password"
                    />
                    <TouchableOpacity style={Styles.icon} onPress={() => onClickIcon()} >
                        {eyeIcon === false ?
                            <Eye
                                size="28"
                                color={colors?.pasive}
                            />
                            :
                            <EyeSlash
                                size="28"
                                color={colors?.pasive}
                            />
                        }
                    </TouchableOpacity>
                </View>
                <Text style={{ color: 'red' }}>{error}</Text>
                <TouchableOpacity
                    onPress={() => onLogin()}
                    disabled={loading}
                    style={[Styles.button, { backgroundColor: themeSetting?.accent_color?.value }]}
                >
                    <Text style={{ color: colors?.white }}>Kirim</Text>
                </TouchableOpacity>
                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
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
export default CreateNewPassword;
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
    labelForgetPass: {
        marginHorizontal: 10,
        marginTop: 10,
        alignSelf: 'flex-end',
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

