const convertCSS = (css, WIDTH) => {
  if (typeof css != 'number') {
    if (css && css.includes('%')) {
      // return (getNumber(css) * WIDTH) / 100;
      return css;
    } else if (css && /\d/.test(css)) {
      return getNumber(css);
    } else if (css && css.indexOf('%^') > -1) {
      return css;
    } else if (css == 'auto') {
      return '100%';
    }
  } else {
    return css;
  }
};

const getNumber = string => {
  return parseInt(string.replace(/\D/g, ''));
};

export default convertCSS;


