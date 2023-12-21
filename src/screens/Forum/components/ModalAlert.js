import React, { useState } from 'react'
import { Dimensions } from 'react-native'
import AwesomeAlert from 'react-native-awesome-alerts';

export default function ModalAlert({ show, message, title }) {
    const WIDTH = Dimensions.get('window').width * 0.95;

    const [showAlert, setShowAlert] = useState(show)


    return (

        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title={title}
            message={message}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            contentContainerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', width: WIDTH, color: "#FFF" }}
        />
    )
}
