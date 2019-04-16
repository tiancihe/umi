import { IAUTO_EXTERNAL_MAP } from '../types';
import react from './react';
import reactDom from './react-dom';
import antd from './antd';
import moment from './moment';
import jquery from './jquery';

function parseUrls(
  library: string,
  paths: string[] = [],
  urlTemplate: string,
  cdnHost: string,
): string[] {
  return paths.map(path => {
    const model = {
      cdnHost,
      library,
      path,
    };
    return urlTemplate.replace(/{{ (\w+) }}/g, (str, key) => model[key] || str);
  });
}

function getExternalMap({ urlTemplate = '', cdnHost = '' }) {
  const res: IAUTO_EXTERNAL_MAP = {};
  [react, reactDom, antd, moment, jquery].forEach(
    ({ key, scripts, styles, polyfillUrls, ...rest }) => {
      res[key] = {
        ...rest,
        key,
        scripts: parseUrls(key, scripts, urlTemplate, cdnHost),
        styles: parseUrls(key, styles, urlTemplate, cdnHost),
        polyfillUrls: parseUrls(key, polyfillUrls, urlTemplate, cdnHost),
      };
    },
  );
  return res;
}

export default getExternalMap;
