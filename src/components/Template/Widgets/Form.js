import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../helpers/axiosInstance';
import FormComponents from './FormComponents';
import convertCSS from '../../../helpers/convertCSS';

export default function Form({ data }) {
  const [form, setForm] = useState({});
  const [componentValues, setComponentValues] = useState({});
  const [sections, setSections] = useState([]);

  useEffect(() => {
    getForm();
  }, []);

  const getForm = () => {
    let params = {
      cms_form_id: data.value.cms_form_id,
    };
    axiosInstance
      .get('cms/getFormWithComponents', { params })
      .then(response => {
        let component_values_temp = {};
        let sections = [];
        if (response.data.data && response.data.data.sections) {
          response.data.data.sections.forEach(section => {
            if (JSON.parse(section?.style).visibility_mobile == true) {
              sections.push(section);
              section.rows.forEach(row => {
                row.columns.forEach(column => {
                  column.components.forEach(component => {
                    if (component.setting_value !== '')
                      component.setting_value =
                        JSON.parse(component.setting_value) || {};
                    if (component.style !== '')
                      component.style = JSON.parse(component.style) || {};
                    component_values_temp[component.id] = {
                      value: '',
                      setting_value: component.setting_value,
                      type: component.type,
                    };
                  });
                  column.style = JSON.parse(column.style) || {};
                });
                row.style = JSON.parse(row.style) || {};
              });
            }
            section.style = JSON.parse(section.style) || {};
          });
          response.data.data.appearance =
            JSON.parse(response.data.data.appearance) || {};
        }
        setForm(response.data.data);
        setComponentValues(component_values_temp);
        setSections(sections);
      })
      .catch(error => {
        console.error('error getFormWithComponents: ', error.response.data);
      });
  };

  const getValue = (id, value) => {
    console.log('value: ', value);
    console.log('id: ', id);
  };

  return (
    <View style={{ padding: 5 }}>
      <View style={{ marginVertical: 5 }}>
        <Text style={{ fontWeight: '500' }}>{form.title}</Text>
      </View>
      {sections &&
        sections.map((section, index) => {
          return (
            <View
              key={index}
              style={{
                backgroundColor: section.style.background_transparent === 'color'
                  ? section.style.background_color
                    ? section.style.background_color
                    : 'transparent'
                  : 'transparent',
                height: convertCSS(section.style.height),
                borderRadius: 3,
                marginTop: convertCSS(section.style.margin_top),
                marginRight: convertCSS(section.style.margin_right),
                marginBottom: convertCSS(section.style.margin_bottom),
                marginLeft: convertCSS(section.style.margin_left),
              }}>
              {section &&
                section.rows.map((row, index) => {
                  return (
                    <View key={index}>
                      <View
                        style={{
                          paddingTop: convertCSS(row.style.padding_top),
                          paddingRight: convertCSS(row.style.padding_right),
                          paddingBottom: convertCSS(row.style.padding_bottom),
                          paddingLeft: convertCSS(row.style.padding_left),
                          // marginTop: convertCSS(row.style.margin_top),
                          marginRight: convertCSS(row.style.margin_right),
                          // marginBottom: convertCSS(row.style.margin_bottom),
                          marginLeft: convertCSS(row.style.margin_left),
                          width: '100%',
                        }}>
                        {row &&
                          row.columns.map((column, index) => {
                            return (
                              <View
                                key={index}
                                style={{
                                  flex: 1,
                                  paddingTop: convertCSS(
                                    column.style?.padding_top,
                                  ),
                                  paddingRight: convertCSS(
                                    column.style?.padding_right,
                                  ),
                                  paddingBottom: convertCSS(
                                    column.style?.padding_bottom,
                                  ),
                                  paddingLeft: convertCSS(
                                    column.style?.padding_left,
                                  ),
                                  alignItems: column.style?.column_alignment,
                                }}>
                                {column &&
                                  column.components.map((component, index) => {
                                    return (
                                      <View key={index}>
                                        <FormComponents
                                          getValue={getValue}
                                          component={component}
                                          appearance={form.appearance}
                                        />
                                      </View>
                                    );
                                  })}
                              </View>
                            );
                          })}
                      </View>
                    </View>
                  );
                })}
            </View>
          );
        })}
    </View>
  );
}
