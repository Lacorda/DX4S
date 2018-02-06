function getParam(url, name) {
  let aParams;
  if (url.indexOf('?') !== -1) {
    const searchString = url.split('?')[1];
    if (searchString.indexOf(`${name}=`) !== -1) {
      aParams = searchString.split('&');
      for (let i = 0; i < aParams.length; i += 1) {
        if (aParams[i].split('=')[0] === name) {
          return aParams[i].split('=')[1];
        }
      }
      return null;
    }
  }
  return null;
}

export default function getURLParam(name) {
  return getParam(window.location.search, name);
}
