export const paymentMethodOptions = [
  {
    key: 'credit_card',
    filename: require('../../../assets/images/payment_methods/CREDITCARD.png'),
  },
  {
    group: 'va',
    items: [
      {
        key: 'bca_va',
        filename: require('../../../assets/images/payment_methods/BCA.png'),
      },
      {
        key: 'echannel',
        filename: require('../../../assets/images/payment_methods/MANDIRI.png'),
      },
      {
        key: 'bni_va',
        filename: require('../../../assets/images/payment_methods/BNI.png'),
      },
      {
        key: 'permata_va',
        filename: require('../../../assets/images/payment_methods/PERMATA.png'),
      },
      {
        key: 'bri_va',
        filename: require('../../../assets/images/payment_methods/BRI.png'),
      },
      {
        key: 'other_va',
        filename: require('../../../assets/images/payment_methods/ATM_BERSAMA.png'),
      },
    ],
  },
  {
    key: 'gopay',
    filename: require('../../../assets/images/payment_methods/GOPAY_QRIS.png'),
  },
  {
    group: 'instant_debit',
    items: [
      {
        key: 'bca_klikpay',
        filename: require('../../../assets/images/payment_methods/BCA_KLIKPAY.png'),
      },
      {
        key: 'cimb_clicks',
        filename: require('../../../assets/images/payment_methods/OCTO.png'),
      },
      {
        key: 'danamon_online',
        filename: require('../../../assets/images/payment_methods/DANAMON.png'),
      },
    ],
  },
  {
    group: 'cstore',
    items: [
      {
        key: 'indomaret',
        filename: require('../../../assets/images/payment_methods/INDOMARET.png'),
      },
      {
        key: 'alfamart',
        filename: require('../../../assets/images/payment_methods/ALFAGROUP.png'),
      },
    ],
  },
  {
    group: 'cardless_credit',
    items: [
      {
        key: 'akulaku',
        filename: require('../../../assets/images/payment_methods/AKULAKU.png'),
      },
    ],
  },
  {
    key: 'manual',
    filename: require('../../../assets/images/payment_methods/MANUAL_TRANSFER.png'),
  },
];

export const BankAccounts = {
  'bca.png': require('../../../assets/images/banks/bca.png'),
  'bni.png': require('../../../assets/images/banks/bni.png'),
  'bri.png': require('../../../assets/images/banks/bri.png'),
  'btpn.png': require('../../../assets/images/banks/btpn.png'),
  'cimb.png': require('../../../assets/images/banks/cimb.png'),
  'mandiri.png': require('../../../assets/images/banks/mandiri.png'),
  'uob.png': require('../../../assets/images/banks/uob.png'),
};

export const optionExpertiseLevel = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

export const optionEventType = [
  { value: 'online', label: 'Online' },
  { value: 'onsite', label: 'Onsite' }
];

export const optionStatusPayment = [
  { value: 'complete', label: 'Complete' },
  { value: 'expired', label: 'Expired' },
  { value: 'pending', label: 'Pending' }
];

export const optionStatusTicket = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'done', label: 'Done' },
  { value: 'pending', label: 'Pending' }
];

export const paymentStatus = [
  { value: 'complete', label: 'Complete' },
  { value: 'waiting', label: 'Waiting' }
];