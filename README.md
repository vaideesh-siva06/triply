# Triply

Triply is a full-stack travel planning app that helps users organize trips with ease.

✈️ Create itineraries with destinations, dates, and activities

🤖 Get AI-powered travel suggestions (via Gemini API)

💾 Secure backend with database support for user accounts and itineraries

🖥️ Built with React (Vite) frontend + Express/Node.js backend 

## Setup:

### In client/triply folder:
      - npm install
      - npm i axios
      - create a .env file and use env.example in the client folder to set VITE_GEMINI_API_KEY=your_gemini_api_key

            - In order to get a Gemini api key, go to Google AI Studio -> Get API Key -> Create API Key + -> Copy that API Key and set it to VITE_GEMINI_API_KEY

      - To run client: npm run dev --> make sure it points to http://localhost:5173/

      * If any errors with server make sure to check lsof -i:5173 to see if there are two nodes running. If so, type in command kill -9 <PID> and restart server with npm run dev.

### In server folder:
      - npm install
      - npm i express cors dotenv bcrypt mysql2 jsonwebtoken cookie-parser
      - create a .env file and use env.example in the server folder to set:
              * (Check db.js and see the hardcoded values there, and set up a MySQL Workbench if you want to use the same values)
              PORT=5001
              DB_HOST=your-host-name
              DB_USER=your-db-user
              JWT_SECRET=your-local-jwt-secret (can keep as is)
              DB_NAME=your-db-name
              
      - To run server: npm run dev --> make sure it points to http://localhost:5001/

      * If any errors with server make sure to check lsof -i:5001 to see if there are two nodes running. If so, type in command kill -9 <PID> and restart server with npm run dev.

 * If any errors at all and are stuck on Loading... page, please make sure to run lsof -i:5001 and then kill -9 <PID of 5001> and if that doesn't work make sure to run lsof -i:5173 and then kill -9 <PID of 5173>. Then, re-run both the server and the client in their folders with npm run dev.
   
# MySQLWorkbench
      (SQL File Uploaded in GitHub, so use that file instead of setting it up from scratch. Just upload the file in SQL Workbench and connect it to project.)
      
    - Create a SQL Project with the host as localhost, user as root, and leave password empty
    - If you do use the 'sys' default given by SQL, you may leave the database parameter in mysql.createPool as is. If you do not use the same database, please change the name accordingly.

    - In the 'sys' database create two tables -> users and Itineraries
    - users:
          Columns:
                - id -> INT (PRIMARY) (NN) (AI)
                - username -> VARCHAR (100) (NN)
                - email -> VARCHAR (100) (NN) (UQ)
                - password -> VARCHAR (100) (NN)
    - itineraries (if it doesn't work try Itineraries and restart server):
          Columns:
                - id -> INT (PRIMARY) (NN) (AI)
                - title -> VARCHAR (100) (NN)
                - description -> TEXT default expression (NULL)
                - creator_id -> foreign_key to id in users table, INT NN
                - start_date -> DATE (NN)
                - end_date -> DATE (NN)
                - locations -> JSON (NN)
                - excursions -> JSON
                - budget -> VARCHAR (45)
                - numTravelers -> INT
                - aiPrompt -> TEXT
                - aiSuggestions -> LONGTEXT
                

