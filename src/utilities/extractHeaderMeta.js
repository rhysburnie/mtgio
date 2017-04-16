// Extracts the additional data the api
// places in the header instead of the body

import ensureIntegerOrNull from './ensureIntegerOrNull';
import extractPaginationLinks from './extractPaginationLinks';
import catchError from './catchError';

/**
 * @param {Promise} a fetch response (promise)
 * @param {Promise} a new promise resolved with an object containing { data, meta }
 */
function extractHeaderMeta(response) {
  return response.json().then((data) => {
    if (data.error) {
      return catchError(data);
    }
    return Promise.resolve(Object.assign(data, {
      meta: {
        links: extractPaginationLinks(response.headers.get('link')),
        pageSize: ensureIntegerOrNull(response.headers.get('page-size')),
        count: ensureIntegerOrNull(response.headers.get('count')),
        totalCount: ensureIntegerOrNull(response.headers.get('total-count')),
        ratelimitLimit: ensureIntegerOrNull(response.headers.get('ratelimit-limit')),
        ratelimitRemaining: ensureIntegerOrNull(response.headers.get('ratelimit-remaining')),
      },
    }));
  });
}

export default extractHeaderMeta;
