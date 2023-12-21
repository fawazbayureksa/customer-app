import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ArrowRight2, Shop } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import convertCSS from '../../helpers/convertCSS';
import { Dimensions } from 'react-native';
import { styles } from '../Forum/styles';
import { Image } from 'react-native';
import colors from '../../assets/theme/colors';
import { ListOptions, ListOptionsSeller, Setting } from './my_profil/ListOption';
import { IMAGE_URL } from "@env";
import { MainRouteName } from '../../constants/mainRouteName';
import { logout } from '../../redux/actions/auth';
import axiosInstance from '../../helpers/axiosInstance';
import Currency from '../../helpers/Currency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetMedia from '../../components/common/GetMedia';
import Template from '../../components/Template';
export default function Account() {
  const state = useSelector(state => state);
  const { navigate } = useNavigation();
  const navigation = useNavigation();
  const WIDTH = Dimensions.get('window').width * 0.95;
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  )
  const dispatch = useDispatch();
  const [dataMembership, setDataMemebership] = useState()
  const [name, setName] = useState("");
  const [picture, setPicture] = useState();
  const [level, setLevel] = useState()
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
  const isAccount = useSelector(state => state.authReducer.user);
  const [seller, setSeller] = useState(false)
  const [idSeller, setIdSeller] = useState(null)
  const [dataSeller, setDataSeller] = useState()
  const [dataFollower, setDataFollower] = useState([])
  const [dataFollowing, setDataFollowing] = useState([])

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.replace(MainRouteName.LOGIN)
    }
  }, []);


  const getAccount = async () => {
    const account = JSON.parse(await AsyncStorage.getItem('isAccount'))
    if (account !== null) {
      if (account !== "seller") {
        setDataSeller();
        setSeller(false);
        return
      } else {
        changeAccount()
      }
    } else {
      return
    }
  }
  useEffect(() => {
    getAccount()

  }, []);

  useEffect(() => {
    getFollowers()
    getFollowing()
    const willFocusSubscription = navigation.addListener('focus', () => {
      getFollowers()
      getFollowing()
    });
    return willFocusSubscription;
  }, [])

  const getFollowers = () => {
    axiosInstance.get('ecommerce/customer/getFollowers')
      .then((res) => {
        let data = res.data.data
        setDataFollower(data.total_item)
      }).catch(error => {
        console.log(error)
      })
  }

  const getFollowing = () => {
    axiosInstance.get('ecommerce/customer/getFollowing')
      .then((res) => {
        let data = res.data.data
        setDataFollowing(data.total_item)
      }).catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (isLoggedIn) {
      getMasterDataProfile()
      const willFocusSubscription = navigation.addListener('focus', () => {
        getMasterDataProfile()
      });
      return willFocusSubscription;
    }
  }, [])

  const getMasterDataProfile = () => {
    setLoading(true);
    axiosInstance.get('profile/get')
      .then(res => {
        setName(res.data.data.name);
        setPicture(res.data.data.profile_picture)
      }).catch(error => {
        console.error('error getCategory: ', error.response.data.message);
      }).finally(() => {
        setLoading(false);
      })
  }

  const onLogout = () => {
    dispatch(logout()).then(response => {
      if (response.status === 'success') {
        navigation.replace(MainRouteName.LOGIN);
      }
    });
  };

  useEffect(() => {
    getLevelAndPoint()
  }, [])

  useEffect(() => {
    if (JSON.parse(isAccount)?.mp_seller_id === null) {
      return
    } else {
      getSeller()
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) setIdSeller(JSON.parse(isAccount)?.mp_seller_id)
  }, [])


  const getLevelAndPoint = () => {
    setLoading(true);
    axiosInstance.get('membership/getMasterData')
      .then((res) => {
        setLevel(res.data.data)
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        setLoading(false);
      })
  }

  const getSeller = async () => {
    axiosInstance.post('profile/seller-account')
      .then(res => {
        AsyncStorage.setItem('seller', JSON.stringify(res.data.data));
      })
      .catch(err => {
        console.log('errorLogin', err.response.data);
      });
  };


  const changeAccount = async () => {
    if (seller) {
      setSeller(!seller)
      AsyncStorage.setItem('isAccount', JSON.stringify("customer"));
    } else {
      setSeller(!seller)
      AsyncStorage.setItem('isAccount', JSON.stringify("seller"));
      const sellerakun = JSON.parse(await AsyncStorage.getItem('seller'))
      setDataSeller(sellerakun);
    }
  }


  return (
    <>
      {loading ?
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator
            size="small"
            color={colors.bgColor}

          />
        </View>
        :
        <Template scroll={true} theme={themeSetting} refresh={true} url="/Account">
          <View
            style={{
              marginTop: -10,
              backgroundColor: themeSetting?.accent_color?.value,
              height: "auto",
              paddingBottom: 20,
            }}>
            <Text style={{ fontSize: 16, color: "#FFFFFF", fontWeight: "400", marginLeft: 10, marginTop: 10 }}>
              Profil Saya
            </Text>
            <View style={[styles.section, { marginTop: 10, marginHorizontal: 10 }]}>
              {seller ?
                <Image
                  source={{
                    uri: `${IMAGE_URL}public/seller/${dataSeller?.cover_picture}`,
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: "#FFFFFF",
                    resizeMode: "center"
                  }}
                />
                :
                <GetMedia
                  folder="customer"
                  filename={picture}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: "#FFFFFF"
                  }}
                />
              }
              <View
                style={{ marginLeft: 10 }}
              >
                <View style={[styles.section, { marginTop: 10 }]}>
                  <Text
                    style={{
                      fontSize: convertCSS(themeSetting.h5_typography.font_size),
                      fontWeight: "bold",
                      color: colors?.white
                    }}
                  >
                    {!seller ? name : dataSeller?.name}
                  </Text>
                  {seller &&
                    <View style={{ alignSelf: "center", flexDirection: "row" }}>
                      <View style={{
                        backgroundColor: "#FFFFFF",
                        flexDirection: "row",
                        borderRadius: 10,
                        marginHorizontal: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 2
                      }}>
                        <Shop
                          size="14"
                          color={themeSetting.accent_color.value}
                        />
                        <Text style={{ color: themeSetting.accent_color.value, fontSize: 10 }} > Seller</Text>
                      </View>
                    </View>
                  }
                </View>
                <View style={[styles.section, { marginTop: 10 }]}>
                  <TouchableOpacity onPress={() => navigate(MainRouteName.FRIEND_LIST)}>
                    <Text
                      style={{
                        fontSize: convertCSS(themeSetting.body_typography.font_size),
                        marginRight: 10,
                        color: colors?.white
                      }}
                    >
                      {dataFollowing} following
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ color: colors?.white, marginHorizontal: 10 }} >|</Text>
                  <TouchableOpacity onPress={() => navigate(MainRouteName.FRIEND_LIST)}>
                    <Text
                      style={{
                        fontSize: convertCSS(themeSetting.body_typography.font_size),
                        marginLeft: 10,
                        color: colors?.white
                      }}
                    >
                      {dataFollower} followers
                    </Text>
                  </TouchableOpacity>
                </View>
                {idSeller !== null &&
                  <TouchableOpacity
                    // onPress={getSeller}
                    onPress={changeAccount}
                    style={[
                      styles.buttonDraft,
                      {
                        maxWidth: WIDTH * 0.5,
                        flex: 1,
                        flexDirection: "row",
                        borderWidth: 1,
                        borderColor: colors?.line,
                        height: 25,
                        backgroundColor: colors?.white,
                        alignItems: "center",
                        justifyContent: "space-around",
                      }]}>
                    <Text
                      numberOfLines={1}
                      style={{ color: themeSetting?.accent_color?.value, fontSize: 12, fontWeight: "600" }}
                    >
                      {seller ? name : !dataSeller ? "Akun Seller" : dataSeller.name}
                    </Text>
                    <ArrowRight2
                      size="22"
                      color={themeSetting?.accent_color?.value}
                    />
                  </TouchableOpacity>
                }
              </View>
            </View>
            {(level && !seller) &&
              <View style={[{
                alignSelf: "center",
                marginTop: 10,
                backgroundColor: "#ED8101",
                width: WIDTH * 0.95,
                shadowColor: "#000",
                borderRadius: 5,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                padding: 10
              }]}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <TouchableOpacity
                    onPress={() => navigate(MainRouteName.MEMBERSHIP)}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <View style={{
                      display: "flex",
                      flexDirection: "column",
                    }}>
                      <View style={{
                        display: "flex",
                        flexDirection: "row",
                      }}>
                        <Image
                          source={require('../../assets/images/Exclude.png')}
                          style={{ width: 12, height: 12, resizeMode: "contain", marginRight: 5 }}
                        />
                        <Text
                          style={{
                            color: "white",
                            fontSize: 10,
                            fontWeight: "600"
                          }}
                        >
                          {level?.cashPointCustomName}
                        </Text>
                      </View>
                      <View style={{
                        display: "flex",
                        flexDirection: "row",
                      }}>
                        <Text
                          style={{
                            color: "white",
                            marginRight: 5,
                            fontWeight: "bold",
                            fontSize: 16,
                          }}>
                          {Currency(level?.currentCashPoint)}
                        </Text>
                        <Text style={{ fontWeight: "400", color: "white", }}>
                          poin
                        </Text>
                      </View>
                    </View>
                    <View style={{ borderColor: "#DCDCDC", borderWidth: 1, marginHorizontal: 40, height: 40 }} />
                    <View style={{
                      display: "flex",
                      flexDirection: "column",
                    }}>
                      <Text style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: 10
                      }}>
                        {level?.customerLevel?.name}
                      </Text>
                      <View style={{
                        display: "flex",
                        flexDirection: "row",
                      }}>
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold"
                          }}>
                          {Currency(level?.currentLoyaltyPoint)}
                        </Text>
                        <Text style={{ fontWeight: "400", color: "white", fontSize: 12, alignSelf: "flex-end" }}>
                          /500.000 cookies
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            }
          </View>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            marginHorizontal: 20,
            marginVertical: 10,
          }}>
            <Text style={{ color: colors?.pasive, marginBottom: 5 }}>Akun Saya</Text>
            {!seller ? (
              <>
                {ListOptions.map((item, index) => {
                  return (
                    <View key={index}>
                      <TouchableOpacity onPress={() => navigate(item.Path)}>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                          <View>
                            <Text style={{ fontSize: convertCSS(themeSetting.h5_typography.font_size), color: "#000", fontWeight: "600" }}>
                              {item.Title}
                            </Text>
                            <Text style={{
                              fontSize: convertCSS(themeSetting.body_typography.font_size) * 0.7,
                              color: colors?.pasive,
                            }}>
                              {item.Subtitle}
                            </Text>
                          </View>
                          <View style={{ alignSelf: "center" }}>
                            <Text style={{ fontSize: 40, color: "black" }}>
                              <ArrowRight2
                                size="32"
                                color="#000"
                              />
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View style={{ borderWidth: 1, borderColor: colors?.line, marginVertical: 10 }} />
                    </View>
                  )
                })}
              </>
            )
              : (
                <>
                  {ListOptionsSeller.map((item, index) => {
                    return (
                      <View key={index}>
                        <TouchableOpacity onPress={() => navigate(item.Path)} key={index}>
                          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <View>
                              <Text style={{ fontSize: convertCSS(themeSetting.h5_typography.font_size), color: "#000", fontWeight: "600" }}>
                                {item.Title}
                              </Text>
                              <Text style={{
                                fontSize: convertCSS(themeSetting.body_typography.font_size) * 0.7,
                                color: colors?.pasive,
                              }}>
                                {item.Subtitle}
                              </Text>
                            </View>
                            <View style={{ alignSelf: "center" }}>
                              <Text style={{ fontSize: 40, color: "black" }}>
                                <ArrowRight2
                                  size="32"
                                  color="#000"
                                />
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <View style={{ borderWidth: 1, borderColor: colors?.line, marginVertical: 10 }} />
                      </View>
                    )
                  })}
                </>
              )
            }
            <Text style={{ color: colors?.pasive, marginBottom: 5 }}>Pengaturan</Text>
            {Setting.map((item, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity onPress={() => navigate(item.Path)} key={index}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <View>
                        <Text style={{ fontSize: convertCSS(themeSetting.h5_typography.font_size), color: "#000", fontWeight: "600" }}>
                          {item.Title}
                        </Text>
                      </View>
                      <View style={{ alignSelf: "center" }}>
                        <Text style={{ fontSize: 40, color: "black" }}>
                          <ArrowRight2
                            size="32"
                            color="#000"
                          />
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={{ borderWidth: 1, borderColor: colors?.line, marginVertical: 10 }} />
                </View>
              )
            })}
            <TouchableOpacity onPress={onLogout}>
              <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                  <Text style={{ fontSize: convertCSS(themeSetting.h5_typography.font_size), color: "#000", fontWeight: "600" }}>
                    Keluar
                  </Text>
                </View>
                <View style={{ alignSelf: "center" }}>
                  <Text style={{ fontSize: 40, color: "black" }}>
                    <ArrowRight2
                      size="32"
                      color="#000"
                    />
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Template >
      }
    </>

  );
}
