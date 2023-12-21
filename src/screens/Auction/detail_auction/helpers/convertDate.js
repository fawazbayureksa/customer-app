import moment from 'moment';

export default convertDate = (startDate, endDate) => {
  let converted = '';

  if (moment(startDate).isSame(moment(endDate), 'd')) {
    converted = moment(endDate).format('DD MMMM YYYY');
  } else if (moment(startDate).isSame(moment(endDate), 'month')) {
    converted = `${moment(startDate).format('DD')}-${moment(endDate).format(
      'DD MMMM YYYY',
    )}`;
  } else {
    converted = `${moment(startDate).format('DD-MM')}-${moment(endDate).format(
      'DD MMMM YYYY',
    )}`;
  }
  return converted;
};
