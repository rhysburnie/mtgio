import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies || {});

const entry = 'src/index.js';

// my hacky fix to: https://github.com/eventualbuddha/babelrc-rollup/issues/6
const rc = babelrc();
const doesNotAcceptOptions = ['stage-2'];
const acceptsOptionModules = ['es2015'];
rc.presets.forEach((preset, i) => {
  if (doesNotAcceptOptions.indexOf(preset[0]) > -1) {
    rc.presets[i] = preset[0];
  } else if (acceptsOptionModules.indexOf(preset[0]) === -1) {
    delete preset[1].modules; // eslint-disable-line
  }
});
// console.log(JSON.stringify(rc, null, 2));

export default {
  entry,
  external,
  plugins: [
    babel(rc),
  ],
  targets: [
    {
      format: 'es',
      dest: pkg['jsnext:main'],
      sourceMap: true,
    },
    {
      format: 'umd',
      dest: pkg.main,
      moduleName: pkg['umd:moduleName'],
      sourceMap: true,
    },
  ],
};
