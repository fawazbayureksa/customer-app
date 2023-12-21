import { CloseCircle } from 'iconsax-react-native';
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';


const ModalDialog = ({ showModal, setShowModal, content, header }) => {

    const windowHeight = Dimensions.get('window').height;
    const WIDTH = Dimensions.get('window').width * 0.95;
    return (
        <Modal
            isVisible={showModal}
            onBackdropPress={() => setShowModal(false)}
        >
            <View
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    paddingVertical: 16,
                    paddingHorizontal: 14,
                    maxHeight: windowHeight * 0.5,
                }}>
                <View
                    style={{
                        marginBottom: 5,
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#000"
                        }}
                    >
                        {header}
                    </Text>
                    <TouchableOpacity onPress={() => setShowModal(false)}>
                        <CloseCircle
                            size={20}
                            color="#000"
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    {content}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({})

export default ModalDialog;
