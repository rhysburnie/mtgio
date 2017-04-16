# MTGIO

JavaScript api for magicthegathering.io endpoint.

**The existing official JavaScript sdk on magicthegathering.io lacks full support**

This api aims to support all endpoints in a consistent way.

## API

Designed to be consumed ES2015 and onwards, _but also supports lower support (see: Not using ES2015 and onwards? bellow)_.

All _"get"_ methods return a Promise.

If the fetch fails it will contain an object with a key `error`.
The best way to handle errors is by using a `.catch` as typical best practice using promises.

All successful fetches will resolve a result object contain the following:

* A property for the specific endpoint documented at https://docs.magicthegathering.io
  these will be defined bellow for each available method.
* An additional `meta` object containing the additional data the endpoint sends though in the [response headers](https://docs.magicthegathering.io/?javascript#headers)
  These tend to only apply to the **cards** endpoint, generally the main part
  that is useful is the pagination links which make it possible to paginate
  to and from the search result (the responses only contain 100 cards at a time)

  **NOTE** the meta keys are camelcase rather than the strings [described](https://docs.magicthegathering.io/?javascript#headers)

  * `'Link'` = `result.meta.links` (note **links** not link)
    The string format returned will be parsed into easy to
    consume property / values:
    * `result.meta.links.next` (url string - if present)
    * `result.meta.links.prev` (url string - if present)
    * `result.meta.links.first` (url string - if present)
    * `result.meta.links.last` (url string - if present)
  * `'Page-Size'` = `result.meta.pageSize`
  * `'Count'` = `result.meta.count`
  * `'Total-Count'` = `result.meta.totalCount`
  * `'Ratelimit-Limit'` = `result.meta.ratelimitLimit`
  * `'Ratelimit-Remaining'` = `result.meta.ratelimitRemaining`

  **NOTE** if not present in the headers they will be `null`.
  You should always check their existence before usage.



### `getCards`

`import { getCards } from 'mtgio'`;

If successful resolves result: `{ cards, meta }`.

Get _all_

```
getCards().then((result) => {
  console.log(result.cards);
});
```

Get _where_

All query [parameters](https://docs.magicthegathering.io/?python#get-all-cards) can be passed in an options object.

```
getCards({
  type: 'creature',
  cmc: 3,
  colors: 'red,blue',
}).then((result) => {
  console.log(result.cards);
});
```

Please not some combinations of parameters yield no results.
This is the case of the endpoint not this library.

**Pagination**

A higher order function will need to be created to avoid nesting
of pagination calls etc. however that is not the responsibility
of this library, nor do the other language api's for the endpoint
provide such methods.

However you can pass the pagination link through `getCards`.

```
if (result.meta.links.next) {
  getCards(result.meta.links.next).then((result) => {
    console.log(result.cards);
  });
}
```

**TODO** Later when I have a working app consuming this lib add an example

### `getCard`

`import { getCard } from 'mtgio'`

Get card is available, but I **recommend using getCards(id)** which will return
one item in the cards array.

It is only included because the other language api's have that functionality.
However it is less useful in JavaScript where you're better off always expecting an array.

* `getCards({ id: 'aa74b7dc3b30b2e7559598f983543755e226811d' })` **recommended**
* `getCards({ multiverseid: 4 })` **recommended** (kinda - not all cards have multiverseid)
* not recommended
  * `getCard('aa74b7dc3b30b2e7559598f983543755e226811d')`
  * `getCard(4)`

### `getSets`

`import { getSets } from 'mtgio'`;

If successful resolves result: `{ sets, meta }`.

**NOTE** currently the endpoint does not need to paginate sets.
Therefore **there is currently no pagination** for sets.

Get _all_

```
getSets().then((result) => {
  console.log(result.sets);
});
```

Get _where_

Simply pass an options object containing the desired [query paramaters](https://docs.magicthegathering.io/?python#sets)

```
getSets({
  block: 'ravnica'
}).then((result) => {
  console.log(result.sets);
});
```

### `getSet`

`import { getSet } from 'mtgio'`

As with Cards you're better off using `getSets({ code })`.

* `getCards({ code: 'RAV' })` **recommended**
* not recommended
  * `getCard('RAV')`

### `getBooster`

Generate a booster pack of cards for set

```
import { getBooster } from 'mtgio'

getBooster('LEA').then((result) => {
  console.log(result.cards);
});
```

### `getTypes`

`import { getTypes } from 'mtgio'`

**All types**

```
getTypes().then((result) => {
  console.log(result.types);
});
```

**supertypes**

```
getTypes('supertypes').then((result) => {
  console.log(result.supertypes);
});
```

**subtypes**

```
getTypes('subtypes').then((result) => {
  console.log(result.subtypes);
});
```

### `getFormats`

```
import { getFormats } from 'mtgio';

getFormats().then(result => console.log(result.formats));
```

### Not using ES2015 and onwards?

Yo it's 2017, time to move on. However if you are going old school
the package main points to a UMD.

Example:

```
var mtgio = require('mtgio');

mtgio.getSets().then(function(result) {
  console.log(result.sets);
});
```
Or if you drop `index.umd.js` into the browser directly (ewww!)

```
window.mtgio.getSets().then(function(result) {
  console.log(result.sets);
});
```

---

## NPM Commands (in development of this api)

The test commands can be watched by adding ` -- --watch`

* `npm test` (optional watch flag)
* `npm run test:remote` (optional watch flag)
  tests the actual remote api endpoints
* `npm run lint`
  yo... use an eslint plugin in your IDE during development
* `npm run build`
   **runs automatically by postinstall**

---

# My Rollup Starter

Project starter `git@bitbucket.org:rhysburnie/my-rollup-starter.git
