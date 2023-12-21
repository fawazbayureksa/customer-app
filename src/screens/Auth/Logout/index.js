import React, {useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {useDispatch} from 'react-redux';
import {CLEAR_AUTH_STATE} from '../../../constants/actionTypes';
import {MainRouteName} from '../../../constants/mainRouteName';
import {logout} from '../../../redux/actions/auth';

const Logout = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout()).then(response => {
      if (response.status === 'success') {
        // navigation.replace(MainRouteName.LOGIN);
      }
      dispatch({
        type: CLEAR_AUTH_STATE,
      });
    });
  }, []);

  return <ActivityIndicator />;
};

export default Logout;
