import React from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import colors from '../../assets/theme/colors';
import styles from './styles';
import {useSelector} from 'react-redux';

const CustomButton = ({
  title,
  secondary,
  primary,
  border,
  danger,
  disabled,
  loading,
  onPress,
  style,
  small,
  color,
}) => {
  const themeSetting = useSelector(
    state => state.themeReducer.themeSetting.theme,
  );

  const getBgColor = () => {
    if (disabled) {
      return colors.grey;
    }
    if (primary) {
      return themeSetting?.accent_color?.value;
    }
    if (danger) {
      return colors.danger;
    }

    if (secondary) {
      return colors.white;
    }
  };
  const getBorderColor = () => {
    if (primary) {
      return colors.secondary;
    }
    if (danger) {
      return colors.danger;
    }

    if (secondary) {
      return themeSetting?.accent_color?.value;
    }
  };
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.wrapper,
        {
          backgroundColor: getBgColor(),
          borderColor: getBorderColor(),
          borderWidth: border ? 1 : 0,
          shadowColor: '#000',
        },
        !secondary
          ? {
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 4,
            }
          : null,
        style,
      ]}>
      <View style={[styles.loaderSection]}>
        {loading && (
          <ActivityIndicator color={primary ? colors.white : colors.primary} />
        )}
        {title && (
          <Text
            style={{
              fontWeight: '500',
              fontSize: !small ? 16 : 14,
              color: disabled
                ? '#fff'
                : color
                ? color
                : primary
                ? colors.white
                : themeSetting?.accent_color?.value,
              paddingLeft: loading ? 5 : 0,
            }}>
            {loading ? 'Harap Menunggu...' : title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
