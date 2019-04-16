export default {
  plugins: [
    ['../../../../../umi-plugin-auto-externals/lib/index.js', {
      externals: [ 'react' ],
      urlTemplate: '{{ cdnHost }}/{{ library }}/{{ version }}/{{ path }}',
      cdnHost: 'https://gw.alipayobjects.com/os/lib',
    }],
  ],
}
