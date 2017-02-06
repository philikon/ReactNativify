# Using node.js libraries in React Native

Tools like [browserify](http://browserify.org) and [webpack](http://webpack.org) have made it easy to use code originally written for node.js in the browser environment. And even when developing exclusively for the browser, the node.js standard library has a lot to offer with a powerful [Buffer](https://nodejs.org/api/buffer.html) implementation that goes beyond what typed arrays can do, a [stream API](https://nodejs.org/api/stream.html), [URL parsing](https://nodejs.org/api/url.html), etc., making node.js an appealing target platform for any Javascript developer.

## The React Native packager

So where does that leave React Native? On paper, React Native is not necessarily tied to a particular packager, as it will happily load a Javascript bundle from a file or URL, regardless of how that bundle was prepared. So in theory, using browserify or webpack would be possible. In practice, though, things are a lot more complicated:

- React Native uses Haste modules internally. One can only hope that React Native will go the way of React and rewrite Haste requires to node-style requires at some point to level the playiing field for other packagers.

- As long as Facebook is using the React Native packager internally, React Native will always work best with the React Native packager. I have maintained a hybrid approach called [react-native-webpack-server](https://www.npmjs.com/package/react-native-webpack-server) for a while. It tries to package React Native itself using its own packager and the rest of the app using webpack. I can recall a number of times when upstream changes in React Native broke our code, blocking an upgrade to the latest React Native on fixing our own packager first.

- React Native assumes you're using its own packager in various places. Some examples: The XCode project will automatically start the packager for you in debug mode, you don't get a say in it. The hot module reload support will automatically attempt WebSocket connections to the packager.

To cut a long story short, betting on the React Native packager makes a lot of sense for now.

So how can we use node.js libraries if we're stuck with the React Native packager?

## Custom transformers

The React Native packager has a little known pluggable component called a *transformer*. This is a function that takes a given source file and (typically using Babel) transforms it so that all the funky ES2015 syntax is replaced with stuff that JavaScriptCore can parse. We can supply our own transformer, use a Babel helper called [babel-plugin-rewrite-require](https://www.npmjs.com/package/babel-plugin-rewrite-require), and include browserify's reimplementation of node's core libraries to make any piece of code originally written for node.js runnable inside React Native's environment.

## How it works

1. Create a `rn-cli.config.js` file at the top of your React Native project. This file gets loaded by the React Native cli to load additional configuration. You can use it to specify various options that you'd otherwise have to pass via command line arguments. Using command line arguments doesn't always work, however. For instance, the XCode project will automatically call the packager without allowing you specify additional arguments. Check out the `rn-cli.config.js` file in this project for a list of possible options it can specify and their explanation.

2. Provide your own transformer implementation. Check out `transformer.js` in this project for an example that uses [babel-plugin-rewrite-require](https://www.npmjs.com/package/babel-plugin-rewrite-require) to rewrite imports of core node.js modules to their browserify equivalents. The browserify polyfills are installed via the `node-libs-browser` package. npm3 is required to install this project so that all dependencies are installed in a flat directory structure.

3. Ensure you're injecting the necessary symbols into the global namespace. A lot of node.js libraries expect `Buffer` and `process` (among others) to be available in the global namespace. See `global.js` in this project for an example.

4. Write code as if you were using node. The `crypto_example.js` file in this project provides an example that uses node's [stream](https://nodejs.org/api/stream.html) and [crypto](https://nodejs.org/api/crypto.html) modules. You can convince yourself that it works in standalone node.js by running `node node.js`. But thanks to the machinery implemented in the previous steps, it'll also work just fine (if a bit slowly) in React Native. Keep in mind, it's just an example...

## Gotchas

The React Native packager is extremely sensitive to the following scenarios:

- Missing files. While webpack, for instance, will happily soldier on if a `require()`ed file is missing, the React Native packager will abort during dependency resolution. I've tried to address that with a couple of configuration options in [babel-plugin-rewrite-require](https://www.npmjs.com/package/babel-plugin-rewrite-require), but YMMV.

- Symlinks. The the React Native packager resolves symlinks differently when running the *server* development compared to running the *bundler* in release mode. Rather than relying on symlinks, I'd recommend adding additional directories to the packager's search path via `getProjectRoots` in `rn-cli.config.js`. Ideally, all your packages are to be found in one big directory tree anyway, whose root might as well be the packager's project root.

- Duplicate modules. Don't let the React Native packager discover multiple installations of React Native, for instance. Node has a fairly logical module resolution pattern, the React Native packager is more of a breadth-first algorithm. Also, node.js cares about the directory name under `node_modules` whereas the React Native packager cares about what `package.json` says. Best to ensure those always match.

- `package.json` aliases. The React Native packager will resolve `browser` or `react-native` aliases specified in a package's `package.json` only within that immediate package, while other tools such as webpack will honor those aliases regardless of context.

## Feedback

I can't promise that I'll be able to respond to issues filed, but they're definiitely welcome. Even more so Pull Requests.
