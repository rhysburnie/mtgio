function objectToURIParams(obj, format) {
  const p = Object.keys(obj).map(key => `${key}=${encodeURIComponent(obj[key])}`);
  if (format === '?') {
    return `?${p.join('&')}`;
  }
  return p;
}

export default objectToURIParams;
