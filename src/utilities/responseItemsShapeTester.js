// I know best practice for unit tests is to
// avoid such things and write verbose tests
// however this is a special case
// it helps detect changes in the third party api
// however it only does this on the first level
/**
 * @param {Object} t the t object from an ava test((t) => {})
 * @param {Object} propTypes key / type (strings)
 * @param {Boolean} notifyMissing notify is any props are missing from the items
 */
function responseItemsShapeTester(t, items, propTypes, notifyMissing = true) {
  const atLeastOneFound = {};
  items.forEach((item) => {
    Object.keys(propTypes).forEach((key) => {
      if (item[key]) {
        if (notifyMissing) atLeastOneFound[key] = true;
        const type = propTypes[key];
        switch (type) {
          case 'string':
          case 'number':
          case 'object':
            t.is(typeof item[key], type, `${key} type should be ${type}. value: (${item[key]})`);
            break;
          case 'array':
            t.true(Array.isArray(item[key]), `${key} should be array`);
            break;
          case 'true':
            t.true(item[key], `${key} should be true`);
            break;
          default: t.fail(`unknown type: ${type}`);
            break;
        }
      }
    });
  });
  if (notifyMissing) {
    // detect if any expected key is missing from all
    const missing = [];
    Object.keys(propTypes).forEach((key) => {
      if (!atLeastOneFound[key]) missing.push(key);
    });
    if (missing.length) {
      t.fail(`responseItemsShapeTester\nnone of the items contain the properties: ${missing.join(', ')}`);
    }
  }
}

module.exports = responseItemsShapeTester;
