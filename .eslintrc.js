module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'airbnb-base',
  globals: {
    __static: true
  },
  plugins: [
    'html',
    'flowtype-errors'
  ],
  'rules': {
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    'no-multi-assign': 0,
    'no-underscore-dangle': 0,
    'class-methods-use-this': 0,
    'flowtype-errors/show-errors': 2,
    'no-plusplus': 0,
    'one-var': 0,
    'no-unused-vars': 1,
    'prefer-destructuring': 0,
    'function-paren-newline': 0,
    'object-curly-newline': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
};
