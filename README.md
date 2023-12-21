# Authentication Service API

This is a Node JS project to provide service authentication

[mongoDB](https://www.mongodb.com/try/download/enterprise) is being used as a database

## Installation

You need to have installed [node js](https://nodejs.org/en) from his official website  

Clone the repository

```bash
git clone https://github.com/Kurmi-org/Kurmi-app.git
```
move to the directory that contains the project and install the libraries with

```bash
npm install
```

## Usage

First you need to define the environment variables, you must create an **.env** file 
```bash
PORT=3000
MONGODB_CONECT=link_to_database
JWT_SECRET=json_web_token_key
API_KEY_EMAIL_RESEND=api_key_resend
RESET_PASSWORD_SECRET=key_for_generate_token
```

To obtain the email key you must enter the [resend](https://resend.com) page

To launch the API you must start it
```bash
npm run start
```
## Routes
example localhost:3000/api/register

**/register**
```json
{
    "name": "Juan",
    "lastname": "Perez",
    "email": "your_email@gmail.com",
    "password": "1234567",
    "dateofbirth": "2002-09-30",
    "gender": "male",
    "role": "client"
}
```

**/login**
```json
{
    "email": "your_email@gmail.com",
    "password": "1234567",
    "tenantId": "657e180cae4e68e4d8eb1bc2"
}
```

**/forgotPassword**
```json
{
    "email": "your_email@gmail.com"
}
```

**/resetPassword**
```json
{
    "token": "token_generated",
    "newPassword": "123456789"
}
```

**/logout**
```json
{}
```

## License

[Jukumary]()