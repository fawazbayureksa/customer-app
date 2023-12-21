import { useNavigation } from '@react-navigation/native';
import { TickCircle } from 'iconsax-react-native';
import React from 'react';
import { View, StyleSheet, Modal, Text, Pressable, Dimensions } from 'react-native';

const WIDTH = Dimensions.get('window').width * 0.95;
const CustomAlert = ({ modalVisible, setModalVisible, message }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <Pressable style={[Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop, styles.backdrop]} onPress={() => setModalVisible(false)} />
                    <View style={styles.modalView}>
                        <View>
                            <Text style={styles.textStyle}>
                                <TickCircle
                                    color='#FFF'
                                    size="32"
                                    variant='Bold'
                                />
                            </Text>
                            <Text style={styles.textStyle}>{message}</Text>
                        </View>
                    </View>
                </View>
            </Modal >
        </View>
    );
}



export default CustomAlert;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "rgba(0, 0, 0, 0.63)",
        borderRadius: 10,
        width: WIDTH * 0.8,
        padding: 35,
        alignItems: "center",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    textStyle: {
        color: "#FFF",
        textAlign: "center",
        fontSize: 14,
        lineHeight: 19
    },

    iOSBackdrop: {
        backgroundColor: "#000000",
        opacity: 0.3
    },
    androidBackdrop: {
        backgroundColor: "#000000",
        opacity: 0.5
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
});