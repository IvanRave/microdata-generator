// http://eslint.org/docs/user-guide/configuring
// docs for rules at http://eslint.org/docs/rules/{ruleName}
module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "mocha": true,
    "es6": false,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "airbnb-base"
  ],
  "globals": {},
  "rules": {
    // http://eslint.org/docs/rules/brace-style
    "indent": [
      "error",
      2,
      { "SwitchCase": 1 }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-alert": "off",
    "arrow-body-style": "off",
    "valid-jsdoc": "off",
    "eol-last": "warn",
    "no-lonely-if": "warn",
    "no-case-declarations": "warn",
    "key-spacing": "off",
    "comma-dangle": "off",
    "object-shorthand": "off",
    "global-require": "off",
    "func-names": "off",
    "prefer-arrow-callback": "off",
    "prefer-rest-params": "off",
    "padded-blocks": "warn",
    "prefer-template": "off",
    "vars-on-top": "off",
    "max-len": "off",
    "quote-props": "off",
    "no-unused-expressions": "off",
    "no-underscore-dangle": "off",
    "no-var": "off",
    "strict": "off",
    "no-param-reassign": [ "error", { "props": false }],
    "no-console": "off",
    "spaced-comment": "warn",
    "space-before-function-paren": "off",
    "import/no-extraneous-dependencies": [
      "warn",
      { "devDependencies": true }
    ],
    "no-restricted-syntax": [
      "error",
      "ArrowFunctionExpression",
      "ClassExpression"
    ]
  }
};
