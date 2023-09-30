# User Account Documentation

This is the documentation for all things involving managing and interacting with a user's account.

> The documentation covered here will include:
>
> 1.  Creating an account.
> 1.  Modifying an account.
> 1.  Deleting an account.
> 1.  Signing into an account.
> 1.  Signing out of an account.
>
> In addition to other material

### Prerequisites

A basic understanding of terms used in the documentation is required:

1. The term 'usertag' refers to a unique character string. This is a unique sequence of characters that will only be used by a single account at anyone time. Attempting to, in some manner, duplicating a 'usertag' key, will result in unintended and undocumented errors.
1. The term 'username' refers simply to the users name, and like most sorts of names, there can be duplicates (i.e. 2+ "John Smiths", etc).
1. The term 'email' refers solely to the email used by the account and is used in signing up for the service and logging in. This, like 'usertag', is a unique string, allowing for only a single email per account. No duplicates are allowed. By-passing this system will result in unexpected and undocumented errors.
1. The term 'password' refers to the password supplied by the user at signup. This value is NOT viewable after submittion of the registration form. This password is hashed with a salt before being stored in the database.
1. The term 'error' refers to either an object or a value of '0' or undefined. If error is not '0' or 'undefined', then it is an object containing typically only one field 'msg' which carries a predefined error code string (i.e. 'internal-server-error', 'unknown-usertag', etc). More on the error implementation can be view in the 'Regarding Errors' section.

### Regarding Errors
To learn more about error handling, [click here](./ERRORS.md)

### Global Error Sequences

There are some error sequences that can happen in most, if not all route calls, that should also be considered if they lend themselves to be recoverable. These error sequences include:

1. 'internal-server-error' - This means there has been a critical internal server error that the client cannot recover from. This error typically requires the help of a server maintainer to fix.
1. 'unauthorized' - This means that the resource being requested requires the user be atleast signed into an account. Trying to create a group, for example, requires an account to successfully complete the request. If no account is provided in the cookies, then the server will return an 'unauthorized' error sequence.
1. 'forbidden' - This means, much like 'unauthorized', that the resource being requested can't be given. The difference here, however, is that the account requesting the resource does NOT possess the permissions required to obtain the resources requested. For example, trying to delete a schedule, of whom you are not the owner/admin.

## Creating an Account

Creating an account requires a POST request to the route '/api/account/create'. This HTTP request will also require a JSON formatted body with fields 'usertags', 'username', 'email', 'password'.

#### Server-Bound Request

The HTTP request to this signup route would look something like:

```
POST http://localhost:5000/api/account/create
Content-Type: application/json
```
with a body consisting of
```json
{
  "usertag": "<usertag>",
  "username": "<username>",
  "email": "<email>",
  "password": "<password>"
}
```

All four requests are required for this HTTP request to NOT send back an error.

#### Client-Bound Responses

The response returned by the server will follow standard error formatting convention documented above with a single caveat. There will be an additional field 'redirect' in case the 'error' is set to either '0' or 'undefined'.

This 'redirect' field will contain the route to redirect to preferably. In the case of creating an account, this redirect is not necessary.

An example of a successful response could look like:

```json
{
  "error": 0,
  "redirect": "/"
}
```

Otherwise, if 'error' is anything but a successful value, then the standard representation of errors as documented in the _Regarding Errors_ section is used.

The various value possible for the error sequence 'msg' field include:

1. 'usertag-taken' - This means that the usertag supplied in the HTTP request has already been claimed by another account.
1. 'email-taken' - This means that the email supplied in the HTTP request has already been claimed by another account.
1. 'internal-server-error' - Refer to the _Global Error Sequences_ section.

## Modifying an Account.

Modifying an account requires a POST request to the route '/api/account/modify'. This HTTP request will also require a JSON formatted body. The contents of the body, however, are NOT all required at the same time, only at least one is required per request.

#### Server-Bound Request

The HTTP request to the modify route would look something like:

```
POST http://localhost:5000/api/account/modify
Content-Type: application/json
```
with a body consisting of
```json
{
  "new_username": "<account's new username>",
  "new_email": "<account's new email>",
  "new_password": "<account's new password>"
}
```

These fields are all optional, a request that tries to only set a new email is just as valid as a request to set all three fields to new values.

#### Client-Bound Responses

The response returned by the server will follow standard error formatting convention documented in the _Regarding Errors_ section.

The various value possible for the error sequence 'msg' field include:

1. 'no-change-requested' - This means that the request body sent with the HTTP request was empty. Since no modifications were to be made, an error stating such is returned to the client.
1. 'usertag-NOT-found' - This means that the 'usertag' provided in the body of the HTTP request is NOT conatined within the database. There is no account associated with this 'usertag'.
1. 'new-email-already-taken' - This means that the email provided in the body of the HTTP request is already associated with another account.
1. 'unauthorized' - Refer to the _Global Error Sequences_ section.
1. 'forbidden' - Refer to the _Global Error Sequences_ section.
1. 'internal-server-error' - Refer to the _Global Error Sequences_ section.

## Deleting an Account.

The HTTP request sent to the server will be a POST to the route '/api/account/delete'. To run this HTTP request and receive a successful response, the client must be signed-into an account.

#### Server-Bound Request

This request will require a session cookie; without a session cookie, the server will have no way of knowing who the requester is. It will deduce that the requester is NOT signed-in if no 'session' cookie is present as part of the HTTP request.

> Cookies are automatically sent with every HTTP request by default. The browser handles this internally, so all the client-side engineers will need to worry about is that the 'session' cookie is set with the 'session' returned by the signin route.

The POST command will look something like:

```
POST http://localhost:5000/api/account/delete
```

**_No body is needed to run the delete account route._**

#### Client-Bound Responses

The response returned by the server will follow standard error formatting convention documented in the _Regarding Errors_ section.

The various value possible for the error sequence 'msg' field include:

1. 'usertag-NOT-known' - This means that the usertag provided in the cookies is not associated with an account in the database. **This should never occur in production!**
1. 'unauthorized' - Refer to the _Global Error Sequences_ section.
1. 'forbidden' - Refer to the _Global Error Sequences_ section.
1. 'internal-server-error' - Refer to the _Global Error Sequences_ section.

## Signing into an Account.

Signing into an account requires a POST request to the route 'api/account/signin'. This HTTP request requires two fields, namely 'email' and 'password'. Without either of these, the server will return an error

#### Server-Bound Request

The request sent to the server will look something like:

```
POST http://localhost:5000/api/account/signin
Content-Type: application/json
```
with a body consisting of
```json
{
  "email": "<account's email>",
  "password": "<account's password>"
}
```

The password provided will be hashed and check against the password present in the database. If they match then a successful response is sent, otherwise, and error message is sent.

#### Client-Bound Responses

The response returned by the server will follow standard error formatting convention documented in the _Regarding Errors_ section. There is a single caviot however. In the case that the request was successful, the response will have an additional field 'session'. This field will contain the JWT generated by the server. The client-side engineers will need to set this String as a cookie, whose key has to be 'session'. A redirect is **STRONGLY** encouraged, as seeing this will make the 'session' cookie, if it exists, into an HTTPOnly cookie, making is resistent to Cross-Site Scripting attacks.

In practice, this would look something like:

```json
{
  "error": 0,
  "session": "<The JWT token>"
}
```

If, however, the request failed, then the error message sent back follows the conventions outlined in the _Regarding Errors_ section.

The various value possible for the error sequence 'msg' field include:

1. unknown-email - This means that the email provided in the HTTP request body is NOT associated with any account in the database.
1. incorrect-password - This Means that the password provided, did NOT match the password hash in the database.
1. 'unauthorized' - Refer to the _Global Error Sequences_ section.
1. 'forbidden' - Refer to the _Global Error Sequences_ section.
1. 'internal-server-error' - Refer to the _Global Error Sequences_ section.

## Signing-out of an Account.

Signing out of an account requires a POST to the route '/api/account/signout'. The client must be signed-in for this request to response with a success.

> **NOTE:** This route will simply delete the server-generated cookies stored on the client's browser.

#### Server-Bound Request

This request requires no body, just a session cookie, which is automatically sent by the browser for every request.

The request to the signout route would look something like:

```
POST http://localhost:5000/api/account/signout
```

**_No body is needed to run the signout account route._**

#### Client-Bound Responses

The response returned by the server will follow standard error formatting convention documented in the _Regarding Errors_ section.

The various value possible for the error sequence 'msg' field include:

1. 'unauthorized' - Refer to the _Global Error Sequences_ section.
1. 'forbidden' - Refer to the _Global Error Sequences_ section.
1. 'internal-server-error' - Refer to the _Global Error Sequences_ section.
