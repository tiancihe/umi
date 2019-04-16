import { IApi, IWebpackChainConfig } from 'umi-types';
import getExternalMap from './rules';
import {
  validate,
  getAllKeyVersions,
  getKeyExternalData,
  onlineCheck,
} from './util';
import { IOpts, IKeyExternalData } from './types';

function getWebpackExternalConfig(configs: IKeyExternalData[]) {
  const res = [];
  const objectConfig = {};
  configs.forEach(({ key, global: root }) => {
    if (typeof root === 'string') {
      objectConfig[key] = root;
    } else {
      res.push(root);
    }
  });
  res.unshift(objectConfig);
  return res;
}

export default function(
  api: IApi,
  {
    externals: autoExternalKeys,
    urlTemplate = '{{ cdnHost }}/{{ library }}@{{ version }}/{{ path }}',
    cdnHost = 'https://unpkg.com',
    needUrlOnlineCheck = false,
  }: IOpts,
) {
  const { debug } = api;
  const externalMap = getExternalMap({
    urlTemplate,
    cdnHost,
  });

  api.applyPlugins('autoExternals', {
    initialValue: externalMap,
  });

  validate(autoExternalKeys, api.externals, externalMap);

  const versions = getAllKeyVersions(api, autoExternalKeys);
  debug('Key versions:');
  debug(versions);

  const configs: IKeyExternalData[] = autoExternalKeys.map((key: string) =>
    getKeyExternalData(key, versions[key], externalMap),
  );
  debug('User external data:');
  debug(configs);

  if (!configs.length) {
    return;
  }

  if (needUrlOnlineCheck) {
    api.onStartAsync(async () => {
      await onlineCheck(configs);
    });
  }

  // 修改 webpack external 配置
  api.chainWebpackConfig((webpackConfig: IWebpackChainConfig) => {
    webpackConfig.externals(getWebpackExternalConfig(configs));
  });

  // 修改 script 标签
  const scripts = configs.reduce(
    (accumulator, current) => accumulator.concat(current.scripts),
    [],
  );
  api.addHTMLHeadScript(() => scripts.map(src => ({ src, crossorigin: true }))); // TODO: 这儿只能用 addHTMLHeadScript 么？

  // 添加 style
  const styles = configs.reduce(
    (accumulator, current) => accumulator.concat(current.styles),
    [],
  );
  api.addHTMLLink(() =>
    styles.map(href => ({
      charset: 'utf-8',
      rel: 'stylesheet',
      type: 'text/css',
      href,
    })),
  );

  // TODO: 传递 exclude
}
