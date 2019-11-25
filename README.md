# testcafe-reporter-new-html-reporter
[![Build Status](https://travis-ci.org/sivanisentinel/testcafe-reporter-new-html-reporter.svg)](https://travis-ci.org/sivanisentinel/testcafe-reporter-new-html-reporter)

This is the **new-html-reporter** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/sivanisentinel/testcafe-reporter-new-html-reporter/master/media/preview.png" alt="preview" />
</p>

## Install

```
npm install testcafe-reporter-new-html-reporter
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter testcafe-reporter-new-html-reporter
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('new-html-reporter') // <-
    .run();
```

## Author
Sivan Israelov 
