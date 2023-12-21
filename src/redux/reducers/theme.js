import {G} from 'react-native-svg';
import {
  GET_FOOTER,
  GET_HEADER,
  GET_LANGUAGE,
  SET_BOTTOM_NAVBAR,
  SET_THEME,
} from '../../constants/actionTypes';
import themeState from '../initialState/themeState';

export default theme = (state = themeState, action) => {
  const {type, payload} = action;
  switch (type) {
    case SET_THEME:
      return {
        ...state,
        themeSetting: payload,
      };
    case GET_HEADER:
      return {
        ...state,
        header: payload.header,
      };
    case GET_FOOTER:
      return {
        ...state,
        footer: payload.footer,
      };
    case GET_LANGUAGE:
      return {
        ...state,
        language: payload.language,
      };
    case SET_BOTTOM_NAVBAR:
      return {
        ...state,
        selectedBottomNavbar: payload,
      };
    default:
      return state;
  }
};
