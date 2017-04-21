import test from 'ava';
import fetchMock from 'fetch-mock';
import {
  getCards,
  getSets,
  getTypes,
  getFormats,
  getBooster,
  /* recommend using getCards / getSets instead */
  getCard,
  getSet,
  /* exposed mainly for testing */
  getCardsURI,
  getSetsURI,
  getTypesURI,
  getFormatsURI,
  getBoosterURI,
} from './mtgio';


test('expected props exist on the `mtgio` export', (t) => {
  t.is(typeof getSets, 'function');
  t.is(typeof getBooster, 'function');
  t.is(typeof getTypes, 'function');
  t.is(typeof getFormats, 'function');
  t.is(typeof getBooster, 'function');
  t.is(typeof getCard, 'function');
  t.is(typeof getSet, 'function');
  t.is(typeof getCardsURI, 'function');
  t.is(typeof getSetsURI, 'function');
  t.is(typeof getTypesURI, 'function');
  t.is(typeof getFormatsURI, 'function');
  t.is(typeof getBoosterURI, 'function');
});

// NOTE
// for tests to the live remote api
// run `(yarn|mpm) run test:remote`
// file: ./mtgio.remoteTest.js

// =====
// CARDS
// =====

test('internal uri constructors work for (cards)', (t) => {
  t.is(typeof getCardsURI, 'function');
  t.is(typeof getCardsURI(), 'string');
});

test('getCards()', async (t) => {
  const uri = getCardsURI();
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ cards: [] }) }, 200);
  await getCards().then((result) => {
    t.true(Array.isArray(result.cards));
    t.is(typeof result.meta, 'object');
  });
  t.true(mock.called(uri));
});

test('getCards() should be able to accept a pagination string', async (t) => {
  const uri = getCardsURI();
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ cards: [] }) }, 200);
  await getCards(uri).then((result) => {
    t.true(Array.isArray(result.cards));
    t.is(typeof result.meta, 'object');
  });
  t.true(mock.called(uri));
});

test('getCards() by id / multiverseid', async (t) => {
  const options = { multiverseid: 4 };
  const uri = getCardsURI(options);
  // NB: DONT ADD cards: [] to the MOCK!
  //     here we need to test its added automatically
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ card: {} }) }, 200);
  await getCards(options).then((result) => {
    t.is(typeof result.card, 'object');
    t.is(typeof result.meta, 'object');
    // `multiverseid / id` serach mode yields `card` from the api
    // we add this to `cards` for consistency
    t.true(Array.isArray(result.cards));
    // should be a copy
    t.not(result.cards[0], result.card, 'should not be same reference');
    t.is(result.cards[0].id, result.card.id, 'should be copy');
  });
  t.true(mock.called(uri));
});

// getCard exists for consistency with remote api
// USE getCards({ id }) INSTEAD
test('getCard(id) NOTE: USE getCards({ id }) INSTEAD', async (t) => {
  const multiverseid = 4;
  const uri = getCardsURI({ multiverseid });
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ card: {} }) }, 200);
  await getCard(multiverseid).then((result) => {
    t.is(typeof result.card, 'object');
    t.is(typeof result.cards, 'undefined');
    t.is(typeof result.NOTE, 'string');
    t.not(result.NOTE.indexOf('getCards'), -1, 'should contain note to use getCards');
  });
  t.true(mock.called(uri));
});

// ====
// SETS
// ====

test('internal uri constructors work for (sets)', (t) => {
  t.is(typeof getSetsURI, 'function');
  t.is(typeof getSetsURI(), 'string');
});

test('getSets()', async (t) => {
  const uri = getSetsURI();
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ sets: [] }) }, 200);
  await getSets().then((result) => {
    t.true(Array.isArray(result.sets));
    t.is(typeof result.meta, 'object');
  });
  t.true(mock.called(uri));
});

test('getSets() by name', async (t) => {
  const options = { name: 'name' };
  const uri = getSetsURI(options);
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ sets: [] }) }, 200);
  await getSets(options).then((result) => {
    t.true(Array.isArray(result.sets));
    t.is(typeof result.meta, 'object');
  });
  t.true(mock.called(uri));
});

test('getSets() by name(s)', async (t) => {
  const options = { name: ['name', 'another'] };
  const uri = getSetsURI(options);
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ sets: [] }) }, 200);
  await getSets(options).then((result) => {
    t.true(Array.isArray(result.sets));
    t.is(typeof result.meta, 'object');
  });
  t.true(mock.called(uri));
});

test('getSets() by block', async (t) => {
  const options = { block: 'block' };
  const uri = getSetsURI(options);
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ sets: [] }) }, 200);
  await getSets(options).then((result) => {
    t.true(Array.isArray(result.sets));
    t.is(typeof result.meta, 'object');
  });
  t.true(mock.called(uri));
});

test('getSets() by block(s)', async (t) => {
  const options = { block: ['block', 'another'] };
  const uri = getSetsURI(options);
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ sets: [] }) }, 200);
  await getSets(options).then((result) => {
    t.true(Array.isArray(result.sets));
    t.is(typeof result.meta, 'object');
  });
  t.true(mock.called(uri));
});

test('getSets() by code', async (t) => {
  const options = { code: 'LEA' };
  const uri = getSetsURI(options);
  // NB: DONT ADD sets: [] to the MOCK!
  //     here we need to test its added automatically
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ set: {} }) }, 200);
  await getSets(options).then((result) => {
    t.true(Array.isArray(result.sets));
    t.is(typeof result.meta, 'object');
    // data sets contains a copy
    t.not(result.sets[0], result.set, 'should not be same reference');
    t.is(result.sets[0].code, result.set.code, 'should be copy');
    // `code` serach mode yields `set` from the api
    // we add this to `sets` for consistency
    t.is(typeof result.set, 'object');
  });
  t.true(mock.called(uri));
});

// getSet exists for consistency with remote api
// USE getSets({ code }) INSTEAD
test('getSet(code) NOTE: USE getSets({ code }) INSTEAD', async (t) => {
  const code = 'LEA';
  const uri = getSetsURI({ code });
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ set: {} }) }, 200);
  await getSet(code).then((result) => {
    t.is(typeof result.set, 'object');
    t.is(typeof result.sets, 'undefined');
    t.is(typeof result.NOTE, 'string');
    t.not(result.NOTE.indexOf('getSets'), -1, 'should contain note to use getSets');
  });
  t.true(mock.called(uri));
});

// =======
// BOOSTER
// =======

test('internal uri constructors work for (booster)', (t) => {
  t.is(typeof getBoosterURI, 'function');
  t.is(typeof getBoosterURI(), 'string');
});

test('getBooster(code)', async (t) => {
  const code = 'LEA';
  const uri = getBoosterURI(code);
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ cards: [] }) }, 200);
  await getBooster(code).then((result) => {
    t.is(typeof result.meta, 'object');
    t.true(Array.isArray(result.cards));
  });
  t.true(mock.called(uri));
});

// =====
// TYPES
// =====

test('internal uri constructors work for (types)', (t) => {
  t.is(typeof getTypesURI, 'function');
  t.is(typeof getTypesURI(), 'string');
});

test('getTypes()', async (t) => {
  const uri = getTypesURI();
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ types: [] }) }, 200);
  await getTypes().then((result) => {
    t.is(typeof result.meta, 'object');
    t.true(Array.isArray(result.types));
  });
  t.true(mock.called(uri));
});

test('getTypes(\'supertypes\')', async (t) => {
  const type = 'supertypes';
  const uri = getTypesURI(type);
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ supertypes: [] }) }, 200);
  await getTypes(type).then((result) => {
    t.is(typeof result.meta, 'object');
    t.true(Array.isArray(result.supertypes));
  });
  t.true(mock.called(uri));
});

test('getTypes(\'subtypes\')', async (t) => {
  const type = 'subtypes';
  const uri = getTypesURI(type);
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ subtypes: [] }) }, 200);
  await getTypes(type).then((result) => {
    t.is(typeof result.meta, 'object');
    t.true(Array.isArray(result.subtypes));
  });
  t.true(mock.called(uri));
});

// =======
// FORMATS
// =======

test('internal uri constructors work for (formats)', (t) => {
  t.is(typeof getFormatsURI, 'function');
  t.is(typeof getFormatsURI(), 'string');
});

test('getFormats()', async (t) => {
  const uri = getFormatsURI();
  const mock = fetchMock.mock(uri, { body: JSON.stringify({ formats: [] }) }, 200);
  await getFormats().then((result) => {
    t.is(typeof result.meta, 'object');
    t.true(Array.isArray(result.formats));
  });
  t.true(mock.called(uri));
});
