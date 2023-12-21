import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import WebDisplay from '../../../Forum/components/WebDisplay';

const TabInformation = ({ infromation }) => {
    return (
        <View style={{ marginHorizontal: 10, marginTop: 3, width: "95%" }}>
            <WebDisplay
                html={infromation[0].content}
            />
        </View>
    );
}

const styles = StyleSheet.create({})

export default TabInformation;
