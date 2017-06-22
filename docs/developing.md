# Developing

You will need [Gulp](http://gulpjs.com/) installed globally to build or test the source.

All source files are located in `src/`. Tests are in `test/`

## Building the distribution files

`npm run build` - creates `dist/bm-angularjs-draft-queue.js` and `dist/bm-angularjs-draft-queue.min.js`

## Testing

`npm test` - [Jasmine](https://jasmine.github.io/api/2.6/global) unit tests running in [Karma](https://karma-runner.github.io/1.0/index.html)
`npm run test-e2e` - [Protractor](http://www.protractortest.org/#/) e2e tests
`npm run test-human` - an interactive e2e test
