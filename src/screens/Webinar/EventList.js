import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    FlatList,
    Animated,
    useWindowDimensions
} from 'react-native';
import { WebinarRouteName } from '../../constants/webinar_route/webinarRouteName';
import { optionEventType } from './components/constants';
import TabCategoryWebinar from './components/TabCategoryWebinar';
import convertCSS from '../../helpers/convertCSS';
import { useSelector } from 'react-redux';
import EventCard from './components/EventCard';
import axiosInstance from '../../helpers/axiosInstance';

const EventList = ({navigation}) => {
    const layout = useWindowDimensions();
    const [loading, setLoading] = useState(false);
    const flatListRef = React.useRef();
    const [events, setEvents] = React.useState([]);
    const [index, setIndex] = React.useState(0);

    const [perPage, setPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState();
    const [eventType, setEventType] = useState("");
    const [eventLabel, setEventLabel] = useState("Semua");
    const [isLoadMore, setIsLoadMore] = React.useState(false);

    const width = Dimensions.get('window').width;
    const scrollX = new Animated.Value(0);
    let position = Animated.divide(scrollX, width);

    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );

    const fontSize = convertCSS(themeSetting.body_typography.font_size);

    useEffect(() => {
        getEventList()
    }, [eventType]);

    const getEventList = async () => {
        let params = {
            page: currentPage,
            per_page: perPage,
            event_type: eventType,
            // search: "",
            // mp_customer_id: customer_id || null,
            // min_price: '',
            // max_price: ''
        }
        setLoading(true)
        axiosInstance
            .get(`webinar/getEvent`, { params })
            .then(res => {
                setEvents(res.data.data.data);
                setLastPage(res.data.data.last_page);
                // console.log(params);
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
            //   let params = {...filter, page: newPage};
            let params = {
                page: newPage,
                per_page: perPage,
                event_type: eventType,
                // search: "",
                // min_price: '',
                // max_price: ''
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

    const functionNavigate = (ids) =>{
        navigation.navigate(WebinarRouteName.WEBINAR_EVENT_DETAIL, {eventId:ids})
    }

    const onChangeTab = (label, value) => {
        setCurrentPage(1);
        setEventType(value);
        setEventLabel(label);     
    }

    return (
        <View style={styles.Container}>
            <TabCategoryWebinar
                selectedTab={eventLabel}
                catgeoryList={optionEventType}
                onChangeTab={onChangeTab}
            />
            <FlatList
                ref={flatListRef}
                nestedScrollEnabled={true}
                columnWrapperStyle={{justifyContent: 'space-between'}}
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

export default EventList