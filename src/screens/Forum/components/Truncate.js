import React from 'react';
import { View, StyleSheet } from 'react-native';

const Truncate = str => {
    if (str.length > 200) {
        let removeHtml = str.slice(0, 250).replace(/<[^>]*>?/gm, '');
        let newString = removeHtml.replace(/\\n/g, '');
        return newString + '...';
    } else {
        return str;
    }
};

export default Truncate;
