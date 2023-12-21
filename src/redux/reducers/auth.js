import {
  CLEAR_AUTH_STATE,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  SET_USER,
} from '../../constants/actionTypes/index';
import authState from '../initialState/authState';

export default auth = (state = authState, action) => {
  const {type, payload} = action;
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        error: payload.message,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case SET_USER:
      return {
        ...state,
        isLoggedIn: payload.isLoggedIn,
        user: payload.user,
      };
    case CLEAR_AUTH_STATE:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};
