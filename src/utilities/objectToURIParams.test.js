import test from 'ava';
import objectToURIParams from './objectToURIParams';

test('creates key=value array from object', (t) => {
  const obj = { name: 'name' };
  const params = objectToURIParams(obj);
  t.true(Array.isArray(params));
  t.is(params.length, 1);
  t.is(params[0], 'name=name');
});

test('objectToURIParams(obj, \'?\') creates ?key=value string from object', (t) => {
  const obj = { name: 'name', other: 'other' };
  const params = objectToURIParams(obj, '?');
  t.is(typeof params, 'string');
  t.is(params, '?name=name&other=other');
});
