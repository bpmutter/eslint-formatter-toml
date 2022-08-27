// Import package to convert JS objects to TOML
const json2tomlConverter = require('json2toml');

/**
 * Custom formatter function that takes ESLint results and converts to TOML.
 * @param {result[]} results See ESLint docs for more info on result object: 
 *    https://eslint.org/docs/latest/developer-guide/working-with-custom-formatters#the-result-object 
 * @returns {string} string representation of TOML results
 */
function formatTOML(results){
  const tomlResults = json2tomlConverter(results);
  return tomlResults;
}

// Exported custom formatter function
module.exports = formatTOML;
