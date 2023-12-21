import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { API_URL_WS, Origin, WEBSOCKET_TIMEOUT } from '@env';
import { useSelector } from 'react-redux';
import axiosInstance from '../axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebsocketContext, WebsocketPayloadType } from "./WebsocketHelper";

const headers = { Origin: Origin };

const Websocket = ({ children }) => {
    const { navigate } = useNavigation()
    const [val, setVal] = useState(null);
    const [recurringPingTimeout, setRecurringPingTimeout] = useState();
    const [refreshMasterDataTimeout, setRefreshMasterDataTimeout] = useState(null);
    const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
    const [isReady, setIsReady] = useState(false);
    const [currentUser, setCurrentUser] = useState();

    //state variabels
    const [status, setStatus] = useState({
        name: 'OFFLINE',
        color: '#374650'
    });
    const [payload, setPayload] = useState(null);
    const [unread, setUnread] = useState(0);
    const [changeContext, setChangeContext] = useState(() => { });
    var ws = useRef(null);

    // console.log("login?", isLoggedIn)

    useEffect(() => {
        if (isLoggedIn) {
            getMasterData();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
            if (refreshMasterDataTimeout) clearTimeout(refreshMasterDataTimeout)
            if (recurringPingTimeout) clearTimeout(recurringPingTimeout);
        }
    }, []);

    const getMasterData = () => {
        // console.log("websocket master data")
        axiosInstance
            .post('chat/getMasterData')
            .then(res => {
                setUnread(res.data.data.unread)
                // console.log(res.data.data.unread)
                openWebsocket(res.data.data.websocketToken)
                getUser();
            }).catch((error) => {
                console.log(error)
                if (error.response) {
                    console.log("Error GetMasterChat -> ", error.response.data.message)
                }

                refreshMasterData()
            }).finally(() => {

            })
    }

    const getUser = () => {
        const user = AsyncStorage.getItem('user');
        setCurrentUser(user);
    }

    const openWebsocket = (token) => {
        console.log("Token Websocket-> ", token);
        ws.current = new WebSocket(`${API_URL_WS}chat/openWebsocket/${token}`,
            [],
            {
                'headers': headers
            });

        setStatus({
            name: "Connecting...",
            color: "#0F74BD",
        });

        ws.current.onopen = (event) => {
            console.log("connection establish open")
            setIsReady(true)
            onOpen(event);
        };

        ws.current.onerror = (event) => {

        };

        ws.current.onclose = (event) => {
            console.log("connection establish closed");
            setIsReady(false)
            onClose(event);
        }

        ws.current.onmessage = (event) => {
            console.log("on Message")
            onMessage(event);
        };

        // return () => {
        //     ws.current.close();
        // };
    }

    const onOpen = (event) => {
        console.log("websocket is opened", event)

        setStatus({
            name: "Connected",
            // name: "Online",
            color: "#8CC73F",
        })
        ws.current.send("ping!")
        if (refreshMasterDataTimeout) clearTimeout(refreshMasterDataTimeout)

        if (recurringPingTimeout) clearTimeout(recurringPingTimeout)
        setRecurringPingTimeout(setInterval(() => {
            // console.log('ping');
            // console.log(currentUser);
            ws.current.send("ping!")
        }, 30 * 1000))
    }

    const onError = (event) => {
        setStatus({
            name: "ERROR",
            color: "#EB2424",
        })
        refreshMasterData();
    }

    const onClose = (event) => {
        console.log("websocket is closed", event)
        setStatus({
            name: "Disconnected",
            color: "#EB2424",
        })
        refreshMasterData();
    }

    const onMessage = (event) => {
        if (!isLoggedIn) ws.current.close(); //

        let thisPayload = JSON.parse(event.data)
        console.log('websocket message:', thisPayload);

        setPayload(thisPayload);

        if (thisPayload.type === WebsocketPayloadType.MessageData) {
            // if (thisPayload.data.user_type === 'customer' && thisPayload.data.user_id === currentUser.id) 
            // // if (thisPayload.data.user_type === 'customer')
            // {
            //     // do nothing         
            // } else {
            //     tempUnread = unread + 1;
            //     setUnread(tempUnread)
            //     // this.setState({
            //     //     contextData: update(this.state.contextData, {
            //     //         unread: { $apply: (original) => original + 1 }
            //     //     })
            //     // })
            // }

        }
    }

    const refreshMasterData = () => {
        if (refreshMasterDataTimeout) clearTimeout(refreshMasterDataTimeout)
        setRefreshMasterDataTimeout(setTimeout(() => {
            getMasterData()
        }, parseInt(WEBSOCKET_TIMEOUT)));

        if (recurringPingTimeout) clearTimeout(recurringPingTimeout)
    }

    const ret = [isReady, ws.current?.send.bind(ws.current), status, payload, ws, unread, changeContext];
    return (
        <WebsocketContext.Provider value={ret}>
            {children}
        </WebsocketContext.Provider>
    )
}

export default Websocket