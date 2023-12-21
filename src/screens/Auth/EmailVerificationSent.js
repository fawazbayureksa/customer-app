import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Image } from 'react-native';
import { Text } from 'react-native';
import { View, StyleSheet } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { MainRouteName } from '../../constants/mainRouteName';

const EmailVerificationSent = ({ route }) => {
    const WIDTH = Dimensions.get('window').width * 0.95;
    const { navigate } = useNavigation()
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 10 }}>
            <Image
                source={require('../../assets/images/email_sent.png')}
                style={{
                    width: WIDTH,
                    height: WIDTH / 2,
                    resizeMode: "contain"
                }}
            />
            {route.params.type && route.params.type === "forgotPassword" ?
                <>
                    <Text style={{ fontWeight: "600", fontSize: 18, textAlign: "center" }}>Email telah dikirimkan ke {route.params.email}</Text>
                    <Text style={{ marginVertical: 10, textAlign: "center" }}>Demi keamanan, jangan berikan link verifikasi ke siapapun termasuk pihak {route.params.companyName}</Text>
                </>
                :
                <>
                    <Text style={{ fontWeight: "600", fontSize: 18, textAlign: "center" }}>Email telah dikirimkan ke {route.params.email}</Text>
                    <Text style={{ marginVertical: 10, textAlign: "center" }}>Demi keamanan, jangan berikan kode verifikasi ke siapapun termasuk pihak {route.params.companyName}</Text>
                </>
            }
            <CustomButton
                primary
                title="Kembali Ke halaman Utama"
                style={{ width: WIDTH, marginTop: 10 }}
                onPress={() => navigate(MainRouteName.HOME)}
            />
        </View>
    );
}

const styles = StyleSheet.create({})

export default EmailVerificationSent;
