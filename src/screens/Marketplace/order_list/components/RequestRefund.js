import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import CustomButton from '../../../../components/CustomButton'
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { Divider } from '../../../../components/Divider';
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../../../../assets/theme/colors';
import axiosInstance from '../../../../helpers/axiosInstance';
import IsEmpty from '../../../../helpers/IsEmpty';
import { useToast } from 'react-native-toast-notifications';

export default function RequestRefund({ data, refresh }) {
    const { t } = useTranslation();
    const [showModalRefund, setShowModalRefund] = useState(false);
    const toast = useToast();

    const [bankItems, setBankItems] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [bankValue, setBankValue] = useState();
    const [accountName, setAccountName] = useState('');
    const [errors, setErrors] = useState({});
    const [accountNumber, setAccountNumber] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        getBank();
    }, []);

    useEffect(() => {
        if (!bankItems || bankItems.length === 0) return
        getLastRefundReceiver()
    }, [bankItems]);

    const getBank = () => {
        axiosInstance
            .get(`my-orders/getBanks`)
            .then(res => {
                let data = res.data.data;
                setBankItems(convertToDropdown(data));
            })
            .catch(error => {
                console.error('error getBank', error.response.data);
            });
    };

    const getLastRefundReceiver = () => {
        axiosInstance
            .get(`my-orders/getLastRefundReceiver`)
            .then(res => {
                let data = res.data.data;
                bankItems.find(x => {
                    if (x.value === data.mp_bank_id) {
                        setBankValue(data.mp_bank_id)
                    }
                })
                setAccountName(data.account_name)
                setAccountNumber(data.account_number)
            })
            .catch(error => {
                console.error('error getLastRefundReceiver', error.response.data);
            });
    };

    const validate = () => {
        let newErrors = {};
        if (IsEmpty(bankValue)) {
            newErrors.bank = t('common:selectBank');
        }
        if (IsEmpty(accountName)) {
            newErrors.accountName = t('common:fillAccountName');
        }
        if (IsEmpty(accountNumber)) {
            newErrors.accountNumber = t('common:fillAccountNumber');
        }
        if (IsEmpty(notes)) {
            newErrors.notes = t('common:fillNotes');
        }
        return newErrors;
    };

    const convertToDropdown = data => {
        let converted = [];

        data.forEach(item => {
            converted.push({
                value: item.id,
                label: item.name,
                data: item,
            });
        });
        return converted;
    };

    const submitRefund = () => {
        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            setErrors({});
            let datas = {
                notes: notes,
                order_code: data.order_code,
                receiver: {
                    bank_id: bankValue,
                    account_name: accountName,
                    account_number: accountNumber,
                }
            }
            console.log(datas);
            axiosInstance
                .post(`my-orders/requestRefund`, datas)
                .then(res => {
                    refresh()
                    setShowModalRefund(false)
                })
                .catch(error => {
                    if (error?.response?.data) {
                        toast.show(error?.response?.data?.message, {
                            placement: 'top',
                            type: 'danger',
                            animationType: 'zoom-in',
                            duration: 3000,
                        });
                    }
                    setShowModalRefund(false)
                    console.error('error onSubmit', error.response.data.message);
                })
        }
    }

    return (
        <>
            <CustomButton
                style={{
                    height: 40,
                    width: '100%',
                    alignSelf: 'center',
                    marginTop: 5,
                    borderRadius: 5,
                }}
                onPress={() => setShowModalRefund(true)}
                secondary
                border
                title={t('common:requestRefund')}
            />
            <Modal isVisible={showModalRefund}>
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        paddingVertical: 16,
                        paddingHorizontal: 14,
                    }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>{t('common:requestRefund')} {data.order_code}</Text>
                    <Divider />

                    <View style={styles.container}>
                        <Text>Bank</Text>
                        <DropDownPicker
                            zIndex={1000}
                            open={openDropdown}
                            items={bankItems}
                            setOpen={setOpenDropdown}
                            value={bankValue}
                            setValue={setBankValue}
                            listMode="SCROLLVIEW"
                            scrollViewProps={{
                                nestedScrollEnabled: true,
                            }}
                            style={{
                                borderWidth: 1,
                                width: '100%',
                                borderColor: colors.pasive,
                            }}
                            dropDownContainerStyle={{
                                borderWidth: 1,
                                width: '100%',
                                height: 140,
                                borderColor: colors.pasive,
                            }}
                        />
                        {errors.bank !== '' && (
                            <Text style={{ color: colors.danger }}>{errors.bank}</Text>
                        )}
                    </View>
                    <View style={styles.container}>
                        <Text>Account Name</Text>
                        <TextInput
                            style={{
                                color: '#000',
                                borderWidth: 1,
                                borderColor: colors.pasive,
                                borderRadius: 8,
                            }}
                            value={accountName}
                            onChangeText={text => setAccountName(text)}
                        />
                        {errors.accountName !== '' && (
                            <Text style={{ color: colors.danger }}>
                                {errors.accountName}
                            </Text>
                        )}
                    </View>
                    <View style={styles.container}>
                        <Text>Account Number</Text>
                        <TextInput
                            style={{
                                color: '#000',
                                borderWidth: 1,
                                borderColor: colors.pasive,
                                borderRadius: 8,
                            }}
                            value={accountNumber}
                            onChangeText={text => setAccountNumber(text)}
                        />
                        {errors.accountNumber !== '' && (
                            <Text style={{ color: colors.danger }}>
                                {errors.accountNumber}
                            </Text>
                        )}
                    </View>
                    <View style={styles.container}>
                        <Text>Notes</Text>
                        <TextInput
                            placeholder='Input Notes'
                            multiline
                            numberOfLines={4}
                            style={{
                                textAlignVertical: 'top',
                                color: '#000',
                                borderWidth: 1,
                                borderColor: colors.pasive,
                                borderRadius: 8,
                            }}
                            value={notes}
                            onChangeText={text => setNotes(text)}
                        />
                        {errors.notes !== '' && (
                            <Text style={{ color: colors.danger }}>
                                {errors.notes}
                            </Text>
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <CustomButton
                            onPress={() => setShowModalRefund(false)}
                            style={{
                                height: 40,
                                width: '40%',
                                alignSelf: 'center',
                                marginTop: 5,
                                borderColor: '#000',
                                borderRadius: 5,
                            }}
                            color='#000'
                            secondary
                            border
                            title={t('common:cancel')} />
                        <CustomButton
                            onPress={submitRefund}
                            style={{
                                height: 40,
                                width: '40%',
                                alignSelf: 'center',
                                marginTop: 5,
                                borderColor: 'red',
                                borderRadius: 5,
                            }}
                            primary
                            title={t('common:send')} />
                    </View>

                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: { marginVertical: 3 },
});