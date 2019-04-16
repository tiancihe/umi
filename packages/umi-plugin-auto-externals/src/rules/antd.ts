import { IAUTO_EXTERNAL_RULE_ITEM } from '../types';
import { upperFirst, camelCase } from 'lodash';

function upcaseAntdComponent(component: string) {
  if (['notification', 'message'].indexOf(component) > -1) {
    return component;
  }
  return upperFirst(camelCase(component));
}

const rules: IAUTO_EXTERNAL_RULE_ITEM = {
  key: 'antd',
  scripts: ['dist/antd.min.js'],
  styles: ['dist/antd.min.css'],
  dependencies: ['react', 'react-dom', 'moment'],
  global: (_, request, callback) => {
    if (
      !/antd/.test(request) ||
      /style/.test(request) ||
      /locale-provider\/.*/.test(request)
    ) {
      return callback();
    }
    // @alipay/bigfish/antd/es/spin => antd/es/spin
    const antdRequest = (request || '').replace(/@alipay\/bigfish\//, '');
    // 未使用 babel-plugin-import
    if (antdRequest === 'antd') {
      return callback(null, ['antd'], 'window');
    }

    // 使用了 babel-plugin-import
    const [libraryNmae, __, component] = antdRequest.split('/');
    return callback(
      null,
      [libraryNmae, upcaseAntdComponent(component)],
      'window',
    );
  },
};

export default rules;
