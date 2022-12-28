# DoubleDucker URL Shortener API
## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
## Introduction
This is a simple URL shortener API that I made for my own personal growth. It is not meant to be used in production, but feel free to use it if you want to. It is written in TypeScript and uses Express.js for the server and Prisma with MySQL for the database. I am happy to accept any criticism or suggestions for improvement.
## Installation
1. Clone the repository 
```bash	
git clone https://github.com/BertoldVinczeIMC/DoubleDucker-API.git
```
2. Install dependencies
```bash
npm install
```
3. Create a .env file in the root directory and add the following variables:
```bash
PORT= #Port for the server to run on
DATABASE_URL= #DB URL for Prisma (see Prisma docs for more info)
```
4. Use Prisma to upload the schema to the database
```bash
npx prisma migrate dev --name init
```
5. Run the server
```bash
npm run dev
```
## Usage
### Endpoints
#### POST /api/url
Creates a new short URL
##### Request Body
```json
{
    "url": "https://www.google.com"
}
```
##### Response
```json
{
    "status": 200,
    "message": "Cannot create short url, this url already exists",
    "data": {
        "decoded": "https://www.google.com",
        "encoded": "32f730e1"
    }
}
```
#### GET /api/url/:id
Gets the original URL from the short URL
##### Response
```json
{
    "status": 200,
    "message": "OK",
    "data": {
        "decoded": "https://www.google.com",
        "encoded": "32f730e1"
    }
}
```
## Contributing
If you found a bug or have a suggestion for improvement, feel free to open an issue or a pull request.
## License
[MIT](https://choosealicense.com/licenses/mit/)