import test from 'ava';
import ensureIntegerOrNull from './ensureIntegerOrNull';

// const test = require('ava').test;
// const ensureIntegerOrNull = require('./ensureIntegerOrNull');
//
test((t) => {
  t.is(ensureIntegerOrNull(3), 3);
  t.is(ensureIntegerOrNull('3'), 3);
  t.is(ensureIntegerOrNull(undefined), null);
  // NOTE
  // This function is only used to coerce a string number
  // into an integer or null if undefined or not a number
  // as such tests of floats to int etc
  // should not be taken as a queue to use
  // it for general number operations (just use Math functions)
  // these will however pass...
  t.is(ensureIntegerOrNull(5.6), 5);
  t.is(ensureIntegerOrNull('5 cats'), 5);
});
