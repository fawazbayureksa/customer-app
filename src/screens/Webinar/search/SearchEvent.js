import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    TextInput,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft2, SearchNormal1 } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import colors from '../../../assets/theme/colors';
import { WebinarRouteName } from '../../../constants/webinar_route/webinarRouteName';

const SearchEvent = () => {
    const tabName = ['Western Food', 'Dessert', 'Churros', 'Nasi Goreng', 'Roti']
    const WIDTH = Dimensions.get('window').width * 0.95;
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);

    const navigation = useNavigation()

    const handleKeyDown = () => {
        // if (!searchQuery) return
        navigation.navigate(WebinarRouteName.WEBINAR_SEARCH_EVENT_RESULT, {
            searchParam: searchQuery,
        })
    }

    const onChangeTab = (query) => {
        setSearchQuery(query)
        navigation.navigate(WebinarRouteName.WEBINAR_SEARCH_EVENT_RESULT, {
            searchParam: query,
        })
    }

  return (
    <ScrollView
            nestedScrollEnabled={true}
            style={{
                flex: 1,
                backgroundColor: '#fff',
            }}
        >
            <View
                style={{
                    width: WIDTH,
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                    // marginLeft: '2.5%' //Pakai icon SearchNormal1 -> 5.5%
                }}
            >
                <ArrowLeft2
                    size="24"
                    color="#000"
                    onPress={() => navigation.goBack()}
                    style={{ marginRight: 5 }}
                />
                <SearchNormal1
                    size="18"
                    color={colors.pasive}
                    style={{ marginRight: -25, zIndex: 99, marginLeft: 0}}
                />
                <TextInput
                    style={{
                        backgroundColor: colors?.line,
                        width: WIDTH * 0.95,
                        borderRadius: 30,
                        padding: 5,
                        paddingLeft: 30,
                    }}
                    placeholder="Search Event"
                    onChangeText={onChangeSearch}
                    // onKeyPress={(keyPress) => handleKeyDown(keyPress.nativeEvent.keyValue)}
                    value={searchQuery}
                    keyboardType="default"
                    onSubmitEditing={handleKeyDown}
                    returnKeyLabel='search'
                // multiline={true}
                />
            </View>
            <View
                style={{
                    flex: 1,
                    marginTop: 20,
                    width: WIDTH,
                    marginHorizontal: 10,
                }}>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: '700',
                    }}>
                    Mungkin Anda Suka
                </Text>
                <View
                    // showsHorizontalScrollIndicator={false}
                    // horizontal={true}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginVertical: 10,
                        flexWrap: 'wrap',
                    }}>
                    {tabName.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => onChangeTab(item)}
                            style={{
                                marginBottom: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 38,
                                marginHorizontal: 5,
                                padding: 10,
                                backgroundColor: colors?.white,
                                borderWidth: 1,
                                borderColor: colors?.line,
                            }}>
                            <Text style={{}}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
  )
}

const styles = StyleSheet.create({
    roundedSearch: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 36,
        borderRadius: 38,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 5
    },
});

export default SearchEvent