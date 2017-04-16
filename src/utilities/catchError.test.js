import test from 'ava';
import catchError from './catchError';

test('catchError', async (t) => {
  await catchError().catch((result) => {
    t.not(typeof result.status, 'undefined', 'should contain status');
    t.not(typeof result.error, 'undefined', 'should contain error');
  });
});
