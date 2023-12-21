import {
  ScrollView,
  View,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TopNavbar from './Template/Navbar/TopNavbar';
import Footer from './Template/Footer';
import { onRefresh, onRefreshFinished } from '../redux/actions/auth';
import BottomNavbar from './Template/Navbar/BottomNavbar';
import axiosInstance from '../helpers/axiosInstance';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default function Template({
  children,
  scroll,
  refresh,
  style,
  url,
  loadingComponent,
  handlePagination,
  isLoadMore,
}) {
  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );
  const footer = useSelector(state => state?.themeReducer?.footer);

  const [loading, setLoading] = React.useState(false);
  const [topNavbar, setTopNavbar] = useState(null);
  const [bottomNavbar, setBottomNavbar] = useState(null);

  const onRefreshing = () => {
    setLoading(true);
    refreshData();
    let timer = setTimeout(() => setLoading(false), 1000);

    return () => {
      clearTimeout(timer);
    };
  };

  let styleConverted = convertCSS(themeSetting);

  useEffect(() => {
    getNavbar();
  }, []);

  const getNavbar = () => {
    if (url) {
      setLoading(true);
      axiosInstance
        .get(`template/getNavBar?url=${url}&type=app`)
        .then(res => {
          setTopNavbar(res.data.data.topNavBar);
          setBottomNavbar(res.data.data.bottomNavBar);
        })
        .catch(error => {
          console.error('error getNavbar', error);
        })
        .finally(() => setLoading(false));
    }
  };

  const refreshData = () => {
    getNavbar();
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - HEIGHT
    );
  };

  return (
    <>
      {loading || loadingComponent ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator
            size="large"
            color={themeSetting?.accent_color?.value}
          />
        </View>
      ) : (
        <>
          {scroll ? (
            <View
              style={{
                backgroundColor: '#fff',
                // height: HEIGHT,
                flex: 1,
              }}>
              {topNavbar && (
                <TopNavbar theme={themeSetting} topNavbar={topNavbar} />
              )}
              <ScrollView
                nestedScrollEnabled={true}
                refreshControl={
                  refresh && (
                    <RefreshControl
                      refreshing={loading}
                      onRefresh={onRefreshing}
                    />
                  )
                }
                onScroll={({ nativeEvent }) => {
                  if (isCloseToBottom(nativeEvent) && handlePagination) {
                    handlePagination();
                  }
                }}
              >
                <View
                  style={{
                    ...style,
                    paddingTop: 8,
                    // paddingLeft: styleConverted?.paddingLeft,
                    // paddingRight: styleConverted?.paddingRight,
                  }}>
                  {children}
                  {isLoadMore && (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <ActivityIndicator
                        size="large"
                        color={themeSetting?.accent_color?.value}
                      />
                    </View>
                  )}
                </View>
                {/* <Footer theme={themeSetting} footer={footer} /> */}
              </ScrollView>
              {bottomNavbar && (
                <BottomNavbar
                  theme={themeSetting}
                  bottomNavbar={bottomNavbar}
                />
              )}
            </View>
          ) : (
            <>
              {/* <TopNavbar theme={themeSetting} topNavbar={topNavbar} /> */}
              <View
                style={{
                  ...style,
                  backgroundColor: '#fff',
                  flex: 1,
                  // paddingLeft: styleConverted?.paddingLeft,
                  // paddingRight: styleConverted?.paddingRight,
                  paddingTop: 8,
                }}>
                {children}
                {bottomNavbar && (
                  <BottomNavbar
                    theme={themeSetting}
                    bottomNavbar={bottomNavbar}
                  />
                )}
              </View>
              {/* <View style={{backgroundColor: 'red', marginVertical: 100}}>
                <Footer theme={themeSetting} footer={footer} />
              </View> */}
            </>
          )}
        </>
      )}
    </>
  );
}

const convertCSS = css => {
  if (css) {
    return {
      paddingLeft: getNumber(css?.page_content_mobile_padding?.padding_left),
      paddingRight: getNumber(css?.page_content_mobile_padding?.padding_right),
    };
  }
};

const getNumber = string => {
  return parseInt(string.replace(/\D/g, ''));
};
