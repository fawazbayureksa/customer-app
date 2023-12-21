import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import SelectBox from 'react-native-multi-selectbox'

export default function SelectCategory({ listCategories, selectedCategory, onMultiChange }) {

    return (
        <View style={{ marginVertical: 10 }}>
            <SelectBox
                listOptionProps={{ nestedScrollEnabled: true }}
                label=""
                options={listCategories}
                selectedValues={selectedCategory}
                onMultiSelect={onMultiChange()}
                onTapClose={onMultiChange()}
                isMulti
                hideInputFilter
            />
        </View>
    )
}