function catchError(reason = {}) {
  let {
    status,
    error,
  } = reason;
  if (typeof status === 'undefined') {
    status = '500'; // string to be consistent with enpoint
  }
  if (typeof error === 'undefined') {
    error = 'Internal Server Error';
  }
  if (error === 'not-found') {
    status = '404'; // string to be consistent with enpoint
    error = 'Not Found';
  }
  return Promise.reject({ status, error });
}
export default catchError;
