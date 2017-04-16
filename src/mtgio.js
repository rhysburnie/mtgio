import 'isomorphic-fetch';
import extractHeaderMeta from './utilities/extractHeaderMeta';
import objectToURIParams from './utilities/objectToURIParams';

const ROOT_URI = 'https://api.magicthegathering.io/v1';

export const getRootURI = () => ROOT_URI;

// only this utility is useful externally but not required
export const utilities = {
  objectToURIParams,
};

const catchError = error => Promise.reject({ error });

const RECOMMEND_GET_CARDS = `
Use getCards({ id }) or getCards({ multiverseid }) instead:
that way you can use the same template logic expecing an array at all times.
getCards will contain a .cards array with one item.
`;

const RECOMMEND_GET_SETS = `
Use getSets({ code }) instead:
that way you can use the same template logic expecing an array at all times.
getSets will contain a .sets array with one item.
`;

// =====
// CARDS
// =====

export function getCardsURI(options = {}) {
  let uri = `${ROOT_URI}/cards`;
  if (typeof options === 'string') {
    // NB: this is for pagination links
    uri = options;
  } else if (typeof options === 'object') {
    const keysLength = Object.keys(options).length;
    if (keysLength === 1 && (options.multiverseid || options.id)) {
      uri = `${uri}/${(options.multiverseid || options.id)}`;
    } else if (keysLength) {
      uri = `${uri}${objectToURIParams(options, '?')}`;
    }
  }
  return uri;
}

export function getCards(options = {}) {
  return fetch(getCardsURI(options))
  .catch(catchError)
  .then(extractHeaderMeta)
  .then((result) => {
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

export function getCard(id) {
  const options = {};
  // determine if id is multiverseid format or id (hash)
  if (!isNaN(id)) {
    options.multiverseid = id;
  } else {
    options.id = id; // just asume a hash here
  }
  return fetch(getCardsURI(options))
  .catch(catchError)
  .then(extractHeaderMeta)
  .then((result) => {
    /* eslint-disable no-param-reassign */
    result.NOTE = RECOMMEND_GET_CARDS;
    /* eslint-enable no-param-reassign */
    return result;
  });
}

// ====
// SETS
// ====

export function getSetsURI(options = {}) {
  let uri = `${ROOT_URI}/sets`;
  const params = [];
  if (options.name) {
    params.push(`name=${encodeURIComponent(Array.isArray(options.name) ? options.name.join('|') : options.name)}`);
  }
  if (options.block) {
    params.push(`block=${encodeURIComponent(Array.isArray(options.block) ? options.block.join('|') : options.block)}`);
  }
  if (params.length) {
    uri = `${ROOT_URI}/sets?${params.join('&')}`;
  }
  if (typeof options.code === 'string') {
    uri = `${ROOT_URI}/sets/${options.code}`;
  }
  return uri;
}

export function getSets(options = {}) {
  return fetch(getSetsURI(options))
    .catch(catchError)
    .then(extractHeaderMeta)
    .then((result) => {
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

export function getSet(code) {
  return fetch(getSetsURI({ code }))
  .catch(catchError)
  .then(extractHeaderMeta)
  .then((result) => {
    /* eslint-disable no-param-reassign */
    result.NOTE = RECOMMEND_GET_SETS;
    /* eslint-enable no-param-reassign */
    return result;
  });
}

// =======
// BOOSTER
// =======

export const getBoosterURI = code => `${ROOT_URI}/sets/${code}/booster`;

export function getBooster(code) {
  return fetch(getBoosterURI(code))
  .catch(catchError)
  .then(extractHeaderMeta);
}

// =====
// TYPES
// =====

export const getTypesURI = (type = 'types') => `${ROOT_URI}/${type}`;

export function getTypes(type = 'types') {
  return fetch(getTypesURI(type))
    .catch(catchError)
    .then(extractHeaderMeta);
}


// =======
// FORMATS
// =======

export const getFormatsURI = () => `${ROOT_URI}/formats`;

export function getFormats() {
  return fetch(getFormatsURI())
    .catch(catchError)
    .then(extractHeaderMeta);
}
