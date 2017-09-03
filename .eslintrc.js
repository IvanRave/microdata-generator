// http://eslint.org/docs/user-guide/configuring
// docs for rules at http://eslint.org/docs/rules/{ruleName}
module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "mocha": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "globals": {},
  "rules": {
    // http://eslint.org/docs/rules/brace-style
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1,
        "MemberExpression": "off",
        "FunctionDeclaration": {
          "parameters": "first"
        },
        "FunctionExpression": {
          "parameters": "first"
        },
        "CallExpression": {
          "arguments": "first"
        }
      }
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
    "no-alert": "warn",
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
    "padded-blocks": "off",
    "prefer-template": "off",
    "vars-on-top": "off",
    "max-len": "off",
    "quote-props": "off",
    "no-unused-expressions": "off",
    "no-underscore-dangle": "off",
    "no-var": "warn",
    "strict": "off",
    "no-param-reassign": [ "error", { "props": false }],
    "no-console": "off",
    "spaced-comment": "warn",
    "space-before-function-paren": "off",
    "no-restricted-syntax": [
      "error",
      "ArrowFunctionExpression",
      "ClassExpression"
    ]
  }
};
