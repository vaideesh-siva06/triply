# Triply

Triply is a full-stack travel planning app that helps users organize trips with ease.

✈️ Create itineraries with destinations, dates, and activities

🤖 Get AI-powered travel suggestions (via Gemini API)

💾 Secure backend with database support for user accounts and itineraries

🖥️ Built with React (Vite) frontend + Express/Node.js backend 

## Setup:

### In client folder:
      - npm install
      - npm i axios
      - create a .env file and use env.example in the client folder to set VITE_GEMINI_API_KEY=your_gemini_api_key

### In server folder:
      - npm install
      - npm i express cors dotenv bcrypt mysql2 jsonwebtoken cookie-parser
      - create a .env file and use env.example in the server folder to set:
              PORT=5001
              DB_HOST=your-host-name
              DB_USER=your-db-user
              JWT_SECRET=your-local-jwt-secret (can keep as is)
              DB_NAME=your-db-name

# MySQLWorkbench
    - Create a SQL Project with the host as localhost, user as root, and leave password empty
    - If you do use the 'sys' default given by SQL, you may leave the database parameter in mysql.createPool as is. If you do not use teh same database, please change the name accordingly.
    

