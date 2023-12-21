import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
} from 'react-native';
import { WebinarRouteName } from '../../../constants/webinar_route/webinarRouteName';
import convertCSS from '../../../helpers/convertCSS';
import { useSelector } from 'react-redux';
import EventCard from '../components/EventCard';
import axiosInstance from '../../../helpers/axiosInstance';

const SearchEventResult = ({ navigation, route }) => {
    const {searchParam} = route.params;
    const flatListRef = React.useRef();
    const [events, setEvents] = React.useState([]);
    const [index, setIndex] = React.useState(0);

    const [perPage, setPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState();
    const [isLoadMore, setIsLoadMore] = React.useState(false);
    const [loading, setLoading] = useState(false);

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const fontSize = convertCSS(themeSetting.body_typography.font_size);

    useEffect(() => {
        getEventList()
    }, []);

    const getEventList = async () => {
        let params = {
            page: currentPage,
            per_page: perPage,
            event_type: '',
            search: searchParam,
            // min_price: '',
            // max_price: ''
        }
        setLoading(true)
        axiosInstance
            .get(`webinar/getEvent`, { params })
            .then(res => {
                setEvents(res.data.data.data);
                setLastPage(res.data.data.last_page);
                console.log(res.data.data.data);
                console.log(params);
            }).catch(error => {
                console.error('error getEventList: ', error);
            }).finally(() => setLoading(false))
    }

    const handlePagination = async () => {
        let newPage = currentPage + 1;
        setCurrentPage(newPage);
        if (currentPage > lastPage) {
            return;
        } else if (isLoadMore) {
            return;
        } else {
            let params = {
                page: newPage,
                per_page: perPage,
                event_type: '',
                search: searchParam,
                min_price: '',
                max_price: ''
            }
            setIsLoadMore(true);
            await axiosInstance
                .get(`webinar/getEvent`, { params })
                .then(res => {
                    const newList = events.concat(res.data.data.data);
                    // console.log(params);
                    setEvents(newList);
                    setCurrentPage(newPage);
                })
                .finally(() => setIsLoadMore(false));
        }
    };

    const functionNavigate = (ids) => {
        navigation.navigate(WebinarRouteName.WEBINAR_EVENT_DETAIL, { eventId: ids })
    }

    return (
        <View style={styles.Container}>
            <FlatList
                ref={flatListRef}
                nestedScrollEnabled={true}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                numColumns={2}
                vertical
                data={events}
                // keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => {
                    return (
                        <EventCard
                            key={item.id}
                            event={item}
                            nav={() => functionNavigate(item.id)}
                        />
                    );
                }}
                onEndReached={() => handlePagination()}
                onEndReachedThreshold={0.2}
            // ListFooterComponent={renderFooter}
            // ListEmptyComponent={<ListEmpty />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        // flex: 1,
        backgroundColor: '#fff',
        marginLeft: '1.5%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '5%'
    }
});

export default SearchEventResult