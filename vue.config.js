// const DEV_SERVER_NAME = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_ENVIRONMENT : ''
const path = require('path');
const localHost = process.env.LOCAL_HOSTNAME || '';

module.exports = {
  publicPath: (process.env.NODE_ENV === 'production' && !process.env.VUE_APP_ENVIRONMENT) ? '//s.{{company}}static.com/fe-static/{{projectName}}/' : '/',
  outputDir: 'output',
  configureWebpack: {
    devtool: '#source-map'
  },
  lintOnSave: false,
  devServer: {
    open: true,
    port: 9692,
    host: localHost,
    https: true,
    proxy: {
      '/mockApiService': {
        target: `http://${localHost}:${process.env.PORT || '3000'}`,
        changeOrigin: true,
        pathRewrite: {
          '^/mockApiService/': '/'
        }
      },
      '/classroomManagementService': {
        target: 'http://qa-gw-openclass.{{company}}-qa.com.cn/api/vps/service/openclass',
        changeOrigin: true,
        pathRewrite: {
          '^/classroomManagementService/': '/'
        }
      }
    }
  },
  chainWebpack: (config) => {
    /**
     * Aliases
     */
    config.resolve.alias.set('@', path.resolve(__dirname, './src'));
    config.resolve.alias.set('components', path.resolve(__dirname, './src/components'));

    const svgRule = config.module.rule('svg');
    let originalOptions;
    svgRule.use('file-loader').tap(options => {
      originalOptions = options;
    });
    svgRule.uses.clear();
    svgRule.oneOf('module')
      .resourceQuery(/\?module/)
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
    svgRule.oneOf('normal')
      .use('file-loader')
      .loader('file-loader')
      .options(originalOptions);
  }
}
