'use strict';

const blacklist = require('react-native/packager/blacklist');

module.exports = {

  /**
   * Add search paths to the packager. Equivalent to the
   * `--projectRoots` command line argument.
   *
   * Your app project directory is the default, but you can easily add
   * additional directories.
   *
   * This is very handy when you maintain all your software in one big
   * repo, which means your app's dependencies aren't necessarily just
   * located in `./node_modules` but potentially in sibling
   * directories or other locations.
   */
  getProjectRoots() {
    return [__dirname];
  },

  /**
   * Specify additional file extensions for assets. For example, if
   * you want to include a .ttf file, you would return ['ttf'] from
   * here and use `require('./fonts/example.ttf')` inside your app.
   *
   * Equivalent to the `--assetExts` command line argument.
   */
  getAssetExts() {
    return [];
  },

  /**
   * Specify any additional platforms to be used by the packager.
   * For example, if you want to add a "custom" platform, and use modules
   * ending in .custom.js, you would return ['custom'] here.
   *
   * Equivalent to the `--platforms` command line argument.
   */
  getPlatforms() {
    return [];
  },

  /**
   * The React Native packager can be a bit fussy. For instance, it
   * does not like come across duplicate packages. It can also be slow
   * to traverse deep directory structures that you know won't have
   * app dependencies in them. Putting those directories on the
   * blacklist will stop the packager from traversing into them.
   */
  getBlacklistRE() {
    const additionalBlacklist = [
      /ignore-this-directory\/.*/,
    ];
    return blacklist(additionalBlacklist);
  },

  /**
   * This is the bombshell. New in React Native 0.30, this allows you
   * to specify your own code transformer.
   *
   * In essense, instead of specifying your own `.babelrc` file,
   * you'll want to specify your own transformer. That way, when
   * running a regular node program such as the packager itself, the
   * special transforms your app needs won't be applied.
   *
   * Equivalent to the `--transformer` command line argument.
   */
  getTransformModulePath() {
    return require.resolve('./transformer');
  },
};
