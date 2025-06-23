const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (env) => {
  const isCDN = env && env.cdn;
  
  return {
    entry: './src/widget.js',
    output: {
      filename: isCDN ? 'widget-cdn.js' : 'widget.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'AgenticChatbot',
      libraryTarget: 'umd',
      globalObject: 'this',
      libraryExport: 'default'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new Dotenv({
        systemvars: true,
        safe: true,
        // For CDN builds, we can override environment variables
        ...(isCDN && {
          path: path.resolve(__dirname, '.env.cdn') // Optional: separate CDN env file
        })
      })
    ]
  };
}; 