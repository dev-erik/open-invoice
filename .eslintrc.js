module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'no-prototype-builtins': 'off',
    camelcase: 'off',
    'class-methods-use-this': 'off',
    'no-plusplus': 'off',
    'max-len': 'off',
    'import/prefer-default-export': 'off',
    radix: 'off',
    'prefer-destructuring': 'off',
    'no-mixed-operators': 'off',
    'vue/require-v-for-key': 'off',
    'import/extensions': 'off',
    'linebreak-style': ['off'],
    'object-shorthand': 'off',
    'import/no-cycle': 'off'
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
};
