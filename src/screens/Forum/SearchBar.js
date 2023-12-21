import { useNavigation } from '@react-navigation/native';
import { ArrowLeft2, SearchNormal1 } from 'iconsax-react-native';
import React from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Searchbar, } from 'react-native-paper';
import { useSelector } from 'react-redux';
import colors from '../../assets/theme/colors';
import { ForumRouteName } from '../../constants/forum_route/forumRouteName';
import { styles } from './styles';
const SearchBar = () => {
    const tabName = ['Western Food', 'Chef Renatta', 'Dessert', 'Churros', 'Informasi', 'Komunikasi']
    const [searchQuery, setSearchQuery] = React.useState('');
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const WIDTH = Dimensions.get('window').width * 0.95;

    const onChangeSearch = query => setSearchQuery(query);

    const navigation = useNavigation()

    const onChangeTab = (query) => {
        setSearchQuery(query)
        navigation.navigate(ForumRouteName.RESULT_SEARCH_THREAD, {
            search: query,
        })
    }
    const handleKeyDown = () => {
        if (!searchQuery) return
        navigation.navigate(ForumRouteName.RESULT_SEARCH_THREAD, {
            search: searchQuery,
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
                    marginRight: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,

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
                    style={{ marginRight: -25, zIndex: 99, marginLeft: 0 }}
                />
                <TextInput
                    style={{
                        backgroundColor: colors?.line,
                        width: WIDTH * 0.97,
                        borderRadius: 30,
                        padding: 5,
                        paddingLeft: 30,
                    }}
                    placeholder="Search"
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
                    Lagi Banyak Dicari
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
            <View style={{
                flex: 1,
                marginTop: 20,
                width: WIDTH,
                marginHorizontal: 10
            }}>
                <Text style={{
                    fontSize: 12,
                    fontWeight: '700',
                }}
                >
                    Ada pilihan thread untuk Anda
                </Text>
                <ScrollView
                    horizontal={true}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginVertical: 10,
                    }}>
                    {tabName.map((item, index) => (
                        <TouchableOpacity
                            onPress={() => onChangeTab(item)}
                            key={index}
                            style={[
                                styles.roundedSearch,
                                {
                                    width: "auto",
                                    padding: 5,
                                    backgroundColor: colors?.white,
                                    borderWidth: 1,
                                    borderColor: colors?.line,
                                }
                            ]}>
                            <Text style={{}}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
}

export default SearchBar;
