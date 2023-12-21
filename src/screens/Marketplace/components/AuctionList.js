import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Card from './Card';
import axiosInstance from '../../../helpers/axiosInstance';
import ListEmpty from '../../../components/common/ListEmpty';
import CardAuction from '../../Auction/home_auction/components/CardAuction';
import { useSelector } from 'react-redux';


export default function AuctionList({ data, filter, typeName }) {
    const flatListRef = React.useRef();
    const language = useSelector(state => state.themeReducer.language);
    const [productList, setProductlist] = React.useState([]);
    const [isLoadMore, setIsLoadMore] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [lastPage, setLastPage] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    //   const [filter, setFilter] = useState(initFilter);

    useEffect(() => {
        getProductList();
    }, [filter]);

    const getProductList = () => {
        setLoading(true);
        let params = filter;
        axiosInstance
            .get(`ecommerce/products/get`, { params })
            .then(res => {
                setProductlist(res.data.data.data);
                setLastPage(res.data.data.last_page);
                setCurrentPage(1)
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
            let params = { ...filter, page: newPage };
            setIsLoadMore(true);
            await axiosInstance
                .get(`ecommerce/products/get`, { params })
                .then(res => {
                    const newList = productList.concat(res.data.data.data);
                    setProductlist(newList);
                    setCurrentPage(newPage);
                })
                .finally(() => setIsLoadMore(false));
        }
    };

    const renderFooter = () => {
        return (
            <>
                {isLoadMore && (
                    <ActivityIndicator
                        color={'#2C465C'}
                        size={'large'}
                        style={{ padding: 10 }}
                    />
                )}
            </>
        );
    };

    return (
        <View>
            {loading ? (
                <ActivityIndicator
                    color={'#2C465C'}
                    size={'large'}
                    style={{ padding: 10 }}
                />
            ) : (
                <FlatList
                    ref={flatListRef}
                    nestedScrollEnabled={true}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    data={productList}
                    numColumns={2}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) => (
                        <View style={{ marginVertical: 5 }}>
                            {/* <CardAuction data={item} index={index} language={language} /> */}
                            <Card product={item} data={data} index={index} />
                        </View>
                    )}
                    onEndReached={() => handlePagination()}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={<ListEmpty />}
                />
            )}
        </View>
    );
}
