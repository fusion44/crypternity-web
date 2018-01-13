module.exports = {
  root: true,
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true,
    jest: true
  },
  extends: "standard",
  // required to lint *.vue files
  plugins: ["html"],
  // add your custom rules here
  rules: {
    "space-before-function-paren": 0,
    quotes: [2, "double"]
  },
  globals: {}
}
