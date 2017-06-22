# Data format

The data in the pending queue is stored with a uuid for the key, and an object with the request and response params as the value.

```json
{
  "dateCreated": 1496806628563,
  "dateUpdated": 1496806628563,
  "form": "formName",
  "model": {
    /* form data */
  }
}

```
