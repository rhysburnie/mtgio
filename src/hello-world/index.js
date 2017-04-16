/**
 * NOTE
 * This file may look strange but it is written in this weird round about way
 * to test that the build system and test runner is able to use
 * the key features I want supported:
 * - spread
 * - destructuring
 * - arrow functions
 * - template strings
 */
import objectWithHello from './hello';
import world from './world';

// used to test spread
const combined = {
  ...objectWithHello,
  world,
};

// used to test destructuring
const { hello } = combined;

const sayHello = () => `${hello} ${combined.world}!`;

export default sayHello;
export {
  sayHello,
  combined,
};
