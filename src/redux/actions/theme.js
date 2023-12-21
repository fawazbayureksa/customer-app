import {GET_FOOTER, GET_HEADER, SET_THEME} from '../../constants/actionTypes';
import themeService from '../services/themeService';

export const setTheme = () => dispatch => {
  return themeService.setTemplateMasterData().then(
    response => {
      if (response.status === 'success') {
        dispatch({
          type: SET_THEME,
          payload: {theme: response.themeSettings},
        });
        Promise.resolve();
        return response;
      }
    },
    error => {
      const message = error.toString();
      Promise.reject();
      return message;
    },
  );
};

export const getHeader = () => dispatch => {
  return themeService.getHeader().then(
    response => {
      if (response.status === 'success') {
        dispatch({
          type: GET_HEADER,
          payload: {header: response.header},
        });
        Promise.resolve();
        return response;
      }
    },
    error => {
      const message = error.toString();
      Promise.reject();
      return message;
    },
  );
};

export const getFooter = () => dispatch => {
  return themeService.getFooter().then(
    response => {
      if (response.status === 'success') {
        dispatch({
          type: GET_FOOTER,
          payload: {footer: response.footer},
        });
        Promise.resolve();
        return response;
      }
    },
    error => {
      const message = error.toString();
      Promise.reject();
      return message;
    },
  );
};

export const getLanguage = () => dispatch => {
  return themeService.getLanguage().then(
    response => {
      if (response.status === 'success') {
        dispatch({
          type: GET_FOOTER,
          payload: {language: response.language},
        });
        Promise.resolve();
        return response;
      }
    },
    error => {
      const message = error.toString();
      Promise.reject();
      return message;
    },
  );
};