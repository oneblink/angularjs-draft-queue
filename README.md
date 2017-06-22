# AngularJS Draft Queue [![npm](https://img.shields.io/npm/v/@blinkmobile/angularjs-draft-queue.svg?maxAge=2592000)](https://www.npmjs.com/package/@blinkmobile/angularjs-draft-queue)

A tiny wrapper around [Angular LocalForage](https://github.com/ocombe/angular-localForage) for Blink Forms to help with auto-saving form entries

# Installation

`npm i --save @blinkmobile/angularjs-draft-queue`

# Usage

Include the script in your build/minification process or directly in HTML:

```html
<script src="/node_modules/@blinkmobile/angularjs-draft-queue/dist/bm-angularjs-draft-queue.js"></script>
```

then configure the draft queue to use a table in the `bmDrafts` local db

```javascript
angular.module('forms', ['bmDraftQueue' /*... other deps */])
       .config(['draftQueueProvider', function (draftQueueProvider) {
          draftQueueProvider.config({appName: 'demoApp'})
       }])
angular.bootstrap(document, ['forms'])
```

# Injectables

- `draftQueueList` - Component that displays the items saved in the pending queue
- `bmDraftQueueService` - Service that wraps LocalForage to save data to the device in a specific format. Broadcasts events on `$rootScope`
# bmDraftQueueService (service)

# Developing

Gulp is used for building the `dist/` folder and running the karma tests.

For convenience, npm scripts have been setup to run Gulp

`npm test` - `gulp test-single run`
`npm run test-e2e` - run protractor e2e tests
`npm run test-human` - starts a local web server and opens a browser for human testing
`npm run build` - create the `dist/` folder with both unminified and minified files
