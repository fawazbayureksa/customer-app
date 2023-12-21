import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../helpers/axiosInstance';

const setTemplateMasterData = async () => {
  return axiosInstance
    .get('template/getTemplateMasterData')
    .then(res => {
      let themeSettings = getThemeSettings(res.data.data.theme_settings);
      return {
        status: 'success',
        message: 'success get template master data',
        themeSettings,
      };
    })
    .catch(err => {
      console.log('ERR getTemplateMasterData', err.response.data);
      return {
        status: 'failed',
        message: err.response.data
          ? err.response.data
          : 'Something went wrong, try agin',
      };
    });
};

const getLanguage = async () => {
  return axiosInstance
    .get('template/getPrimaryLanguage')
    .then(res => {
      let language = res.data.data.language_code;
      AsyncStorage.setItem('user-language', res.data.data.language_code);
      return {
        status: 'success',
        message: 'success get template master data',
        language,
      };
    })
    .catch(err => {
      console.log('ERR getPrimaryLanguage', err.response.data);
      return {
        status: 'failed',
        message: err.response.data
          ? err.response.data
          : 'Something went wrong, try agin',
      };
    });
};

const getHeader = async () => {
  let url = `template/getHeader`;
  let params = {
    language_code: 'id',
  };
  return axiosInstance
    .get(url, {params})
    .then(res => {
      let data = res.data.data;
      let components = [];
      let columns = [];
      let rows = [];
      let sections = [];
      if (data && data.sections) {
        res.data.data.sections.forEach(section => {
          if (JSON.parse(section?.style).visibility_mobile == true) {
            sections.push(section);
            section.rows.forEach(row => {
              rows.push(row);
              row.columns.forEach(column => {
                columns.push(column);
                column.components.forEach(component => {
                  component.value = JSON.parse(component.value);
                  components.push(component);
                  if (component.style) {
                    component.style = JSON.parse(component.style) || {};
                  }
                });
                column.style = JSON.parse(column.style) || {};
              });
              row.style = JSON.parse(row.style) || {};
            });
          }
          section.style = JSON.parse(section.style) || {};
        });
      }
      // console.log('component', components);
      // console.log('columns', columns);
      // console.log('rows', JSON.stringify(rows));
      // console.log('sections', JSON.stringify(sections));
      return {
        status: 'success',
        message: 'success get header master data',
        header: sections,
      };
    })
    .catch(err => {
      console.log('ERR getHeader', err);
      return {
        status: 'failed',
        message: err.response.data
          ? err.response.data
          : 'Something went wrong, try agin',
      };
    });
};

const getFooter = async () => {
  let url = `template/getFooter`;
  let params = {
    language_code: 'id',
  };
  return axiosInstance
    .get(url, {params})
    .then(res => {
      let data = res.data.data;
      let components = [];
      let columns = [];
      let rows = [];
      let sections = [];
      if (data && data.sections) {
        res.data.data.sections.forEach(section => {
          if (JSON.parse(section?.style).visibility_mobile == true) {
            sections.push(section);
            section.rows.forEach(row => {
              rows.push(row);
              row.columns.forEach(column => {
                columns.push(column);
                column.components.forEach(component => {
                  component.value = JSON.parse(component.value);
                  components.push(component);
                  if (component.style) {
                    component.style = JSON.parse(component.style) || {};
                  }
                });
                column.style = JSON.parse(column.style) || {};
              });
              row.style = JSON.parse(row.style) || {};
            });
          }
          section.style = JSON.parse(section.style) || {};
        });
      }
      // console.log('component', components);
      // console.log('columns', columns);
      // console.log('rows', JSON.stringify(rows));
      return {
        status: 'success',
        message: 'success get footer master data',
        footer: sections,
      };
    })
    .catch(err => {
      console.log('ERR getFooter', err);
      return {
        status: 'failed',
        message: err.response.data
          ? err.response.data
          : 'Something went wrong, try agin',
      };
    });
};

export default {
  setTemplateMasterData,
  getHeader,
  getFooter,
  getLanguage,
};

const getThemeSettings = theme_settings_from_database => {
  let data = {};
  for (let i = 0; i < theme_settings_from_database.length; i++) {
    let theme_setting = theme_settings_from_database[i];
    data[theme_setting.key] = JSON.parse(theme_setting.value);
  }
  return data;
};
