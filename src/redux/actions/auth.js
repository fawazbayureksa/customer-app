import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  SET_USER,
} from '../../constants/actionTypes/index';
import axiosInstance from '../../helpers/axiosInstance';
import AuthService from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = (data, url) => dispatch => {
  console.log(data, url);
  return axiosInstance
    .post(url, data)
    .then(res => {
      AsyncStorage.setItem('token', res.data.data.access_token);
      AsyncStorage.setItem('user', JSON.stringify(res.data.data.user));
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {user: JSON.stringify(res.data.data.user)},
      });
      Promise.resolve();
      return Promise.resolve(res);
    })
    .catch(err => {
      console.log('errorLogin', err.response.data);

      Promise.reject();
      return Promise.reject(err);
    });
  // return AuthService.logIn(user).then(
  //   response => {
  //     if (response.status === 'success') {
  //       dispatch({
  //         type: LOGIN_SUCCESS,
  //         payload: {user: response.user},
  //       });
  //       Promise.resolve();
  //       return response;
  //     } else {
  //       dispatch({
  //         type: LOGIN_FAIL,
  //         payload: response.message,
  //       });
  //       Promise.resolve();
  //       return response;
  //     }
  //   },
  //   error => {
  //     const message = error.toString();
  //     Promise.reject();
  //     return message;
  //   },
  // );
};

export const logout = () => dispatch => {
  return AuthService.logOut().then(response => {
    if (response.status === 'success') {
      dispatch({
        type: LOGOUT,
      });
      Promise.resolve();
      return response;
    }
  });
};

export const setUser = user => dispatch => {
  dispatch({
    type: SET_USER,
    payload: {isLoggedIn: user.user != null ? true : false, user: user.user},
  });
  return user.user;
};
