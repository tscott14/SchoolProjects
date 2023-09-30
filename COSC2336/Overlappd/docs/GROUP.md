# Group Scheduler Documentation

This is the documentation for all things involving managing and interacting with a group/scheduler.

> The documentation covered here will include:
>
> 1.  Creating a Group.
> 1.  Modifying a Group.
> 1.  Deleting a Group.
> 1.  Getting a Group Preview
> 1.  Getting a Group's Users
> 1.  Getting a specific Group's User
> 1.  Getting a Group's Schedule
>
> In addition to other material

### Prerequisites

A basic understanding of terms used in the documentation is required:

1. The term 'gtag' refers to a unique sequence of characters that can only belong to a single group at any one time. This is used as an identifier or key to locate a specific group.
1. The term 'title' refers to the display name of the group. This is NOT unique, thus meaning that several groups can have an identical 'title'.
1. The term 'pfp' refers to the URL of the profile picture used in previewing and viewing the group. _[This is thus-far unimplemented!]_
1. The term 'summary' refers to a short body of text, no larger than a paragraph, that is used to describe the purpose of the group. _[This is thus-far unimplemented!]_
1. The term 'users' refers to a list of users. This can mean diffrent object formats depending on the usage, but will always conatin a list of usertags, typically with other data associated with them.
1. The term 'schedule' refers to a 2D-array of either booleans or numbers depending on the context.

### Regarding Errors

To learn more about error handling, [click here](./ERRORS.md)

## Creating a Group

The task of the create group route is to create a group, and add the account associated with its creation as owner. Other users can be added only after a group is created.

#### Server-Bound Request

The HTTP request needed to run the Create Group Route is:

```
POST http://localhost:5000/api/group/create
Content-Type: application/json
```

With a body consisting of

```json
{
	"gtag": "<gtag>",
	"title": "<group display name>",
	"pfp": "<URL to the profile picture>"
}
```

#### Client-Bound Response

In response, a basic response is sent as outlined in the _Regarding Errors_ section.

Possible values for the error sequence 'msg' include:
1. 'gtag-NOT-provided' - The 'gtag' was NOT provided in the HTTP requests body.
1. 'group-title-NOT-provided' - The 'title' was NOT provided in the HTTP requests body.
1. 'gtag-taken' - The 'gtag' provided is already taken by a group.
1. 'unauthorized' - Refer to the _Global Error Sequences_ section.
1. 'internal-server-error' - Refer to the _Global Error Sequences_ section.

## Modifying a Group

The task of the modify group route is to change or mutate some attribute of a group such as the groups title, profile picture, or other data. To run this, an account with valid authority will be required; this could be an owner, and admin, or whoever is given specific permissions to make such changes.

#### Server-Bound Request

The HTTP request needed to run the Modify Group Route is:

```
POST http://localhost:5000/api/group/modify
Content-Type: application/json
```

With a body consisting of

```json
{
	"gtag": "<group's gtag>",
	"new_users": [
		"<new example usertag 1>",
		"<new example usertag 2>",
		"<new example usertag 3>"
	],
	"new_title": "<new title>",
	"new_pfp": "<new profile picture URL>"
}
```

#### Client-Bound Response

In response, a basic response is sent as outlined in the _Regarding Errors_ section.

Possible values for the error sequence 'msg' include:
1. 'unknown-gtag' - This means that the gtag provided does NOT match any groups conatined within the database.
1. 'no-change-requested' - This means that the body sent was empty. No changes could be made.
1. 'unauthorized' - Refer to the _Global Error Sequences_ section.
1. 'forbidden' - Refer to the _Global Error Sequences_ section.
1. 'internal-server-error' - Refer to the _Global Error Sequences_ section.

## Deleting a Group

The task of deleting a group is to remove a group from the database, alongside with removing the group's 'gtag' from every user associated with the group. Once a group is deleted, it is unrecoverable.

#### Server-Bound Request

The HTTP request needed to run the Delete Group Route is:

```
POST http://localhost:5000/api/group/delete
Content-Type: application/json
```

```json
{
	"gtag": "<group's gtag>"
}
```

#### Client-Bound Response

In response, a basic response is sent as outlined in the _Regarding Errors_ section.

Possible values for the error sequence 'msg' include:
1. 'gtag-NOT-specified' - The 'gtag' was NOT provided in the HTTP requests body.
1. 'gtag-NOT-found' - The 'gtag' provided does not match any 'gtags' present in the database.
1. 'unauthorized' - Refer to the _Global Error Sequences_ section.
1. 'internal-server-error' - Refer to the _Global Error Sequences_ section.

## Getting Group Preview

The task of previewing a group is to get basic information about a group. This information could include subjects such as profile pictures, group title, or even a limited list of users. No special permission is needed for this call.

#### Server-Bound Request

The HTTP request needed to run the Get Group Preview Route is:

```
GET http://localhost:5000/api/group/dnd/view/
```

**_No body is needed to run the Get Group Preview Route._**

#### Client-Bound Response

The response sent by the server will be a basic response as outlined in the _Regarding Errors_ Section, however, there will also be several additional fields to consider.

In the case that the response was successful, the response will be:

```json
{
	"error": 0,
	"gtag": "<group's gtag>",
	"title": "<group's title>",
	"pfp": "<group's profile picture Lnk>",
	"users": ["example usertag 1", "example usertag 2", "example usertag 3"]
}
```

Each of these fields is covered in the _Prerequisites_ Section. The 'users' field in this context will refer to a flat list of just 'usertag's.

In cases where this request fails however, a basic error response is sent to the client as covered in the _Regarding Errors_ Section.

Possible values for the error sequence 'msg' include:
1. 'gtag-param-NOT-supplied' - This is a server-side error and should never be given to the client-user.
1. 'gtag-NOT-known' - The gtag provided does not match any 'gtags' present in the database.
1. 'internal-server-error' - Refer to the _Global Error Sequences_ section.

## Getting Group Users

The task of getting a group's users is to retrieve all users associated with a group. This will require proper authorization, so a client must be signed into an account in-order for this task to pass.

#### Server-Bound Request

The HTTP request needed to run the Get Group Users Route is:

```
GET http://localhost:5000/api/group/dnd/users
```

**_No body is needed to run the Get Group Users Route._**

#### Client-Bound Response

The response sent by the server will be a basic response as outlined in the _Regarding Errors_ Section, however, there will be additional fields to consider.

Upon a successful request, the result returned to the client will be:

```json
{
	"error": 0,
	"users": [
		{
			"usertag": "example usertag 1",
			"role": "owner"
		},

		{
			"usertag": "example usertag 2",
			"role": "admin"
		},
		{
			"usertag": "example usertag 3",
			"role": "member"
		}
	]
}
```

Each of these fields is covered in the _Prerequisites_ Section. The 'users' field in this context will refer a series of objects, each containing a field 'usertag' and a field 'role', with the 'usertag' referring to a specific account, while 'role' will mark the role that that user plays in the group.

In cases where this request fails however, a basic error response is sent to the client as covered in the _Regarding Errors_ Section.

Possible values for the error sequence 'msg' include:
1. 'gtag-param-NOT-supplied' - This is a server-side error and should never be handled by the client
1. 'gtag-NOT-known' - The 'gtag' provided was not found in the database.
1. 'internal-server-error' - Refer to the _Global Error Sequences_ section.

## Getting Group User

The task of getting a specific group's user involves getting the usertag, permissions, and any later data associated with a Group User. This action requires proper authorization (Not implemented however).

#### Server-Bound Request

The HTTP request needed to run the Get Group User Route is:

```
GET http://localhost:5000/api/group/dnd/users/test-tag0011
```

**_No body is needed to run the Get Group User Route._**

#### Client-Bound Response

The response sent by the server will be a basic response as outlined in the _Regarding Errors_ Section, however, there will be additional fields to consider.

Upon a successful request, the result returned to the client will be:

```json
{
	"error": 0,
	"usertag": "<example usertag 1>",
	"role": "<role>"
}
```

Each of these fields is covered in the _Prerequisites_ Section.

In cases where this request fails however, a basic error response is sent to the client as covered in the _Regarding Errors_ Section.

Possible values for the error sequence 'msg' include:
1. 'gtag-param-NOT-supplied' - Server-side error that the client should never encounter.
1. 'user-param-NOT-supplied' - Server-side error that the client should never encounter.
1. 'unknown-gtag' - This means that the gtag provided does NOT match any groups conatined within the database.
1. 'usertag-NOT-found-in-group' - The 'usertag' provided does NOT exist in the users of the group whose 'gtag' is supplied.
1. 'internal-server-error' - Refer to the _Global Error Sequences_ section.

## Getting Group Schedule

The task of retrieving a groups collective schedule involves retrieving the schedules of all users in a group, calculating the collective sum of all users available in every timeslot and returning this, along side other important data, to the client for processing.

#### Server-Bound Request

The HTTP request needed to run the Get Group Schedule Route is:

```
GET http://localhost:5000/api/group/dnd/schedule/
```

**_No body is needed to run the Get Group Schedule Route._**

#### Client-Bound Response

The response sent by the server will be a basic response as outlined in the _Regarding Errors_ Section, however, there will be additional fields to consider.

Upon a successful request, the result returned to the client will be:

```json
{
	"error": 0,
	"gtag": "<group's gtag>",
	"title": "<group's title>",
	"user_count": "<Some Number>",
	"schedule": [
		[1, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0]
	],
	"users": [
		{
			"usertag": "<example usertag 1>",
			"username": "<example username 1>",
			"role": "<example role owner>",
			"schedule": [
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0]
			]
			/*This schedule can be interpreted as a 2D boolean array by useing javascripts '==' instead of the '===' operator.*/
		}
	]
}
```

Each of these fields is covered in the _Prerequisites_ Section.

In cases where this request fails however, a basic error response is sent to the client as covered in the _Regarding Errors_ Section.

Possible values for the error sequence 'msg' include:
1. 'gtag-param-NOT-supplied' - This is a server-side error and should never be seen by the client.
1. 'unknown-gtag' - This means that the gtag provided does NOT match any groups conatined within the database.
1. 'internal-server-error' - Refer to the _Global Error Sequences_ section.