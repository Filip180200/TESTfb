import path from 'path';
import webpack from 'webpack';
import fs from 'fs';
import glob from 'glob';
import { fileURLToPath } from 'url';
import NodemonPlugin from 'nodemon-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationFiles = glob.sync('./migrations/*');
const migrationEntries = migrationFiles.reduce((acc, migrationFile) => {
  const entryName = migrationFile.substring(
      migrationFile.lastIndexOf('/') + 1,
      migrationFile.lastIndexOf('.')
  );
    acc[entryName] = migrationFile;
    return acc;
  }, {});

const isProduction = process.env.NODE_ENV === "production";
var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
      return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
      nodeModules[mod] = 'commonjs ' + mod;
    });

export default function(_env, argv) {
  return {
    entry: {
      index: path.resolve(__dirname, "server.js"),
      ...migrationEntries,
    },
    target: 'node',
    output: {
      path: path.resolve(__dirname, "db"),
      filename: chunkData => {
        if (chunkData.chunk.name === 'index') return './[name].js';
        if (Object.keys(migrationEntries).includes(chunkData.chunk.name)) return `./migrations/[name].js`;
      },
      publicPath: "/",
      libraryTarget: 'umd'
    },
    externals: nodeModules,
    module: {
      rules: [{
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { babelrc: true }
        }
      }]
    },
    resolve: {
      extensions: ["*", ".js"]
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          isProduction ? "production" : "development"
        ),
        "process.env.IP_ADDRESS": JSON.stringify(
          isProduction ? "3.97.196.198" : "localhost"
        ),
      }),
      new NodemonPlugin(),
      new webpack.IgnorePlugin({
        resourceRegExp: /^cardinal$/,
        contextRegExp: /./,
      }),  
    ],
    experiments: {
      topLevelAwait: true
    },
  }
}
