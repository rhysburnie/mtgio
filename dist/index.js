import 'isomorphic-fetch';

// NOTE
// This function is only used to coerce a string number
// into an integer or null if undefined or not a number
// Don't use it for number operations (use Math functions)

function ensureIntegerOrNull(num) {
  var int = parseInt(num, 10);
  if (isNaN(int)) int = null;
  return int;
}

// Converts the strange formatted pagination
// "link" strings to a consumable pojo

/**
 * @param {String} str
 * @return {Object}
 */
function extractPaginationLinks(str) {
  var links = {};
  if (typeof str === 'string' && str[0] === '<') {
    str.split(',').forEach(function (link) {
      var extract = /<(.*)>; rel="(.*)"/.exec(link);
      if (extract && extract.length === 3) {
        links[extract[2]] = extract[1];
      }
    });
  }
  return links;
}

function catchError() {
  var reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var status = reason.status,
      error = reason.error;

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
  return Promise.reject({ status: status, error: error });
}

// Extracts the additional data the api
// places in the header instead of the body

/**
 * @param {Promise} a fetch response (promise)
 * @param {Promise} a new promise resolved with an object containing { data, meta }
 */
function extractHeaderMeta(response) {
  return response.json().then(function (data) {
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
        ratelimitRemaining: ensureIntegerOrNull(response.headers.get('ratelimit-remaining'))
      }
    }));
  });
}

function objectToURIParams(obj, format) {
  var p = Object.keys(obj).map(function (key) {
    return key + '=' + encodeURIComponent(obj[key]);
  });
  if (format === '?') {
    return '?' + p.join('&');
  }
  return p;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var ROOT_URI = 'https://api.magicthegathering.io/v1';

var getRootURI = function getRootURI() {
  return ROOT_URI;
};

// only this utility is useful externally but not required
var utilities = {
  objectToURIParams: objectToURIParams
};

var RECOMMEND_GET_CARDS = '\nUse getCards({ id }) or getCards({ multiverseid }) instead:\nthat way you can use the same template logic expecing an array at all times.\ngetCards will contain a .cards array with one item.\n';

var RECOMMEND_GET_SETS = '\nUse getSets({ code }) instead:\nthat way you can use the same template logic expecing an array at all times.\ngetSets will contain a .sets array with one item.\n';

// =====
// CARDS
// =====

function getCardsURI() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var uri = ROOT_URI + '/cards';
  if (typeof options === 'string') {
    // NB: this is for pagination links
    uri = options;
  } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
    var keysLength = Object.keys(options).length;
    if (keysLength === 1 && (options.multiverseid || options.id)) {
      uri = uri + '/' + (options.multiverseid || options.id);
    } else if (keysLength) {
      uri = '' + uri + objectToURIParams(options, '?');
    }
  }
  return uri;
}

function getCards() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return fetch(getCardsURI(options)).catch(catchError).then(extractHeaderMeta).then(function (result) {
    if (result.card) {
      // for consistency also return a `cards` Array
      // when a by `id` / `multiverseid` serach made
      /* eslint-disable no-param-reassign */
      result.cards = [Object.assign({}, result.card)];
      result.card.DEPRECATED = RECOMMEND_GET_CARDS;
      /* eslint-enable no-param-reassign */
    }
    return result;
  });
}

// NOTE this exists only to be consistent with the remote api.
//      RECOMMEND USE `getCards` INSTEAD

function getCard(id) {
  var options = {};
  // determine if id is multiverseid format or id (hash)
  if (!isNaN(id)) {
    options.multiverseid = id;
  } else {
    options.id = id; // just asume a hash here
  }
  return fetch(getCardsURI(options)).catch(catchError).then(extractHeaderMeta).then(function (result) {
    /* eslint-disable no-param-reassign */
    result.NOTE = RECOMMEND_GET_CARDS;
    /* eslint-enable no-param-reassign */
    return result;
  });
}

// ====
// SETS
// ====

function getSetsURI() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var uri = ROOT_URI + '/sets';
  var params = [];
  if (options.name) {
    params.push('name=' + encodeURIComponent(Array.isArray(options.name) ? options.name.join('|') : options.name));
  }
  if (options.block) {
    params.push('block=' + encodeURIComponent(Array.isArray(options.block) ? options.block.join('|') : options.block));
  }
  if (params.length) {
    uri = ROOT_URI + '/sets?' + params.join('&');
  }
  if (typeof options.code === 'string') {
    uri = ROOT_URI + '/sets/' + options.code;
  }
  return uri;
}

function getSets() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return fetch(getSetsURI(options)).catch(catchError).then(extractHeaderMeta).then(function (result) {
    if (result.set) {
      // for consistency also return a `sets` Array
      // when a by `code` serach made
      /* eslint-disable no-param-reassign */
      result.sets = [Object.assign({}, result.set)];
      result.set.DEPRECATED = RECOMMEND_GET_SETS;
      /* eslint-enable no-param-reassign */
    }
    return result;
  });
}

// NOTE this exists only to be consistent
//      with the remote api.
//      RECOMMEND USE `getSets({ code })` INSTEAD

function getSet(code) {
  return fetch(getSetsURI({ code: code })).catch(catchError).then(extractHeaderMeta).then(function (result) {
    /* eslint-disable no-param-reassign */
    result.NOTE = RECOMMEND_GET_SETS;
    /* eslint-enable no-param-reassign */
    return result;
  });
}

// =======
// BOOSTER
// =======

var getBoosterURI = function getBoosterURI(code) {
  return ROOT_URI + '/sets/' + code + '/booster';
};

function getBooster(code) {
  return fetch(getBoosterURI(code)).catch(catchError).then(extractHeaderMeta);
}

// =====
// TYPES
// =====

var getTypesURI = function getTypesURI() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'types';
  return ROOT_URI + '/' + type;
};

function getTypes() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'types';

  return fetch(getTypesURI(type)).catch(catchError).then(extractHeaderMeta);
}

// =======
// FORMATS
// =======

var getFormatsURI = function getFormatsURI() {
  return ROOT_URI + '/formats';
};

function getFormats() {
  return fetch(getFormatsURI()).catch(catchError).then(extractHeaderMeta);
}

export { getRootURI, utilities, getCardsURI, getCards, getCard, getSetsURI, getSets, getSet, getBoosterURI, getBooster, getTypesURI, getTypes, getFormatsURI, getFormats };
//# sourceMappingURL=index.js.map
