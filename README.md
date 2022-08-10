# Generic Lambda
Implementation for a generic Lambda Functions with remote Api Rest Call.
## Requeriments

Generic-Lambda was built using:

| Platform   | Version  |
| ---------- | -------- |
| typescript | v4.4.3   |
| npm        |          |
| yarn       |          |

## Installation CLI

1. Clone the project using `git clone git@github.com:esdiegoortega/generic-lambda.git`
2. Enter to the folder: `cd generic-lambda`
3. git pull, git checkout develop, git branch 
4. Install the dependencies: `yarn install` o `npm install`


### Development mode

Dev compilation:
   Run server again with the new changes and compile the TS

     npx tsc --watch 

   Run the server again with the new changes, but first you have to compile the TS (npx tsc --watch)

     npx nodemon ./dist/index

### Compilation

Compile the TS and generate the ./dist/index.js:

   npx tsc 

   npx ./dist/index.js     

## How to deploy

### Lambda function deployment
1. Add an .env file with the AWS keys, you can take the .env_example as an example.
2. Run deploySH2 script for example, the script is in package.json: `npm run deploySH2`

## Contributors

- Diego Ortega - sistemas.diego.ortega@gmail.com