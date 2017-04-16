import test from 'ava';
import responseItemsShapeTester from './utilities/responseItemsShapeTester';
import {
  getCards,
  getSets,
  getTypes,
  getFormats,
  getBooster,
  /* recommend using getSets instead */
  getCard,
  getSet,
  getRootURI,
} from './mtgio';

// IMPORTANT !!!
// THESE ARE LIVE TESTS
// so if the third party server is down
// they will FAIL - which is GOOD since
// we need to know if it stops working

const CARDS_EXPECTED_ITEM_SHAPE = {
  name: 'string',
  layout: 'string',
  cmc: 'number',
  colors: 'array',
  colorIdentity: 'array',
  type: 'string',
  supertypes: 'array',
  subtypes: 'array',
  types: 'array',
  rarity: 'string',
  set: 'string',
  setName: 'string',
  text: 'string',
  flavor: 'string',
  artist: 'string',
  number: 'string',
  power: 'string',
  toughness: 'string',
  loyalty: 'number',
  // foreignName: 'string', // difficult to test, may be dprecated, may be isolated
  // language: 'string', // difficult to test, may be dprecated, may be isolated
  // gameFormat: 'string', // difficult to test, may be dprecated, may be isolated
  // legality: 'string', // difficult to test, may be dprecated, may be isolated
  id: 'string',
  names: 'array',
  manaCost: 'string',
  multiverseid: 'number',
  variations: 'array',
  imageUrl: 'string',
  // watermark: 'string', // difficult to test, may be dprecated, may be isolated
  border: 'string',
  // timeshifted: 'string', // difficult to test, may be dprecated, may be isolated
  // hand: 'number', // difficult to test, may be dprecated, may be isolated
  // life: 'number', // difficult to test, may be dprecated, may be isolated
  reserved: 'true',
  releaseDate: 'string',
  // starter: 'true', // difficult to test, may be dprecated, may be isolated
  rulings: 'array',
  foreignNames: 'array',
  printings: 'array',
  originalText: 'string',
  originalType: 'string',
  legalities: 'array',
  source: 'string',
};

const SETS_EXPECTED_ITEMS_SHAPE = {
  name: 'string',
  block: 'string',
  code: 'string',
  gathererCode: 'string',
  oldCode: 'string',
  magicCardsInfoCode: 'string',
  releaseDate: 'string',
  border: 'string',
  // expansion: 'string', // documented but not found in any expansion (replaced by type)
  type: 'string', // undocumented (often a type is expansion)
  onlineOnly: 'true',
  booster: 'array',
  mkm_id: 'number', // undocumented,
  mkm_name: 'string', // undocumented
};

// =====
// CARDS
// =====

test('[remote test] getCards()', async (t) => {
  let cards = [];
  const sleep = () => new Promise((resolve) => {
    setTimeout(() => resolve(), 100);
  });

  await getCards().then((result) => {
    t.true(Array.isArray(result.cards));
    cards = cards.concat(result.cards);
  });
  await sleep();
  await getCards({ name: 'Archangel Avacyn' }).then((result) => {
    t.true(Array.isArray(result.cards));
    cards = cards.concat(result.cards);
  });
  await sleep();
  await getCards({ loyalty: 4 }).then((result) => {
    t.true(Array.isArray(result.cards));
    cards = cards.concat(result.cards);
  });
  await sleep();
  await getCards({ setName: 'unglued' }).then((result) => {
    t.true(Array.isArray(result.cards));
    cards = cards.concat(result.cards);
  });
  // check expected structure...
  responseItemsShapeTester(t, cards, CARDS_EXPECTED_ITEM_SHAPE);
});

test('[remote test] getCards() by is / multiverseid', async (t) => {
  const multiverseid = 4;
  let id;

  await getCards({ multiverseid }).then((result) => {
    t.true(Array.isArray(result.cards));
    t.is(typeof result.card, 'object');
    t.is(result.card.multiverseid, multiverseid);
    id = result.card.id;
  });

  await getCards({ id }).then((result) => {
    t.true(Array.isArray(result.cards));
    t.is(typeof result.card, 'object');
    t.is(result.card.multiverseid, multiverseid);
  });
});

test('[remote test] getCards() with filters', async (t) => {
  // these four filters can use lt# lte# gt# gte#
  const options = {
    power: 'gte3',
    toughness: 'lt4',
    cmc: 'gt2',
    pageSize: 20,
  };
  // NOTE `loyalty` can also but if used with power / toughness will return no results
  await getCards(options).then((result) => {
    t.true(result.cards.length > 0);
    result.cards.forEach((card) => {
      t.not(typeof card.power, 'undefined', 'card power should be defined');
      t.not(typeof card.toughness, 'undefined', 'card toughness should be defined');
      t.not(typeof card.cmc, 'undefined', 'card cmc should be defined');
      t.true(card.power >= 3, 'card power should be >= 3');
      t.true(card.toughness < 4, 'card toughness should be < 4');
      t.true(card.cmc > 2, 'card cmc should be > 2');
    });
  });
});

// THERE ARE SO MANY POSSIBLE FILTER COMBOS
// I AM NOT GOUNG TO TEST THEM ALL
// THIS FILE SHOULD JUST MAKE BASIC TESTS
// TO CONFIRM THE REMOTE API SEEMS TO BE WORKING

// .card exists for consistency with remote api
// USE .cards({ multiverseid }) INSTEAD
test('[remote test] getCard(multiverseid) NOTE: USE getCards({ multiverseid }) INSTEAD', async (t) => {
  const multiverseid = 4;
  await getCard(multiverseid).then((result) => {
    t.is(typeof result.card, 'object');
    t.is(typeof result.cards, 'undefined');
    t.is(result.card.multiverseid, multiverseid);
  });
});

// Make sure README examples work

test('[remote test] cards README example works', async (t) => {
  await getCards({
    type: 'creature',
    cmc: 3,
    colors: 'red,blue',
  }).then((result) => {
    const {
      type,
      cmc,
      colors,
    } = CARDS_EXPECTED_ITEM_SHAPE;
    responseItemsShapeTester(t, result.cards, {
      type,
      cmc,
      colors,
    });
    result.cards.forEach((card) => {
      const i = card.type.indexOf('Creature');
      t.not(card.type.toLowerCase().indexOf('creature'), -1, `${i} ${card.type} should be creature`);
      t.is(card.cmc, 3, 'should be cmc 3');
      const c = card.colors.join(',');
      t.not(c.match(/(red|blue)/i), null, `${c} should contain red or blue`);
    });
  });
});

// ====
// SETS
// ====

test('[remote test] getSets()', async (t) => {
  await getSets().then((result) => {
    t.is(typeof result, 'object');
    t.is(typeof result.meta, 'object');
    t.true(Array.isArray(result.sets));
    // check expected structure...
    // using a utility for this
    // I know best practice for unit tests is to
    // avoid such things and write verbose tests
    // however this is a special case
    // it helps detect changes in the third part api
    responseItemsShapeTester(t, result.sets, SETS_EXPECTED_ITEMS_SHAPE);
  });
});

test('[remote test] getSets() by name(s)', async (t) => {
  // NOTE
  // the api doesn't match exact only - partial names work
  // this is kinda anoying since something like 'ravnica'
  // will return 2 items due to 'Return to Ravnica'
  await getSets({ name: 'ravnica' }).then((result) => {
    t.truthy(result.sets.length);
  });
  // partial names
  await getSets({ name: ['mirro', 'nig'] }).then((result) => {
    t.truthy(result.sets.length);
    t.true(result.sets.some(item => item.name.indexOf('Scars') > -1));
    t.true(result.sets.some(item => item.name.indexOf('Arabian') > -1));
  });
});

test('[remote test] getSets() by block(s)', async (t) => {
  let length1 = Symbol('to make them unequal by default');
  let length2 = Symbol('to make them unequal by default');
  await getSets({ block: 'ravnica' }).then((result) => {
    length1 = result.sets.length;
  });
  await getSets({ block: 'ravni' }).then((result) => {
    length2 = result.sets.length;
  });
  t.true(length1 === length2);
  await getSets({ block: ['ravnica', 'kala'] }).then((result) => {
    t.true(result.sets.some(item => item.name.indexOf('Ravnica') > -1));
    t.true(result.sets.some(item => item.name.indexOf('Kaladesh') > -1));
  });
});

test('[remote test] getSets() by name(s) and block(s)', async (t) => {
  // mixes name / block that dont belong together yield no results
  await getSets({ name: ['ravnica', 'kaladesh'], block: 'Mirrodin' }).then((result) => {
    t.falsy(result.sets.length);
  });
  await getSets({ name: 'mir', block: 'mir' }).then((result) => {
    t.true(result.sets.some(item => item.name.indexOf('Mirage') > -1));
    t.true(result.sets.some(item => item.name.indexOf('Mirrodin') > -1));
    t.true(result.sets.some(item => item.name.indexOf(' of ') > -1));
  });
});

test('[remote test] getSets() by code', async (t) => {
  await getSets({ code: 'LEA' }).then((result) => {
    t.true(result.sets.length === 1);
    // the api actually returns a `.set` property in `code` search mode
    // we add it to `result.sets` for consistency...
    // `result.set` is also avaiable but
    // using `result.sets` is recommended
    t.is(result.sets[0].code, result.set.code);
  });
});

// .set exists for consistency with remote api
// USE .sets({ code }) INSTEAD
test('[remote test] getSet(code) NOTE: USE getSets({ code }) INSTEAD', async (t) => {
  const code = 'LEA';
  await getSet(code).then((result) => {
    t.is(typeof result.set, 'object');
    t.is(typeof result.sets, 'undefined');
    t.is(result.set.code, code);
  });
});

test('[remote test] sets README example works', async (t) => {
  await getSets({ block: 'ravnica' }).then((result) => {
    t.true(result.sets.length > 1);
  });
});

// =======
// BOOSTER
// =======

test('[remote test] getBooster(code)', async (t) => {
  const code = 'LEA';
  await getBooster(code).then((result) => {
    t.true(Array.isArray(result.cards));
    t.not(result.cards[0].printings.indexOf(code), -1, `it's items should contain .printings that contain ${code}`);
  });
});

// =====
// TYPES
// =====

test('[remote test] getTypes()', async (t) => {
  await getTypes().then((result) => {
    t.true(Array.isArray(result.types));
    t.not(result.types.indexOf('Land'), -1, 'should contain Land');
  });
});

test('[remote test] getTypes(\'supertypes\')', async (t) => {
  await getTypes('supertypes').then((result) => {
    t.true(Array.isArray(result.supertypes));
    t.not(result.supertypes.indexOf('Basic'), -1, 'should contain Basic');
  });
});

test('[remote test] getTypes(\'subtypes\')', async (t) => {
  await getTypes('subtypes').then((result) => {
    t.true(Array.isArray(result.subtypes));
    t.not(result.subtypes.indexOf('Angel'), -1, 'should contain Angel');
  });
});


// =======
// FORMATS
// =======

test('[remote test] getFormats()', async (t) => {
  await getFormats().then((result) => {
    t.true(Array.isArray(result.formats));
    t.not(result.formats.indexOf('Standard'), -1, 'should contain Standard');
  });
});

// ===========
// TEST A FAIL
// ===========

test('[remote set] test a fail', async (t) => {
  let uri = `${getRootURI()}/crds`;
  await getCards(uri).catch((result) => {
    t.not(typeof result.status, 'undefined', 'should contain status');
    t.not(typeof result.error, 'undefined', 'should contain error');
  });
  uri = `${getRootURI()}/cards/s`;
  await getCards(uri).catch((result) => {
    t.not(typeof result.status, 'undefined', 'should contain status');
    t.not(typeof result.error, 'undefined', 'should contain error');
  });
});
