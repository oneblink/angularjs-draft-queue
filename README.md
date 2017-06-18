# AngularJS Draft Queue [![npm](https://img.shields.io/npm/v/@blinkmobile/angularjs-draft-queue.svg?maxAge=2592000)](https://www.npmjs.com/package/@blinkmobile/angularjs-draft-queue)

A tiny wrapper around [Angular LocalForage](https://github.com/ocombe/angular-localForage) for Blink Forms to help with auto-saving form entries

# Installation

`npm i --save @blinkmobile/angularjs-draft-queue`

## Usage

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

## API

### draftQueue (service)

#### setItem(model, formName) => Promise() => model

Saves or updates a model in the devices local storage. New models are saved with the following structure:

```json
{
  model: {_uuid: '', /* ... form data */ },
  form: formName,
  dateCreated: createdDate,
  dateModified: createdDate
}
```
Updated models keep the original form name and date created.

#### instance()

Returns the [Angular LocalForage](https://github.com/ocombe/angular-localForage) instance used for the draft queue, should you need to access it directly

#### getItem(uuid)
#### removeItem(uuid)
#### clear()

The above methods passes the call to the corresponding methods in [Angular LocalForage](https://github.com/ocombe/angular-localForage#functions-)


# Developing

Gulp is used for building the `dist/` folder and running the karma tests.

For convenience, npm scripts have been setup to run Gulp

`npm test` - `gulp test-single run`
`npm run test-e2e` - run protractor e2e tests
`npm run test-human` - starts a local web server and opens a browser for human testing
`npm run build` - create the `dist/` folder with both unminified and minified files
