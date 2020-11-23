1. Clone the repo
2. npm ci (to install node_modules without modifying package-lock.json)
3. npm run dev (to start server in development mode)
   npm start (to start server)
4. Server listening on localhost:3000/api/

___To enable text search on title and description___
1. open the mongo shell
2. Switch to the socialpilot_todo database <br>
use socialpilot_todo 
3. Create index on title and description fields <br>
db.tasks.createIndex( { title: "text", description: "text" } )

___To test the endpoints___
Open Postman (or equivalent REST Client) <br>
Import the file named "SocialPilot-Todo.postman_collection.json" available in the repo.

___REST Endpoints___
1. POST  - Create new  task <br>
localhost:3000/api/new
2. GET - Task list paginated <br>
localhost:3000/api/tasks/page/:pageNumber?sortBy=targetDate&sortDirection=desc
3. GET - Search tasks <br>
localhost:3000/api/search?term=abcd
4. PUT - Change status <br>
localhost:3000/api/change-status/:_id/:newStatus
5. PUT - Change task details <br>
localhost:3000/api/update/:_id
6. DELETE - Delete one or more tasks <br>
localhost:3000/api/task/multiple?id=5fbbedc7c278b4421694b986&id=5fbbeb2c9290433e06ed77e3
