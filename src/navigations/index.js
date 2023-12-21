import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../redux/actions/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, View, Text} from 'react-native';
import {
  getFooter,
  getHeader,
  getLanguage,
  setTheme,
} from '../redux/actions/theme';
import MainStack from './MainStack';
import {useTranslation} from 'react-i18next';
import {pushNotification} from '../helpers/PushNotification';
// import codePush from 'react-native-code-push';

const NavigationProvider = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.authReducer);
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
  const {t} = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   syncImmediate();
  // }, []);

  useEffect(() => {
    pushNotification();
  }, []);

  useEffect(() => {
    getUser();
  }, [isLoggedIn]);

  useEffect(() => {
    getTemplateMasterData();
    // onGetHeader();
    onGetFooter();
    onGetLanguage();
  }, []);

  function syncImmediate() {
    codePush.sync({
      installMode: codePush.InstallMode.IMMEDIATE,
      updateDialog: true,
      mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
    });
  }

  const getTemplateMasterData = () => {
    setIsLoading(true);
    dispatch(setTheme())
      .then(response => {
        if (response.status === 'success') {
        }
      })
      .catch(err => console.log('err getTemplateMasterData', err))
      .finally(() => setIsLoading(false));
  };

  const onGetLanguage = () => {
    setIsLoading(true);
    dispatch(getLanguage())
      .then(response => {
        if (response.status === 'success') {
        }
      })
      .catch(err => console.log('err onGetHeader', err))
      .finally(() => setIsLoading(false));
  };

  const onGetHeader = () => {
    setIsLoading(true);
    dispatch(getHeader())
      .then(response => {
        if (response.status === 'success') {
        }
      })
      .catch(err => console.log('err onGetHeader', err))
      .finally(() => setIsLoading(false));
  };

  const onGetFooter = () => {
    setIsLoading(true);
    dispatch(getFooter())
      .then(response => {
        if (response.status === 'success') {
        }
      })
      .catch(err => console.log('err onGetFooter', err))
      .finally(() => setIsLoading(false));
  };

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        let authState = {isLoggedIn: true, user: user};
        dispatch(setUser(authState));
      } else {
        let authState = {isLoggedIn: false, user: null};
        dispatch(setUser(authState));
      }
    } catch (error) {}
  };

  return (
    <>
      {!isLoading ? (
        <MainStack isLoggedIn={isLoggedIn} />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </>
  );
};
export default NavigationProvider;
