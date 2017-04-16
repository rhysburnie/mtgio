// Converts the strange formatted pagination
// "link" strings to a consumable pojo

/**
 * @param {String} str
 * @return {Object}
 */
function extractPaginationLinks(str) {
  const links = {};
  if (typeof str === 'string' && str[0] === '<') {
    str.split(',').forEach((link) => {
      const extract = /<(.*)>; rel="(.*)"/.exec(link);
      if (extract && extract.length === 3) {
        links[extract[2]] = extract[1];
      }
    });
  }
  return links;
}

export default extractPaginationLinks;
