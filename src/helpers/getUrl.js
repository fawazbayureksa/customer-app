
export default getUrl = url => {
    if (url.includes('http')) {
      return url;
    } else {
      return `https://${url}`;
    }
  };
  