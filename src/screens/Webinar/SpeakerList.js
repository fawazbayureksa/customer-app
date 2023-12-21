import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    FlatList,
    Animated,
    useWindowDimensions
} from 'react-native';
import { WebinarRouteName } from '../../constants/webinar_route/webinarRouteName';
import axiosInstance from '../../helpers/axiosInstance';
import { optionExpertiseLevel } from './components/constants';
import TabCategoryWebinar from './components/TabCategoryWebinar';
import SpeakerCard from './components/SpeakerCard';


const SpeakerList = ({navigation}) => {
    const layout = useWindowDimensions();
    const [loading, setLoading] = useState(false);
    const flatListRef = React.useRef();
    const [speakers, setSpeakers] = React.useState([]);

    const [perPage, setPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState();
    const [isLoadMore, setIsLoadMore] = React.useState(false);

    const [expertiseType, setExpertiseType] = useState("");
    const [speakerLabel, setSpeakerLabel] = useState("Semua");

    const width = Dimensions.get('window').width;
    const scrollX = new Animated.Value(0);
    let position = Animated.divide(scrollX, width);

    useEffect(() => {
        getSpeakers()
    }, [expertiseType]);

    const getSpeakers = async () => {
        setLoading(true)
        let params = {
            // page: 1,
            page: currentPage,
            per_page: perPage,
            expertise_level: expertiseType
        }
        axiosInstance
            .get('webinar/getSpeaker', {params})
            .then(res => {
                setSpeakers(res.data.data.data);
                setLastPage(res.data.data.last_page);
                // console.log(res.data.data.last_page);
            }).catch(error => {
                console.error('error getSpeakers: ', error);
            }).finally(() => setLoading(false))
    }

    const handlePagination = async () => {
        let newPage = currentPage + 1;
        setCurrentPage(newPage);
        if (currentPage > lastPage) {
        // if (newPage > lastPage) {
            return;
        } else if (isLoadMore) {
            return;
        } else {
            //   let params = {...filter, page: newPage};
            let params = {
                page: newPage,
                per_page: perPage,
                expertise_level: expertiseType
            }
            setIsLoadMore(true);
            await axiosInstance
                .get(`webinar/getSpeaker`, { params })
                .then(res => {
                    const newList = speakers.concat(res.data.data.data);
                    setSpeakers(newList);
                    setCurrentPage(newPage);
                })
                .finally(() => setIsLoadMore(false));
        }
    };

    const onChangeTab = (label, value) => {
        setCurrentPage(1);
        setExpertiseType(value);
        setSpeakerLabel(label)
    }
      
    return (
        <View style={styles.Container}>
            <TabCategoryWebinar
                selectedTab={speakerLabel}
                catgeoryList={optionExpertiseLevel}
                onChangeTab={onChangeTab}
            />
            <FlatList
                ref={flatListRef}
                nestedScrollEnabled={true}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                numColumns={2}
                vertical
                data={speakers}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => {
                    return (
                        <SpeakerCard
                            speaker={item}
                            navigation={navigation}
                            key={item.id}
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
        justifyContent: 'center'
    }
});

export default SpeakerList