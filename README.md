# restful-node-api

Boilerplate for a RESTful API built on Node.js w/ Express & MongoDB

CRUD endpoints for Authentication, Users, and Products w/ tags & comments.

[Passport.js](http://passportjs.org/) used for Authentication and issuing of token.  Custom middleware to validate token and check authorization on routes.


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

## Installation

Clone this repository then:

```sh
cd restful-node-api
npm install
```

## Middleware

**isAuthenticated** - Verifies token provided by request

**belongsTo** -  Checks if user belongs to token provider

**belongsToUser** - Checks if product belongs to token provider

**isCommentAuthor** - Checks if comment belongs to token provider


## Endpoints

| Route         | HTTP Method | Middleware  | Description |
| ------------- | ----------- | ----------- | ----------- |
| /authenticate | POST        | Passport.js | Calls Passport.js basic or local strategy to verify username and passport. Then issue a token |
| /api/v1/users | GET         | isAuthenticated | Gets all users |
| /api/v1/users | POST        |             | Creates a new user |
| /api/v1/users/:user_id | GET | isAuthenticated | Gets a single user |
| /api/v1/users/:user_id | PUT | isAuthenticated, belongsTo | Updates user data |
| /api/v1/users/:user_id | DELETE | isAuthenticated, belongsTo | Deletes user |
| /api/v1/users/:user_id/products | GET |   | Gets all products belonging to user |
| /api/v1/products/ | GET     |             | Gets all products |
| /api/v1/products/ | POST    | isAuthenticated | Creates a new product |
| /api/v1/products/:product_id | GET |      | Gets a single product |
| /api/v1/products/:product_id | PUT | isAuthenticated, belongsToUser | Updates a product |
| /api/v1/products/:product_id | DELETE | isAuthenticated, belongsToUser | Deletes a product |
| /api/v1/products/:product_id/removeTags | PUT | isAuthenticated, belongsToUser | Removes tags from product |
| /api/v1/products/:product_id/addComment | PUT | isAuthenticated, belongsToUser | Adds tags to product |
| /api/v1/products/:product_id/:comment_id | PUT | isAuthenticated, isCommentAuthor | Update comment child |
| /api/v1/products/:product_id/:comment_id | DELETE | isAuthenticated, isCommentAuthor | Deletes comment child |


## TODO
- Secure authentication routes with SSL/TLS
- Implement shorthand methods for controllers: update, addComment, etc.
- Improve middlewares
