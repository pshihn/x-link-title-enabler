/* eslint-disable */

const outFolder = 'lib';

const inputs = [
  'background',
  'x-title-enabler'
];

export default inputs.map((d) => {
  return {
    input: `bin/${d}.js`,
    output: {
      file: `${outFolder}/${d}.js`,
      format: 'iife'
    },
    external: ['chrome-types']
  };
});