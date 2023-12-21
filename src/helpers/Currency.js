const Currency = number => {
  if (number !== undefined) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.');
  } else {
    return;
  }
};

export default Currency;
