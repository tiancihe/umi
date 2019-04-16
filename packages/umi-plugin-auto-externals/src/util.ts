import chalk from 'chalk';
import { join } from 'path';
import { IAUTO_EXTERNAL_MAP, IKeyExternalData } from './types';
import { IApi } from 'umi-types';
import * as urllib from 'urllib';
import * as semver from 'semver';

/**
 * 公共报错方法
 * @param msg error msg
 * @param name error name
 */
export function error(msg: string, name?: string) {
  const err = new Error(chalk.red(msg));
  err.name = name || 'AutoExternalError';
  throw err;
}

/**
 * autoExternal 的 validate 方法
 * @param keys 用户的配置
 * @param externalConfig 用户的 externals 配置。防止和 autoExternals 冲突
 * @param externalMap 内置的可以 autoExternals 的类库
 */
export function validate(
  keys,
  externalConfig: any = {},
  externalMap: IAUTO_EXTERNAL_MAP,
) {
  // 必须是数组
  if (!Array.isArray(keys)) {
    error('Auto externals config must be an array!');
  }

  keys.forEach((key: string, index: number) => {
    // 必须是内置支持的 key
    const configItem = externalMap[key];
    if (!configItem) {
      error(`Not support auto external dependencies: ${key}`);
    }
    // 不能和 external 冲突
    if (externalConfig[key]) {
      error(`${key} is is both in external and autoExternals`);
    }

    // dep 依赖检查
    const { dependencies } = configItem;
    if (!dependencies) {
      return;
    }
    const frontArray = keys.slice(0, index);
    dependencies.forEach(dep => {
      if (!frontArray.includes(dep)) {
        error(`${key} need ${dep} to be externaled`);
      }
    });
  });
}

/**
 * 获取 umi 运行时 autoExternal 需要的数据
 * @param key library name
 * @param version library version
 * @param externalMap 内置的可以 autoExternals 的类库
 */
export function getKeyExternalData(
  key: string,
  version: string,
  externalMap: IAUTO_EXTERNAL_MAP,
): IKeyExternalData {
  const {
    global,
    scripts = [],
    polyfillExclude = [],
    polyfillUrls = [],
    styles = [],
  } = externalMap[key];
  return {
    key,
    global,
    scripts: polyfillUrls
      .concat(scripts)
      .filter(item => !!item)
      .map(item => item.replace('{{ version }}', version)),
    styles: styles
      .filter(item => !!item)
      .map(item => item.replace('{{ version }}', version)),
    polyfillExclude,
  };
}

/**
 * 获取所有内置 library key 的版本号
 * @param api umi plugin api
 * @param keys 所有内置的 library keys
 */
export function getAllKeyVersions(
  api: IApi,
  keys: string[],
): { [key: string]: string } {
  const res = {};

  // 获取 umi 中已知的 library name 的版本号
  const versions = api.applyPlugins('addVersionInfo');
  versions.forEach((item: string) => {
    const [key, version] = item.replace(/\s.*/, '').split('@');
    res[key] = version;
  });

  // 对于 umi 未知的 library 版本号，从用户 package.json 中获取，比如 moment
  keys.forEach(key => {
    if (res[key]) {
      return;
    }
    const pkg = require(join(api.paths.cwd, 'package.json'));
    const semverIns = semver.coerce(pkg.dependencies && pkg.dependencies[key]);
    if (!semverIns) {
      error(`Can not find dependencies(${key}) version`);
    }
    res[key] = semverIns.version;
  });
  return res;
}

/**
 * url 是否在线的校验
 * @param url string
 */
export async function onlineCheck(configs: IKeyExternalData[]) {
  let urls = [];
  (configs || []).forEach(({ scripts, styles }) => {
    urls = urls.concat(scripts).concat(styles);
  });
  if (!urls.length) {
    return;
  }

  const options = {
    method: 'HEAD',
    retry: 3, // any
    retryDelay: 1500,
  } as any;

  await Promise.all(
    urls.map(async url => {
      if (!url) {
        return;
      }
      const res = await urllib.request(url, options);
      if (res.status !== 200) {
        error(`${url} is not online!`);
      }
    }),
  );
}
