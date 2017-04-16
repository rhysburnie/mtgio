import test from 'ava';
import helloWorld, { sayHello, combined } from './index';

test((t) => {
  t.is(typeof helloWorld, 'function');
  t.is(helloWorld, sayHello);
  t.is(typeof combined, 'object');
  const result = helloWorld();
  t.is(typeof result, 'string');
  t.not(result.indexOf(combined.world), -1);
});
