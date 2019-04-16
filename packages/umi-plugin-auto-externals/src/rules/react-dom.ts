import { IAUTO_EXTERNAL_RULE_ITEM } from '../types';

const rules: IAUTO_EXTERNAL_RULE_ITEM = {
  key: 'react-dom',
  global: 'ReactDOM',
  scripts: ['umd/react-dom.production.min.js'],
  dependencies: ['react'],
};

export default rules;
