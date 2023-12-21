import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Template from '../../components/Template';
import {MarketplaceRouteName} from '../../constants/marketplace_route/marketplaceRouteName';
import axiosInstance from '../../helpers/axiosInstance';
import {logout} from '../../redux/actions/auth';
import Body from '../../components/Template/Body/index';
import {MainRouteName} from '../../constants/mainRouteName';
import {useTranslation} from 'react-i18next';

const CustomPage = ({navigation, route}) => {
  const state = useSelector(state => state);
  const themeSetting = useSelector(state => state.themeReducer);
  const {t} = useTranslation();
  const {url} = route.params;

  const [body, setBody] = useState([]);

  const dispatch = useDispatch();

  const {navigate} = useNavigation();

  useEffect(() => {
    getBody();
  }, []);

  const onLogout = () => {
    dispatch(logout()).then(response => {
      if (response.status === 'success') {
        navigation.replace('LoginScreen');
      }
    });
  };

  const getBody = () => {
    let data = {
      url: url,
      type: 'app',
    };
    axiosInstance
      .get(`cms/getBody`, {params: data})
      .then(res => {
        let data = res.data.data;
        let sections = [];
        if (data && data.sections) {
          res.data.data.sections.forEach(section => {
            if (JSON.parse(section?.style).visibility_mobile == true) {
              sections.push(section);
              section.rows.forEach(row => {
                // rows.push(row);
                row.columns.forEach(column => {
                  // columns.push(column);
                  column.components.forEach(component => {
                    component.value = JSON.parse(component.value);
                    // components.push(component);
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
        setBody(sections);
      })
      .catch(err => {
        console.log('ERR getbody', err.response.data);
      });
  };

  return (
    <Template
      url={url}
      scroll={true}
      theme={themeSetting}
      refresh={true}
      refreshData={getBody}>
      <Body data={body} />
      {/* <Text>{JSON.stringify(body, null, 2)}</Text> */}
    </Template>
  );
};

export default CustomPage;
