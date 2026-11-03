const js = require("@eslint/js");

module.exports = [
  {
    // Definimos explícitamente que este archivo de config usa Node y CommonJS
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        process: "readonly"
      }
    }
  },
  js.configs.recommended,
  {
    files: ["src/**/*.js", "scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        node: true,
        process: true,
        __dirname: true,
        console: true
      }
    }
  }
];