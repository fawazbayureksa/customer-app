import {View, Text} from 'react-native';
import React from 'react';
import TextForm from './forms/TextForm';
import TextArea from './forms/TextArea';
import Select from './forms/Select';
import convertCSS from '../../../helpers/convertCSS';
import Notice from './Notice';
import CheckboxComponent from './forms/Checkbox';
import DateTime from './forms/DateTime';
import Submit from './forms/Submit';

export default function FormComponents({component, appearance, getValue}) {
  const getComponent = () => {
    if (
      component.type === 'text' ||
      component.type === 'phone_number' ||
      component.type === 'email' ||
      component.type === 'number'
    ) {
      return (
        <TextForm
          data={component}
          appearance={appearance}
          getValue={getValue}
        />
      );
    } else if (component.type === 'text_area') {
      return (
        <TextArea
          data={component}
          appearance={appearance}
          getValue={getValue}
        />
      );
    } else if (component.type === 'select') {
      return (
        <Select data={component} appearance={appearance} getValue={getValue} />
      );
    } else if (component.type === 'notice') {
      return <Notice component={component.setting_value} />;
    } else if (component.type === 'checkbox') {
      return (
        <CheckboxComponent
          data={component}
          appearance={appearance}
          getValue={getValue}
        />
      );
    } else if (component.type === 'date') {
      return (
        <DateTime
          data={component}
          appearance={appearance}
          getValue={getValue}
        />
      );
    } else if (component.type === 'submit') {
      return (
        <View style={{justifyContent: 'center', alignItems:'center', flex:1}}>
          <Submit
            data={component}
            appearance={appearance}
            getValue={getValue}
          />
        </View>
      );
    } else {
      return <Text>{component.type}</Text>;
    }
  };
  return (
    <View
      style={{
        marginVertical: 6,
        width: '100%',
      }}>
      {appearance.label_position === 'above' && component.setting_value.label && (
        <Text
          style={{
            color: appearance.field_label_color,
            marginBottom: convertCSS(appearance.form_group_margin_bottom),
          }}>
          {component.setting_value.label}
          {component.setting_value.required_field && (
            <Text style={{color: 'red'}}>*</Text>
          )}
        </Text>
      )}
      {getComponent()}
      {appearance.label_position === 'below' && component.setting_value.label && (
        <Text
          style={{
            color: appearance.field_label_color,
            marginBottom: convertCSS(appearance.form_group_margin_bottom),
          }}>
          {component.setting_value.label}
          {component.setting_value.required_field && (
            <Text style={{color: 'red'}}>*</Text>
          )}
        </Text>
      )}
    </View>
  );
}
