// THIS MOCKS FILE ONLY EXISTS
// BECAUSE MULTIPLE TEST FILES
// USE THIS MOCK DATA

// used here internally
function mockLinksFormat(obj) {
  return Object.keys(obj).map(key => `<${obj[key]}>; rel="${key}"`).join(', ');
}

const API_WEBSITE_SAMPLE = '<http://api.magicthegathering.io/v1/cards?page=311>; rel="last", <http://api.magicthegathering.io/v1/cards?page=2>; rel="next"';

const MOCK_FIRST_RESULTS_LINKS_POJO = {
  last: 'http://api.magicthegathering.io/v1/cards?page=311',
  next: 'http://api.magicthegathering.io/v1/cards?page=2',
};
const MOCK_FIRST_RESULTS_LINKS = mockLinksFormat(MOCK_FIRST_RESULTS_LINKS_POJO);

const MOCK_SECOND_RESULTS_LINKS_POJO = {
  next: 'http://api.magicthegathering.io/v1/cards?page=3',
  prev: 'http://api.magicthegathering.io/v1/cards?page=2',
  first: 'http://api.magicthegathering.io/v1/cards?page=1',
  last: 'http://api.magicthegathering.io/v1/cards?page=311',
};
const MOCK_SECOND_RESULTS_LINKS = mockLinksFormat(MOCK_SECOND_RESULTS_LINKS_POJO);

module.exports = {
  MOCK_FIRST_RESULTS_LINKS,
  MOCK_FIRST_RESULTS_LINKS_POJO,
  MOCK_SECOND_RESULTS_LINKS,
  MOCK_SECOND_RESULTS_LINKS_POJO,
  API_WEBSITE_SAMPLE,
};
