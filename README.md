# UCN-project-spring-2017
This is a project made on PBA Web Development at UCN. The Application use TypeScript, ExpressJS (with PassportJS), Angular4.


## Instructions
1. First run install npm packages

    `npm install`
2. Install @angular/cli global
    
    `npm install -g @angular/cli`
2. Create a new file named `.startupWithSecrets.ts` in the project root folder

    Content have to be like this (remember to replace the mongo URL):
    
    ```javascript
    process.env.MONGO_URL = "mongodb://localhost/typescript-db";
    
    require("./src/server/startup");
    ```
3. Now just run the nodemon script with start command
    
    `npm start`
