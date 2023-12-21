import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  BackHandler,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Template from '../../components/Template';
import axiosInstance from '../../helpers/axiosInstance';
import { logout } from '../../redux/actions/auth';
import Body from '../../components/Template/Body/index';
import { MainRouteName } from '../../constants/mainRouteName';
import { useTranslation } from 'react-i18next';
import { ForumRouteName } from '../../constants/forum_route/forumRouteName';
import { WebinarRouteName } from '../../constants/webinar_route/webinarRouteName';
import { AuctionRouteName } from '../../constants/auction_route/auctionRouteName';
import { ChatRouteName } from '../../constants/chat_route/ChatRouteName';
import { VolumeLow1 } from 'iconsax-react-native';

const WIDTH = Dimensions.get('window').width;

const Home = ({ navigation }) => {
  const state = useSelector(state => state);
  const themeSetting = useSelector(state => state.themeReducer);
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
  const [springValue, setSpringValue] = useState(new Animated.Value(100));
  const [backClickCount, setBackClickCount] = useState(0);

  const { t } = useTranslation();

  const [body, setBody] = useState([]);

  const dispatch = useDispatch();

  const { navigate } = useNavigation();

  useEffect(() => {
    getBody();
    getVersion();
  }, []);

  useEffect(() => {
    dispatch({
      type: 'SET_BOTTOM_NAVBAR',
      payload: 0,
    });
    const willFocusSubscription = navigation.addListener('focus', () => {
      dispatch({
        type: 'SET_BOTTOM_NAVBAR',
        payload: 0,
      });
    });

    return willFocusSubscription;
  }, []);

  const onLogout = () => {
    dispatch(logout()).then(response => {
      if (response.status === 'success') {
        navigation.replace(MainRouteName.LOGIN);
      }
    });
  };

  const getBody = () => {
    axiosInstance
      .get('cms/getBody?url=%2f&type=app')
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
        return {
          success: true,
        };
      })
      .catch(err => {
        console.log('ERR getbody', err.response.data);
        return {
          success: true,
        };
      });
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
  }, [backClickCount]);

  const spring = () => {
    setBackClickCount(1);

    Animated.sequence([
      Animated.spring(springValue, {
        toValue: -0.15 * 400,
        friction: 5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(springValue, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setBackClickCount(0);
    });
  };

  const getVersion = () => {
    let params = {
      current_version: 'v1.0.0'
    }
    axiosInstance.get('version/check', { params })
      .then(res => {
        if (res.data.data.need_update) {
          Alert.alert('Update Required')
          BackHandler.exitApp()
        }
      })
      .catch(err => {
        console.log('error get version', err.response.data);
      })
  }

  const handleBackButton = () => {
    backClickCount == 1 ? BackHandler.exitApp() : spring();

    return true;
  };

  return (
    <>
      <Template scroll={true} theme={themeSetting} refresh={true} url="/">
        {/* <View style={Styles.container}>
          <Text style={{fontSize: 16}}>
            Welcome {JSON.parse(state?.authReducer?.user)?.name}
          </Text>
          <Button
            onPress={() => console.log(JSON.stringify(themeSetting.footer))}
            title="Console state"
          />
          <Text style={{fontSize: 16}}>
            {t('welcome')} {state?.authReducer?.user}
          </Text>
          <Button
            onPress={() => console.log(JSON.stringify(themeSetting))}
            title="Console state"
          />
          <Button
            onPress={() =>
              isLoggedIn ? onLogout() : navigation.navigate(MainRouteName.LOGIN)
            }
            title={isLoggedIn ? 'Logout' : 'Login'}
          />
          <Button
            onPress={() => navigate(MainRouteName.SELECT_LANGUAGE)}
            title={t('common:languageSelector')}
          />
          <View style={{flexDirection: 'row', marginVertical: 5}}>
            <Button
              onPress={() =>
                navigate(MainRouteName.ON_TESTING, {url: 'zavira'})
              }
              title="Zavira"
            />
            <Button
              onPress={() =>
                navigate(MainRouteName.ON_TESTING, {url: 'nabila'})
              }
              title="Nabila"
            />
            <Button
              onPress={() =>
                navigate(MainRouteName.ON_TESTING, {
                  url: 'new_product_carousel',
                })
              }
              title="Carousel"
            />
          </View>
          <View style={{flexDirection: 'row', marginVertical: 5}}>
            <Button
              // onPress={() => navigate(WebinarRouteName.WEBINAR)}
              onPress={() => navigate(WebinarRouteName.WEBINAR_DASHBOARD)}
              title={t('Webinar')}
            />
          </View>

          <Button
            onPress={() => navigate(AuctionRouteName.HOME_AUCTION)}
            title={t('Auction')}
          />

          <View style={{flexDirection: 'row', marginVertical: 5}}>
            <Button onPress={() => navigate(ChatRouteName.CHAT)} title="Chat" />
          </View>
          <View style={{flexDirection: 'row', marginVertical: 5}}>
            <Button
              onPress={() => navigate(MainRouteName.ACCOUNT)}
              title="Account"
            />
          </View>
          <View style={{ flexDirection: 'row', marginVertical: 5 }}>
            <Button
              onPress={() => navigate(ForumRouteName.FORUMLIST)}
              title="Forum"
            />
          </View>
        </View> */}

        <Body data={body} />
        {/* <Text>{JSON.stringify(body, null, 2)}</Text> */}
      </Template>
      <View style={Styles.container2}>
        <Animated.View
          style={[
            Styles.animatedView,
            { transform: [{ translateY: springValue }] },
          ]}>
          <Text style={Styles.exitTitleText}>
            {t('common:pressAgainToExit')}
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => BackHandler.exitApp()}>
            <Text style={Styles.exitText}>{t('common:exit')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
};

export default Home;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fill: {
    flex: 1,
  },
  containerSlider: {
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  containerContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
  },

  container2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedView: {
    borderRadius: 10,
    width: 300,
    backgroundColor: '#000',
    opacity: 0.6,
    elevation: 2,
    position: 'absolute',
    bottom: 0,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  exitTitleText: {
    textAlign: 'center',
    color: '#ffffff',
    marginRight: 10,
  },
  exitText: {
    color: '#e5933a',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
