import moment from 'moment';

export default convertDate = (startDate, endDate) => {
  let converted = '';

  converted = `${moment(startDate).format('HH:mm')}-${moment(endDate).format(
    'HH:mm',
  )}`;
  return converted;
};
