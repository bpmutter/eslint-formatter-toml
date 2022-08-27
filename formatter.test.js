const { ESLint } = require('eslint');
const toml = require('toml');

test("Test TOML formatter", async () => {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(['test-data/fullOfProblems.js']);

  const tomlFormatter = await eslint.loadFormatter('./formatter.js')
  const tomlResults = tomlFormatter.format(results);
  const tomlBackToJs = toml.parse(tomlResults);

  // Check parsing back to JS
  expect(tomlBackToJs.errorCount).toBe(3);

  // Uncomment the following line to see the results
  // console.log(tomlResults);
});