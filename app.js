// flow

//  1.⁠ ⁠make hello world route
//  2.⁠ ⁠setup prisma, sync prisma with ⁠ npx prisma db push ⁠
//  3.⁠ ⁠make ⁠ user ⁠, ⁠ todo ⁠ schema, todo should have ⁠ userId ⁠ column also
//  4.⁠ ⁠make user register api /user/register
//  5.⁠ ⁠make user login api /user/login
//  6.⁠ ⁠add authentication - pipeline, middleware thing, jwt, 
//  7.⁠ ⁠add add todo api POST: /todo
//  8.⁠ ⁠add show todos of user api GET /todo
//  9.⁠ ⁠add mark todo
// 10.⁠ ⁠add todo delete api DELETE /todo/:todoId






const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
app.use(cors());

// all these going to middleware folder
// const prisma = require("./prisma/db")     //// get that from db.js file

// const crypto = require('crypto');
// const secret = "bigSecret"

// // now i need to crete token for  password 
// const jwt = require('jsonwebtoken');

const verifyUserToken = require("./middleware/verifyUserToken"); // import the middleware to verify user token


app.use(express.json());   // middleware to parse body 



//below is the pipeline for the routes
const authRouter=require("./controllers/auth");
app.use(authRouter);  // use auth router for user related routes

app.use(verifyUserToken); // use the middleware to verify user token for all routes after this line

const todoRouter=require("./controllers/todo");
app.use(todoRouter);  // use todo router for todo related routes





// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })



// app.get("/page",async (req,res)=>{
//   res.send("hello from page!")
// })



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
