import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {CalendarSearch, Clock} from 'iconsax-react-native';
import moment from 'moment';
import convertCSS from '../../../../helpers/convertCSS';

const WIDTH = Dimensions.get('window').width;

export default function DateTime({data, appearance, getValue}) {
  const [isDatePickerVisible, setIsDatePickerVisible] = React.useState(false);
  const [date, setDate] = React.useState();

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleDatePicker = date => {
    setDate(date);
    hideDatePicker();
  };
  return (
    <View>
      <TouchableOpacity
        style={{
          height: 48,
          borderRadius: convertCSS(appearance.field_border_radius),
          width: WIDTH * 0.8,
          paddingHorizontal: 10,
          marginTop: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: appearance.field_text_color || '#000000',
          backgroundColor: appearance.field_background_color || '#FFFFFF',
          borderColor: appearance.field_border_color || '#000000',
          borderWidth: 1,
        }}
        onPress={showDatePicker}>
        {date ? (
          <Text style={{fontWeight: '600'}}>
            {moment(date).format('DD MMMM YYYY')}
          </Text>
        ) : (
          <Text style={{color: 'grey'}}>{data.setting_value.placeholder}</Text>
        )}
        <CalendarSearch size="28" color="#303030" />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDatePicker}
        onCancel={hideDatePicker}
      />
    </View>
  );
}
