// NOTE
// This function is only used to coerce a string number
// into an integer or null if undefined or not a number
// Don't use it for number operations (use Math functions)

function ensureIntegerOrNull(num) {
  let int = parseInt(num, 10);
  if (isNaN(int)) int = null;
  return int;
}

export default ensureIntegerOrNull;
