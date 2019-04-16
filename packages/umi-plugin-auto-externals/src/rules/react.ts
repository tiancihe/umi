import { IAUTO_EXTERNAL_RULE_ITEM } from '../types';

const rules: IAUTO_EXTERNAL_RULE_ITEM = {
  key: 'react',
  global: 'React',
  scripts: ['umd/react.production.min.js'],
  polyfillUrls: ['umd/react.profiling.min.js'],
  polyfillExclude: ['core-js/es6/map', 'core-js/es6/set'],
};

export default rules;
