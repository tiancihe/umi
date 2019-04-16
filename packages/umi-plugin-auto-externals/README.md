# umi-plugin-auto-externals

Simple way to external in umi.

## Usage

Configured in `.umirc.js`:

```js
export default {
  plugins: [
    ['umi-plugin-auto-externals', {
      externals: [ 'react', 'react-dom', 'moment', 'antd', 'jquery' ],
      urlTemplate: '{{ cdnHost }}/{{ library }}/{{ version }}/{{ path }}',
      cdnHost: '',
      needUrlOnlineCheck: false,
    }],
  ],
};
```

## Configuration items

### externals

* Type: `Array`

Librarys need to be externaled. Support librarys are:

* `react`
* `react-dom`
* `moment`
* `antd`
* `jquery`

::: warning
If you want to external antd, please ensure that react + react-dom + moment are configed in front of antd.
:::

### urlTemplate

* Type: `String`

If you want to use your own CDN service, you need to config this.

There will be four variables to render this template: cdnHost, library, version, path.

cdnHost is provided by you, other three variables are provided by automatic.

### cdnHost

* Type: `String`

Variable for rendering urlTemplate.

### needUrlOnlineCheck

* Type: `Boolean`

If needUrlOnlineCheck is true, we will check all urls if online.
