// eslint-disable-next-line func-names
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'module:react-native-dotenv'],
    plugins: [
      [
        'babel-plugin-root-import',
        {
          rootPathSuffix: 'src',
        },
      ],
    ],
  };
};
