import test from 'ava';
import fetchMock from 'fetch-mock';
import extractHeaderMeta from './extractHeaderMeta';
import {
  MOCK_FIRST_RESULTS_LINKS,
  MOCK_FIRST_RESULTS_LINKS_POJO,
  API_WEBSITE_SAMPLE,
} from './extractPaginationLinks.mock-links';

// make sure mocks are correct first
test('mocks are formatted correctly', (t) => {
  t.is(MOCK_FIRST_RESULTS_LINKS, API_WEBSITE_SAMPLE);
  t.is(typeof MOCK_FIRST_RESULTS_LINKS_POJO, 'object');
});

const MOCK_HEADER_DATA = {
  // NB: the api header key is `link` not `links`
  //     but we use `links` in the returned `meta` prop
  link: MOCK_FIRST_RESULTS_LINKS,
  'Page-Size': '100',
  Count: '100',
  'Total-Count': '31090',
  'Ratelimit-Limit': '5000',
  'Ratelimit-Remaining': '4999',
};

const MOCK_DATA = { whatever: 'whatever' };

test('extracts meta from the headers', async (t) => {
  const uri = '#';
  const mock = fetchMock.mock(uri, {
    body: MOCK_DATA,
    headers: MOCK_HEADER_DATA,
  }, 200);
  t.is(typeof fetch, 'function');
  await fetch(uri)
    .then(extractHeaderMeta)
    .then((result) => {
      t.is(typeof result, 'object');
      t.is(typeof result.meta, 'object');

      t.is(result.whatever, MOCK_DATA.whatever);

      t.is(typeof result.meta.links, 'object');
      t.is(result.meta.links.next, MOCK_FIRST_RESULTS_LINKS_POJO.next);
      t.falsy(result.meta.links.prev);
      t.falsy(result.meta.links.first);
      t.is(result.meta.links.last, MOCK_FIRST_RESULTS_LINKS_POJO.last);

      t.is(typeof result.meta.pageSize, 'number');
      t.is(result.meta.pageSize.toString(), MOCK_HEADER_DATA['Page-Size']);

      t.is(typeof result.meta.count, 'number');
      t.is(result.meta.count.toString(), MOCK_HEADER_DATA.Count);

      t.is(typeof result.meta.totalCount, 'number');
      t.is(result.meta.totalCount.toString(), MOCK_HEADER_DATA['Total-Count']);

      t.is(typeof result.meta.ratelimitLimit, 'number');
      t.is(result.meta.ratelimitLimit.toString(), MOCK_HEADER_DATA['Ratelimit-Limit']);

      t.is(typeof result.meta.ratelimitRemaining, 'number');
      t.is(result.meta.ratelimitRemaining.toString(), MOCK_HEADER_DATA['Ratelimit-Remaining']);
    });
  t.true(mock.called(uri));
});
