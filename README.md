# restful-node-api

Boilerplate for a RESTful API built on Node.js w/ Express & MongoDB

CRUD endpoints for Authentication, Users, and Products w/ tags & comments


## config.js

Add this to your root directory:

```javascript
// /config.js
module.exports = {
  'port': process.env.PORT || 8080,
  'database': 'mongodb://[username:password@][host][port]/[databasename]',
  'secret': 'YOURSUPERSECRET'
};
```

## TODO
- Secure authentication routes with SSL/TLS
- Implement shorthand methods for controllers: update, addComment, etc.