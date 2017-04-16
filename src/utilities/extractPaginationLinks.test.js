import test from 'ava';
import extractPaginationLinks from './extractPaginationLinks';
import {
  MOCK_FIRST_RESULTS_LINKS,
  MOCK_FIRST_RESULTS_LINKS_POJO,
  MOCK_SECOND_RESULTS_LINKS,
  MOCK_SECOND_RESULTS_LINKS_POJO,
  API_WEBSITE_SAMPLE,
} from './extractPaginationLinks.mock-links';

// make sure mocks are correct first
test('mocks are formatted correctly', (t) => {
  t.is(MOCK_FIRST_RESULTS_LINKS, API_WEBSITE_SAMPLE);
});

test('returns an object with optional props `next`, `prev`, `first`, `last`', (t) => {
  const firstResultsLinks = extractPaginationLinks(MOCK_FIRST_RESULTS_LINKS);
  t.is(firstResultsLinks.next, MOCK_FIRST_RESULTS_LINKS_POJO.next);
  t.falsy(firstResultsLinks.prev);
  t.falsy(firstResultsLinks.first);
  t.is(firstResultsLinks.last, MOCK_FIRST_RESULTS_LINKS_POJO.last);

  const secondResultsLinks = extractPaginationLinks(MOCK_SECOND_RESULTS_LINKS);
  t.is(secondResultsLinks.next, MOCK_SECOND_RESULTS_LINKS_POJO.next);
  t.is(secondResultsLinks.prev, MOCK_SECOND_RESULTS_LINKS_POJO.prev);
  t.is(secondResultsLinks.first, MOCK_SECOND_RESULTS_LINKS_POJO.first);
  t.is(secondResultsLinks.last, MOCK_SECOND_RESULTS_LINKS_POJO.last);
});

test('returns an empty object if passed the wrong shape', (t) => {
  const data = {};
  // wrong thing just returns empty object
  t.is(typeof extractPaginationLinks(), 'object');
  const results = extractPaginationLinks(data.nope);
  t.is(typeof results, 'object');
  // we want to be able to use the results like so:
  // if (results.next) {
  //   // do something...
  // }
  // so consider them truthy / falsy
  t.falsy(results.next);
  t.falsy(results.prev);
  t.falsy(results.first);
  t.falsy(results.last);
});
