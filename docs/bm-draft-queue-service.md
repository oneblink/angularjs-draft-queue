# Draft Queue Service

If you need access to the draft queue, inject it into your controllers

```javascript
angular.module('myModule', ['bmDraftQueue'])
  .controller('myController', ['bmDraftQueueService', function (bmDraftQueueService) {
  /* Use the draft queue service here */
  }])
```

## setItem(model, formName) => Promise() => model

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

## instance()

Returns the [Angular LocalForage](https://github.com/ocombe/angular-localForage) instance used for the draft queue, should you need to access it directly

## getItem(uuid)
## removeItem(uuid)
## clear()
## iterate(iterator)
The above methods passes the call to the corresponding methods in [Angular LocalForage](https://github.com/ocombe/angular-localForage#functions-)
