# User Registration and Login Endpoints

## User Registration Endpoint

### Endpoint
POST /users/register

### Description
This endpoint registers a new user in the system. It validates the incoming data and creates a user record in the database. On successful registration, it returns a JWT authentication token along with the user details.

### Required Data Format
The request body should be in JSON format with the following fields:

- **fullname**: An object containing the user's name details.
  - **firstname** (string, required): Must be at least 3 characters long.
  - **lastname** (string, optional): If provided, must be at least 3 characters long.
- **email** (string, required): Must be a valid email address, at least 5 characters long.
- **password** (string, required): Must be at least 6 characters long.

### Example Request
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "johndoe@example.com",
  "password": "securePassword123"
}
```

### Response Data Format
The response will be in JSON format with the following fields upon a successful registration:

- **token**: (string, required) A JWT token for authenticating the user.
- **user**: (object, required) The created user's data which includes:
  - **fullname**: (object)
    - **firstname** (string): The user's first name.
    - **lastname** (string or null): The user's last name.
  - **email**: (string): The user's email address.
  - **socialId**: (string or null): The associated social ID if any.
  - **createdAt**: (string): The timestamp (ISO format) when the user was created.
  - **updatedAt**: (string): The timestamp (ISO format) when the user was last updated.
  - **__v**: (number): The document version key.

### Example Response

#### Success (201 Created)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "johndoe@example.com",
    "socialId": null,
    "createdAt": "2025-05-29T12:00:00.000Z",
    "updatedAt": "2025-05-29T12:00:00.000Z",
    "__v": 0
  }
}
```

#### Additional Full Example of the Success Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfcmF0ZSI6IjEyMzQiLCJpYXQiOjE2MDEyMzQ1NjB9.abcdef1234567890",
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "johndoe@example.com",
    "socialId": null,
    "createdAt": "2025-05-29T12:00:00.000Z",
    "updatedAt": "2025-05-29T12:00:00.000Z",
    "__v": 0
  }
}
```

#### Error (400 Bad Request)
```json
{
  "errors": [
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

#### Error (400 Email Already Exists)
```json
{
  "error": "Email already exists"
}
```

#### Error (500 Internal Server Error)
```json
{
  "error": "Internal server error"
}
```

---

## User Login Endpoint

### Endpoint
POST /users/login

### Description
This endpoint authenticates an existing user in the system using their email and password. Upon successful authentication, it returns a JWT token along with the user's data.

### Required Data Format
The request body should be in JSON format with the following fields:

- **email** (string, required): Must be a valid email address, at least 5 characters long.
- **password** (string, required): Must be at least 6 characters long.

### Example Request
```json
{
  "email": "johndoe@example.com",
  "password": "securePassword123"
}
```

### Response Data Format
The response will be in JSON format with the following fields upon a successful login:

- **token**: (string, required) A JWT token for authenticating the user.
- **user**: (object, required) The logged in user's data which includes:
  - **fullname**: (object)
    - **firstname** (string): The user's first name.
    - **lastname** (string or null): The user's last name.
  - **email**: (string): The user's email address.
  - **socialId**: (string or null): The associated social ID if any.
  - **createdAt**: (string): The timestamp (ISO format) when the user was created.
  - **updatedAt**: (string): The timestamp (ISO format) when the user was last updated.
  - **__v**: (number): The document version key.

### Example Response

#### Success (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "johndoe@example.com",
    "socialId": null,
    "createdAt": "2025-05-29T12:00:00.000Z",
    "updatedAt": "2025-05-29T12:00:00.000Z",
    "__v": 0
  }
}
```

#### Error (400 Bad Request)
```json
{
  "errors": [
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    },
    {
      "msg": "Please enter a valid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### Error (404 Not Found)
```json
{
  "message": "Invalid email or password"
}
```

#### Error (401 Unauthorized)
```json
{
  "message": "Invalid email or password"
}
```

#### Error (500 Internal Server Error)
```json
{
  "error": "Internal server error"
}
```