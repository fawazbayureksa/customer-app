import React, { Component, useState, useEffect, useContext } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    ImageBackground,
    TextInput,
    Dimensions,
    FlatList,
    useWindowDimensions
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';
import TicketCardPending from './components/TicketCardPending';
import { WebinarRouteName } from '../../constants/webinar_route/webinarRouteName';
import { useSelector } from 'react-redux';
import TicketCard from './components/TicketCard';
import axiosInstance from '../../helpers/axiosInstance';
import CustomAlert from '../Forum/components/CustomAlert';

const TicketList = ({ navigation }) => {
    //tab
    const tabName = ['pending','all','active','done']; //done?
    const [index, setIndex] = React.useState(0);
    const [tickets, setTickets] = React.useState([]);
    const [ticketsPending, setTicketsPending] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalSuccesUpdate, setModalSuccesUpdate] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState();
    const layout = useWindowDimensions();
    const [selectedTab, setSelectedTab] = useState(tabName[1]);

    const {t} = useTranslation();

    const onChangeTab = (item) => {
        setSelectedTab(item)
    }
    
    useEffect(() => {
        getTicketList()
    }, [selectedTab]);

    const getTicketList = () => {
        let params = {
            status: selectedTab,
        }
        setLoading(true)
        axiosInstance
            .get(`webinar/my-orders/get`, { params }) //nanti diganti pakai infinite scroll
            .then(res => {
                if (selectedTab === 'pending'){
                    setTicketsPending(res.data.data.data);
                } else {
                    setTickets(res.data.data.data);
                }
                // setTickets(res.data.data.data);
                // console.log(tickets);
                // console.log(selectedTab);
            }).catch(error => {
                console.error('error Ticket: ', error);
            }).finally(() => setLoading(false))
    }

    const cancelOrder = () => {
        console.log("test");
        setLoading(true)
        let data = {
            invoice_number: selectedInvoice
        }
        axiosInstance.post('webinar/my-orders/cancel-order', data)
            .then((res) => {
                console.log(res.data);
                setModalSuccesUpdate(true)
                getTicketList();
            }).catch((err) => {
                toast.show(err.response.data.message, {
                    placement: 'top',
                    type: 'danger',
                    animationType: 'zoom-in',
                    duration: 3000,
                });
            }).finally(() => {
                setLoading(false);
                setModalConfirmation(false);
                setSelectedInvoice();
            });
    }

    const openModalCancel = (invoice) => {
        setModalConfirmation(true);
        setSelectedInvoice(invoice);
    }

    const functionNavigate = (ticket) =>{
        // navigation.navigate(WebinarRouteName.WEBINAR_SPEAKER_INFO, {speakerId:speaker.id})
        if (!ticket){
            return;
        }
        navigation.navigate(WebinarRouteName.WEBINAR_TICKET_DETAIL, {transCode:ticket?.transaction_code})
    }

    return (
        <View style={styles.Container}>
            <Tab
                selectedTab={selectedTab}
                tabName={tabName}
                onChangeTab={onChangeTab}
            />
            <ScrollView style={{width: '97.5%'}} >
                {
                    (selectedTab === "pending") ?
                        <>
                            {ticketsPending?.map(
                                (ticket) => {
                                    return (
                                        <TicketCardPending
                                            ticket={ticket}
                                            navigation={navigation}
                                            key={ticket.id}
                                            handleCancel={() => openModalCancel(ticket?.webinar_payment_transactions[0]?.webinar_transaction?.transaction_code)}
                                        />
                                    )
                                }
                            )}
                        </>
                        :
                        <>
                            {tickets?.map(
                                (ticket) => {
                                    return (
                                        <TicketCard
                                            ticket={ticket}
                                            nav={() => functionNavigate(ticket)}
                                            key={ticket?.id}
                                        />
                                    )
                                }
                            )}
                        </>
                }
            </ScrollView>
            <CustomAlert
                modalVisible={modalSuccesUpdate}
                setModalVisible={setModalSuccesUpdate}
                message={t('webinar:message_cancel_order')}
            />
            <Modal
                isVisible={modalConfirmation}
                onBackdropPress={() => {
                    setModalConfirmation(false);
                    setSelectedInvoice()
                  }}
                  onBackButtonPress={() => {
                    setModalConfirmation(false);
                    setSelectedInvoice()
                  }}
            >
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        paddingVertical: 16,
                        paddingHorizontal: 14,
                        maxHeight: '90%',
                        alignItems: 'center'
                    }}
                >
                    <Text style={{alignItems: 'center'}}>
                        {t('webinar:modal_cancel_order')}
                    </Text>
                    <TouchableOpacity
                        style={[styles.buttonStyle]}
                        onPress={()=> cancelOrder()}
                    >
                        <Text style={{color: 'white'}}>
                            {t('webinar:cancel')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

const Tab = ({ tabName, onChangeTab, selectedTab }) => {
    const themeSetting = useSelector(
        state => state.themeReducer.themeSetting.theme,
    );
    const layout = useWindowDimensions();

    return (
        <>
            <View horizontal={true} style={{ flexDirection: "row", height: 50 }}>
                {tabName.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={{
                                backgroundColor: selectedTab === item ? '#FAFAFA' : '#fff',
                                borderBottomWidth: selectedTab === item ? 2 : 0,
                                borderColor: themeSetting?.accent_color?.value,
                            }}>
                            <Text
                                onPress={() => onChangeTab(item)}
                                style={{
                                    color:
                                        selectedTab === item
                                            ? themeSetting?.accent_color?.value
                                            : '#000',
                                    fontWeight: selectedTab === item ? '700' : '400',
                                    marginVertical: 15,
                                    padding: 0,
                                    width: layout.width / 4,
                                    textAlign: "center",
                                }}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    );
                })
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sectionTitle: {
        fontSize: 18,
        color: 'black',
        fontWeight: "bold",
        marginLeft: '5%',
        marginTop: '5%'
    },
    textInput:{
        width: '95%',
        height: 35,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 7,
        marginLeft: '2.5%',
        marginTop: 5
    },
    orangeBox:{
        flexDirection: 'row',
        width: '95%',
        borderRadius: 7,
        backgroundColor: '#FFF0CA',
        marginLeft: '2.5%',
        marginTop: 25,
        marginBottom: 10
    },
    tabView: {
        height: 200, 
        marginTop: 10, 
        width: '95%',
        marginLeft: '2.5%',
        //borderRadius: 15,
        borderColor: '#e6e6e6', 
        //borderWidth: 2, 
    },
    buttonStyle: {
        backgroundColor: '#F8931D',
        borderColor: '#F8931D',
        borderWidth: 2,
        width: '50%',
        marginLeft: '2.5%',
        marginTop: 7.5,
        marginBottom: 7.5,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default TicketList