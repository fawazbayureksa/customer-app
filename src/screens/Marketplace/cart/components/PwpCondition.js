import {
    View,
    Text,
    Dimensions
} from 'react-native';
import React from 'react';
import colors from '../../../../assets/theme/colors';

const WIDTH = Dimensions.get('window').width;

export default function ContainerProducts({ children }) {
    return (
        <View>
            <View
                style={{
                    borderColor: colors.bgColor,
                    marginTop: !data.product.mp_product.mp_product_pwp_detail ? 0 : 10,
                    borderTopWidth: !data.product.mp_product.mp_product_pwp_detail ? 0 : 5,
                    borderLeftWidth: !data.product.mp_product.mp_product_pwp_detail ? 0 : 1,
                    borderRightWidth: !data.product.mp_product.mp_product_pwp_detail ? 0 : 1,
                    borderBottomWidth: !data.product.mp_product.mp_product_pwp_detail ? 0 : 1,
                    backgroundColor: !data.product.mp_product.mp_product_pwp_detail ? '' : colors.bgColor
                }}
            >
                <Text>PWP Discount</Text>
            </View>
            {children}
        </View>
    );
}

const getPercentDiscount = (price, discount) => {
    return `${Math.floor(100 - (price * 100) / discount)}%`;
};
