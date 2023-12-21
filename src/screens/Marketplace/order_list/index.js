import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Template from '../../../components/Template';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { statusOrderInitList } from './constants';
import CardOrder from './components/CardOrder';
import axiosInstance from '../../../helpers/axiosInstance';
import { MainRouteName } from '../../../constants/mainRouteName';
import { ArrowLeft2 } from 'iconsax-react-native';
import { ScrollView } from 'react-native';

export default function OrderList({ navigation }) {
  const { t } = useTranslation();

  const themeSetting = useSelector(
    state => state.themeReducer?.themeSetting?.theme,
  );

  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);

  const [indexStatusSelected, setIndexStatusSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [lastPage, setLastPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadMore, setIsLoadMore] = React.useState(false);

  useEffect(() => {
    getData();
  }, [indexStatusSelected]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.push(MainRouteName.LOGOUT);
    }
  }, []);

  const getData = () => {
    setLoading(true);
    axiosInstance
      .get(
        `my-orders/get?status=${statusOrderInitList[indexStatusSelected].key}&length=6&page=1`,
      )
      .then(res => {
        setData(res.data.data.data);
        setLastPage(res.data.data.last_page);
        setCurrentPage(1);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePagination = async () => {
    let newPage = currentPage + 1;
    if (newPage > lastPage) {
      return;
    } else if (isLoadMore) {
      return;
    } else {
      setIsLoadMore(true);
      await axiosInstance
        .get(
          `my-orders/get?status=${statusOrderInitList[indexStatusSelected].key}&length=6&page=${newPage}`,
        )
        .then(res => {
          const newList = data.concat(res.data.data.data);
          setData(newList);
          setCurrentPage(newPage);
        })
        .finally(() => setIsLoadMore(false));
    }
  };

  return (
    <Template
      scroll={true}
      handlePagination={handlePagination}
      isLoadMore={isLoadMore}>
      <View style={{ flexGrow: 1, flex: 1, zIndex: 1000 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
          <ArrowLeft2
            size="24"
            color="#000"
            onPress={() => {
              navigation.goBack();
            }}
            style={{ marginRight: 10 }}
          />
          <Text style={{ fontSize: 18, fontWeight: '500' }}>{t('common:myOrder')}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ paddingVertical: 8, flexDirection: 'row' }}>
            {
              statusOrderInitList.map((item, index) => {
                return (
                  <View key={index}>
                    <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8 }} onPress={() => setIndexStatusSelected(index)}>
                      <Text style={{
                        color: indexStatusSelected == index ? '#F8931D' : '#A6A6A6',
                        fontWeight: indexStatusSelected == index ? '700' : '400'
                      }}>{item.label}</Text>
                    </TouchableOpacity>
                    <View style={{
                      marginVertical: 5, height: 3, backgroundColor: indexStatusSelected == index ? '#F8931D' : '#DCDCDC'
                    }} />
                  </View>
                )
              })
            }
          </View>
        </ScrollView>
        <CardOrder
          refresh={getData}
          data={data}
          themeSetting={themeSetting}
          loading={loading}
          status={statusOrderInitList[indexStatusSelected].key}
          handlePagination={handlePagination}
          isLoadMore={isLoadMore}
        />
      </View>
    </Template>
  );
}
