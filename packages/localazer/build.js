const { libraryCompiler } = require('@rockpack/compiler');

libraryCompiler({
  name: 'RockLocalazer',
  cjs: {
    src: './src',
    dist: './lib/cjs'
  },
  esm: {
    src: './src',
    dist: './lib/esm'
  }
}, null, config => {
  config.externals = [
    'react',
    'react-dom',
    'react-dom/server'
  ];
});
