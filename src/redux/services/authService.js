import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../helpers/axiosInstance';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const logIn = async user => {
  const {username, password} = user;
  axiosInstance
    .post('auth/login', {
      password,
      email: username,
    })
    .then(res => {
      AsyncStorage.setItem('token', res.data.data.access_token);
      AsyncStorage.setItem('user', JSON.stringify(res.data.data.user));
    })
    .catch(err => {
      console.log('errorLogin', err.response.data);
    });
  return {
    status: 'success',
    message: 'You are redirecting to home page',
    user: JSON.stringify({name: 'tes'}),
  };
};

const logOut = async () => {
  try {
    const tokenFirebase = await AsyncStorage.getItem('tokenFirebase');
    if (tokenFirebase) {
      let data = {
        token: tokenFirebase,
        device: 'app',
      };
      console.log(data);
      axiosInstance
        .post(`notification/setInactiveFCMToken`, data)
        .then(res => {
          console.log(res.data);
          AsyncStorage.removeItem('token');
          AsyncStorage.removeItem('user');
          AsyncStorage.removeItem('seller');
          AsyncStorage.removeItem('isAccount');
          signoutGoogle();
        })
        .catch(err => {
          console.log(err?.response.data);
        });
    } else {
      console.log('error onRemoveFirebaseToken');
    }
  } catch (error) {}
  return {
    status: 'success',
    message: 'You are logged out',
  };
};

const signoutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error(error);
  }
};

export default {
  logIn,
  logOut,
};
