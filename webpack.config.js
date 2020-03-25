module.exports = [
{
  entry: './react/Gibbstack.js',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: 'js/Gibbstack.js'
  },
  mode: 'development',
  // target: 'node'
  watch: true
},{
  entry: './react/Charities.js',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: 'js/Charities.js'
  },
  mode: 'development',
  // target: 'node'
  watch: true
}]