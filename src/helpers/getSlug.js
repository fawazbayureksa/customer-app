export default getSlug = url => {
  if (url !== '/') {
    var slug = url.split('/').pop().split(';')[0];
    return slug;
  } else {
    return url;
  }
};
