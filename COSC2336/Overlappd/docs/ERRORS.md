# Regarding Errors

The format that errors are returned in almost always follow the pattern illistrated below unless otherwise acknowledged not to. These errors always take the form:

```json
{
  "error": "<value>"
  /* Possibly other data as well. */
}
```

where '\<value\>' can either be a successful state, in which case, the value in-place of '\<value\>' will be either '0' or 'undefined', or it can be an unsuccessful state, in which case the value of '\<value\>' will be an object taking the form:

```json
{
  "msg": "<error message>"
}
```

where '\<error message\>' is a predefined character string. These character sequences can be found in each routes documentation separately.

An example of a successful state would be:

```json
{
  "error": 0
}
```

while and example of an unsuccessful state could be:

```json
{
  "error": {
    "msg": "unauthorized"
  }
}
```