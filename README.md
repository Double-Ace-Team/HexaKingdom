Preface: Multiplayer game for conquering hexagon fields. Created with architecture and design software patterns.

Application type: Web application

Front-end: React.js with Typescript, HTML and CSS.

Back-end: Express.js with Typescript 

Database: MongoDB with Mongoose as ORM(Object-Relational Mapper)

Communication: Socket.io

Project/Design patterns: Strategy

Software structure: Controllers and Services separated. 

Description:

Amateur web(local host) app for faculty project. Created with Javascript on both Front-end and back-end(.js frameworks).
Typescript is used to be able to create interfaces primarly.
We wanted to add Repository to software structure but due to short deadlines we delayed it's implementation. Repository would be where all calls(queries) to Database would be and it's result would be returned to services.
On Server side, Strategy design pattern is used to remove conditional logic (if-else branching) for makemove service in PlayerService.


To abe able to run application after cloning:
1. Open terminal(CMD/VS code terminal) in path where Client and Server folders are 
1. Separately open both and run in terminal command: 'npm i'
2. After downloaded modules create .env file in Server directory with following parameters(code):
  SERVER_PORT=5000
  CLIENT_URL=http://localhost:3000/
  MONGODB_URL=mongodb://127.0.0.1:27017/hexaKingdomDB
   (ports could be chosen arbitrary, if they are already taken just increment it by 1,2,etc.)
   (name for mongo Database also is up to you, make sure you have installed MongoDB and Node to run app)

To run app with multiple users in incognito tab log with new user.
Games has these hexagon fields: Castle, Mine, Army and plain fields.
Castle as player's fortress which if taken down automatically destroy every other player's hexagons and lose the game.
Mine as way to get more resources in game. They are taken by army instantly if assaulted.
Army can move and destroy enemy field or get destroyed in fighting. Have 2-3 moves per round.
Fighting logic ought in future to be implemented with probability(random) rate + number of size of it's figure.

