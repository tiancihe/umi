// 用户配置参数
export interface IOpts {
  externals: string[];
  urlTemplate?: string;
  cdnHost?: string;
  needUrlOnlineCheck?: boolean;
}

// 内置的类库需要 external 时需要指定的参数
export interface IAUTO_EXTERNAL_RULE_ITEM {
  key: string; // library name
  global?: string | Function; // global name
  scripts: string[]; // js url
  styles?: string[]; // style url
  polyfillUrls?: string[];
  polyfillExclude?: string[]; // polyfills
  dependencies?: string[]; // external 之间的依赖关系
}

export interface IAUTO_EXTERNAL_MAP {
  [key: string]: IAUTO_EXTERNAL_RULE_ITEM; // key 为 library name
}

// umi 层处理时的数据格式
export interface IKeyExternalData {
  key: string;
  global?: string | Function; // global name
  scripts: string[];
  styles: string[];
  polyfillExclude: string[];
}
