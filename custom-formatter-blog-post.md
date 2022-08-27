---
layout: post
title: Creating a Custom Formatter 
teaser: | 
  Learn how to create a Custom Formatter to customize the ESLint output
  in this post.
authors:
  - bpmutter
categories:
  - Tutorials
tags:
  - Guest Post
  - Custom Formatter
---

In this post, we'll look at how to create [custom formatter](https://eslint.org/docs/latest/developer-guide/working-with-custom-formatter)
for your ESLint project. Custom formatters are JavaScript functions
that let you create a unique output for your linting results.

You might want to make a custom formatter if the formatters built into ESLint
don't meet the needs of your use case. You can learn more about ESLint's built-in
formatters in the [formatter documentation](https://eslint.org/docs/latest/user-guide/formatters/). Some reasons to create a custom formatter include:

* You only want to report specific error types.
* You want to format to the results in a way not supported by a built-in formatter.
* You want to perform an async operation to the results, like sending them to a
  server for further analysis.

By the end of this post, you'll know how to:

* Create an ESLint custom formatter
* Publish it to npm
* Use it in your project

## What You Will Build

In the remainder of this post, we're going to create a custom formatter that
outputs ESLint results to [TOML](https://toml.io/).
TOML is a file format for representing data, similar to JSON or YAML.
Developers often use TOML for config files, as it's optimized for human readability.

The custom formatter we'll build will take an ESLint formatter `results`object
like this:

```js
{
    "extends": "eslint:recommended",
    "rules": {
        "consistent-return": 2,
        "indent"           : [1, 4],
        "no-else-return"   : 1,
        "semi"             : [1, "always"],
        "space-unary-ops"  : 2
    }
}
```

The custom formatter will then create the TOML output:

```toml
extends = "eslint:recommended"

[rules]
consistent-return = 2
indent = [ 1, 4 ]
no-else-return = 1
semi = [ 1, "always" ]
space-unary-ops = 2
```

Then we'll see how to publish the formatter to npm and use it in a project.

## Steps

Before you begin:

1. Have Node.js and npm installed in your development environment.
2. Understanding the basics of Node.js.
3. If you want to publish your custom formatter to npm like we'll cover below,
   [create an npm account](https://www.npmjs.com/signup) and login from the
   [npm CLI](https://docs.npmjs.com/cli/v7/commands/npm-adduser).

### 1. Create Project

First we're going to create the project for our custom formatter.
Since an ESLint custom formatter is just a JavaScript function, let's create a
new project for the custom formatter by running the following:

```sh
mkdir eslint-formatter-toml
cd eslint-formatter-toml
npm init -y
```

Add ESLint to the project:

```sh
npm install eslint --save-dev
```

To set up a basic ESLint configuration, create the file `.eslintrc`
with the following contents:

```json
{
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "env": {
    "es6": true,
    "node": true,
    "jest": true
  }
}
```

For more information on customizing your ESLint configuration,
refer to the [Configuration File documentation](https://eslint.org/docs/latest/user-guide/configuring/configuration-files).

Next, add the [json2toml](https://www.npmjs.com/package/json2toml) package, which we'll use to help convert JavaScript objects to TOML:

```sh
npm install json2toml
```

Now we're ready to write the custom formatter.

### 2. Create the Custom Formatter

Custom formatters are just JavaScript functions that take a `results` object and
optional `context` object as input and return a string as an output.

TODO: expand on above

In the `eslint-formatter-toml` directory, create a new file `formatter.js`.
Now let's create the custom formatter in `formatter.js`:

```js
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

```

### 3. Test the Custom Formatter

With the custom formatter made, let's test it out locally.

Install the JavaScript testing package [Jest](https://jestjs.io/)
and the [toml](https://www.npmjs.com/package/toml) package,
which we'll use to test the custom formatter:

```sh
npm install jest toml --save-dev
```

In your `package.json` file, update our test script to use Jest:

```json
  // ...other config
  "scripts": {
    "test": "jest"
  },
  // ...other config
```

Before writing the test, let's add the directory `test-data` containing the file
`fullOfProblems.js` that has some ESLint errors that we'll run the test on.
Add the following contents to `test-data/fullOfProblems.js`:

```js
function addOne(i) {
    if (i != NaN) {
        return i ++
    } else {
      return
    }
};
```

Now create a file for the test, `formatter.test.js`. In the test file,
we're going to use the [ESLint Node.js API](https://eslint.org/docs/latest/developer-guide/nodejs-api). Add the following code to `formatter.test.js`:

```js
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
```

With everything ready, let's run the test:

```sh
npm test
```

In the terminal you should see the following output with the passing test results:

```console
> eslint-formatter-toml@1.0.0 test
> jest

 PASS  ./formatter.test.js
  ✓ Test TOML formatter (180 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.04 s, estimated 2 s
Ran all test suites.
```

Everything is working as expected!

### 4. Publish to npm

### 5. Use Published Custom Formatter

## Wrapping it up
