const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/widget.js',
  output: {
    filename: 'widget.js',
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
      systemvars: true, // Load all system environment variables as well
      safe: true // Load '.env.example' to verify the '.env' variables are all set
    })
  ]
}; 