module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'module:react-native-dotenv',
    [
      'babel-plugin-root-import',
      {
        rootPathSuffix: 'src',
      },
    ],
  ],
};
