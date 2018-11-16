module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:react/recommended",
    "prettier",
    "prettier/react",
  ],
  env: {
    browser: true, es6: true, jest: true, node: true,
  },
  plugins: [
    "react",
    'prettier',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', // next.js does this for us
    'react/prop-types': 'off', // don't use prop types :P
    'no-console': ['error', { allow: ['warn', 'error'] }], // no console.log, but can use .warn and .error.
    'prettier/prettier': ['error', {
      trailingComma: 'es5',
      singleQuote: true,
    }]
  },
  settings: {
    react: {
      version: '16.6'
    }
  }
}
