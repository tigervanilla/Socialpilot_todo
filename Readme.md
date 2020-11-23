1. Clone the repo
2. npm ci (to install node_modules without modifying package-lock.json)
3. npm run dev (to start server in development mode)
   npm start (to start server)

___To enable text search on title and description____
1. open the mongo shell
2. Switch to the socialpilot_todo database
use socialpilot_todo 
3. Create index on title and description fields
db.tasks.createIndex( { title: "text", description: "text" } )