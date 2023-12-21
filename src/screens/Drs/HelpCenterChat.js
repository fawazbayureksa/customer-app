import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SearchNormal1 } from 'iconsax-react-native';
import { Dimensions, Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../../assets/theme/colors';
import { drsRouteName } from '../../constants/drs_route/drsRouteName';
import axiosInstance from '../../helpers/axiosInstance';
import truncate from '../../helpers/truncate';
import moment from 'moment';

const WIDTH = Dimensions.get('window').width * 0.95;

const HelpCenterChat = ({ navigation }) => {
    const { navigate } = useNavigation()
    const [loading, setLoading] = useState(false);
    const [dataTickets, setDataTikects] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getTicket();
      }, [search]);

    const getTicket = () => {
        setLoading(true);
        axiosInstance
            .get(`drs/ticket/get?search=${search}`)
            .then(res => {
                setDataTikects(res.data.data);
                // console.log("tickets data-> ",res.data.data);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <ScrollView style={{ backgroundColor: "#FFF" }}>
            <View
                style={{
                    width: WIDTH,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                    marginHorizontal: 10

                }}
            >
                <SearchNormal1
                    size="18"
                    color={colors.pasive}
                    style={{ marginRight: -25, zIndex: 99, marginLeft: 0 }}
                />
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: colors.line,
                        width: WIDTH * 0.97,
                        borderRadius: 30,
                        paddingVertical: 10,
                        paddingLeft: 30,
                    }}
                    placeholder="Cari pesan.."
                    onChangeText={text => setSearch(text)}
                    value={search}
                />
            </View>
            {dataTickets?.map((ticket, index) => (
                <TouchableOpacity
                    onPress={() => navigate(drsRouteName.HELP_CENTER_CHAT_MESSAGE, { ticketId: ticket.id })}
                    key={index}
                    style={{
                        width: WIDTH,
                        marginTop: 10,
                        marginHorizontal: 10,
                        borderBottomColor: colors.line,
                        borderBottomWidth: 1,
                        paddingVertical: 10
                    }}
                >
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        {
                            (ticket?.ticket_statuses[ticket?.ticket_statuses?.length - 1].status === 'pending') ?
                                <>
                                    <Text
                                        style={{ fontWeight: "600" }}
                                    >
                                        [Pending] {truncate(ticket.title)}
                                    </Text>
                                </> :
                                (ticket?.ticket_statuses[ticket?.ticket_statuses?.length - 1].status === 'resolved') ?
                                    <>
                                        <Text
                                            style={{ fontWeight: "600" }}
                                        >
                                            [Closed] {truncate(ticket.title)}
                                        </Text>
                                    </> :
                                    <>
                                        <Text
                                            style={{ fontWeight: "600" }}
                                        >
                                            {truncate(ticket.title)}
                                        </Text>
                                    </>
                        }
                        {/* Notif Icon */}
                        {/* {index === 0 &&
                            <View style={{
                                backgroundColor: colors?.danger,
                                padding: 0, margin: 0,
                                width: 20, height: 20,
                                borderRadius: 50
                            }}>
                                <Text style={{ color: colors.white, fontSize: 12, textAlign: "center", fontWeight: "700", marginTop: 1 }}>1</Text>
                            </View>
                        } */}
                    </View>
                    <View>
                        <Text style={{ color: colors.textmuted }}>ID: {ticket.ticket_number}</Text>
                        <Text style={{ color: colors.textmuted }}>{moment(ticket.created_at).format('DD MMMM YYYY, HH : mm')}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({})

export default HelpCenterChat;
