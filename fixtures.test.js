import test from 'ava';

const cardsFixture = require('./fixtures/cards.json');
const setsFixture = require('./fixtures/sets.json');
const typesFixture = require('./fixtures/types.json');
const supertypesFixture = require('./fixtures/supertypes.json');
const subtypesFixture = require('./fixtures/subtypes.json');
const boosterFixture = require('./fixtures/booster.json');
const formatsFixture = require('./fixtures/formats.json');

test(t => t.true(Array.isArray(cardsFixture.cards)));
test(t => t.true(Array.isArray(setsFixture.sets)));
test(t => t.true(Array.isArray(typesFixture.types)));
test(t => t.true(Array.isArray(supertypesFixture.supertypes)));
test(t => t.true(Array.isArray(subtypesFixture.subtypes)));
test(t => t.true(Array.isArray(boosterFixture.cards)));
test(t => t.true(Array.isArray(formatsFixture.formats)));
