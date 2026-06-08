const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const config = {
  target: "web",
  devtool: "source-map",
  mode: "development",
  watch: true,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 500,
    ignored: /node_modules/,
  },
  resolve: {
    extensions: ["", ".ts", ".js", ".jsx", ".css"],
    fallback: {
      stream: false,
      buffer: false,
      os: false,
      crypto: false,
      zlib: false,
      url: false,
      http: false,
      https: false,
      vm: false,
      querystring: false,
      constants: false,
      assert: false,
      fs: false,
      worker_threads: false,
      child_process: false,
      inspector: false,
      path: false
    },
  },
  module: {
    //rules的值是一個陣列可以存放多個loader物件
    rules: [
      {
        test: /.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],

  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "node_modules/onnxruntime-web/dist/*.wasm", to: "[name][ext]" },
        { from: "node_modules/@tensorflow/tfjs-backend-wasm/dist/*.wasm", to: "[name][ext]" },
      ],
    })
  ],
};

// plugins: [
//   new CopyPlugin({
//     patterns: [
//       { from: "node_modules/onnxruntime-web/dist/*.wasm", to: "[name][ext]" },
//     ],
//   })
// ],

const Login = Object.assign({}, config, {
  entry: ["./src/login.jsx"],
  output: {
    path: path.resolve(__dirname, "static/js"),
    // publicPath: '/dist',
    filename: "login.js",
  }
});


const Main = Object.assign({}, config, {
  entry: ["./src/main.jsx"],
  output: {
    path: path.resolve(__dirname, "static/js"),
    // publicPath: '/dist',
    filename: "main.js",
  }
});

module.exports = [Main,Login];