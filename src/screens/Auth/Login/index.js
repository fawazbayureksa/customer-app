import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { login } from '../../../redux/actions/auth';
import { MainRouteName } from '../../../constants/mainRouteName';
import colors from '../../../assets/theme/colors';
import { Eye, EyeSlash, Google, Facebook } from 'iconsax-react-native';
import CustomButton from '../../../components/CustomButton';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../../helpers/axiosInstance';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';

const WIDTH = Dimensions.get('window').width * 0.95;

const Login = ({ navigation }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [eyeIcon, setEyeIcon] = useState(false);
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );
  const onClickIcon = () => {
    setEyeIcon(!eyeIcon);
  };

  const dispatch = useDispatch();

  const onLogin = () => {
    if (!username || !password) {
      toast.show('Username and password require', {
        placement: 'top',
        type: 'danger',
        animationType: 'zoom-in',
        duration: 3000,
      });
    } else {
      let user = {
        email: username,
        password,
      };
      handleLogin(user, 'auth/login');
    }
  };

  const handleLogin = (data, url) => {
    setIsLoading(true);
    dispatch(login(data, url))
      .then(response => {
        if (response?.data?.success) {
          onPostFirebaseToken();
          navigation.replace(MainRouteName.HOME);
          toast.show(response.data.message, {
            placement: 'top',
            type: 'success',
            animationType: 'zoom-in',
            duration: 3000,
          });
        }
      })
      .catch(error => {
        console.log('error onLogin', error.response.data.message);
        toast.show(
          error.response.data.message
            ? error.response.data.message
            : 'Something went wrong, try agin',
          {
            type: 'danger',
            placement: 'top',
            duration: 3000,
          },
        );

        // navigation.replace(MainRouteName.LOGIN);
      })
      .finally(() => setIsLoading(false));
  };

  const toast = useToast();

  const onPostFirebaseToken = async () => {
    try {
      const tokenFirebase = await AsyncStorage.getItem('tokenFirebase');
      if (tokenFirebase) {
        let data = {
          token: tokenFirebase,
          device: 'app',
        };
        axiosInstance
          .post(`notification/requestFCMToken`, data)
          .then(res => { })
          .catch(err => {
            console.log('error postFirebaseToken', err?.response.data);
          });
      } else {
        console.log('error onPostFirebaseToken');
      }
    } catch (error) { }
  };

  const onGoogleLogin = async () => {
    GoogleSignin.configure({
      webClientId:
        '828046531336-53q6b3be40t2gpvdb28l7nt2a579eq38.apps.googleusercontent.com',
      offlineAccess: true,
    });
    GoogleSignin.hasPlayServices()
      .then(hasPlayService => {
        if (hasPlayService) {
          GoogleSignin.signIn()
            .then(userInfo => {
              // console.log(JSON.stringify(userInfo));
              handleLogin({ id_token: userInfo.idToken }, 'google-login');
            })
            .catch(e => {
              console.log('ERROR IS: ' + JSON.stringify(e));
            });
        }
      })
      .catch(e => {
        console.log('ERROR IS: ' + JSON.stringify(e));
      });
  };

  const loginWithFacebook = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile']).then(
      login => {
        if (login.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            console.log(data);
            handleLogin({ id_token: accessToken }, 'facebook-login');
          });
        }
      },
      error => {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  return (
    <ScrollView>
      <View style={Styles.container}>
        <Image
          source={require('../../../assets/images/login/vector4.png')}
          style={{
            width: WIDTH,
          }}
        />
        <Text style={Styles.headerTitle}>Please Login to your account</Text>
        <Text style={Styles.label}>Email</Text>
        <TextInput
          style={Styles.input}
          value={username}
          onChangeText={text => setUsername(text)}
          placeholder="username"
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
          <TouchableOpacity style={Styles.icon} onPress={() => onClickIcon()}>
            {eyeIcon === false ? (
              <Eye size="28" color={colors?.pasive} variant="Bold" />
            ) : (
              <EyeSlash variant="Bold" size="28" color={colors?.pasive} />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[Styles.labelForgetPass]}
          onPress={() => navigation.navigate(MainRouteName.FORGET_PASSWORD)}>
          <Text
            style={[
              { color: themeSetting?.accent_color?.value, fontWeight: '600' },
            ]}>
            Lupa Password
          </Text>
        </TouchableOpacity>
        <Text style={{ color: 'red' }}>{error}</Text>
        <CustomButton
          loading={loading}
          onPress={onLogin}
          style={{
            height: 44,
            width: '95%',
            alignSelf: 'center',
            marginTop: 12,
          }}
          primary
          disabled={loading}
          title="Login"
        />
        <Text style={{ color: colors?.pasive, marginVertical: 24 }}>or</Text>
        <TouchableOpacity
          onPress={onGoogleLogin}
          style={[
            Styles.button,
            { display: 'flex', flexDirection: 'row', backgroundColor: '#EA4335' },
          ]}>
          <Google size="22" color="#FFF" variant="Bold" />
          <Text style={{ color: colors?.white, fontWeight: '600' }}>
            {' '}
            Masuk dengan Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={loginWithFacebook}
          style={[
            Styles.button,
            {
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: '#4267B2',
              marginTop: 24,
            },
          ]}>
          <Facebook size="22" color="#FFF" variant="Bold" />
          <Text style={{ color: colors?.white, fontWeight: '600' }}>
            {' '}
            Masuk dengan Facebook
          </Text>
        </TouchableOpacity>
        <View
          style={{ display: 'flex', flexDirection: 'row', marginVertical: 20 }}>
          <Text>Baru di tokodapur?</Text>
          <TouchableOpacity
            onPress={() => navigation.replace(MainRouteName.REGISTER)}>
            {/* onPress={loginWithFacebook}> */}
            <Text
              style={{
                color: themeSetting?.accent_color?.value,
                fontWeight: 'bold',
              }}>
              {' '}
              Daftar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
export default Login;
const Styles = StyleSheet.create({
  icon: {
    position: 'relative',
    marginLeft: -30,
    marginTop: -10,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerTitle: {
    marginVertical: 20,
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
    marginTop: 5,
    marginBottom: 30,
    borderColor: colors?.line,
    borderRadius: 10,
  },
  inputPassword: {
    marginBottom: 20,
    width: WIDTH,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderColor: colors?.line,
    borderRadius: 10,
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
  },
});
