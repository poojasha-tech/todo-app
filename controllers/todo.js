const express = require("express");
const router = express.Router();
const prisma = require("../prisma/db");
const { hashPassword, jwtToken } = require("../utilities/utilities");
const jwt = require("jsonwebtoken");
const secret="bigsecret"; // Define your secret key for JWT signing




router.get("/helloworld",async (req,res)=>{
   res.send("hello from todo page!")
  //res.redirect("/page")

  const token=req.headers.authorization?.replace("Bearer ","");
  const tokenToObject=jwt.verify(token,secret);

  const user=tokenToObject.data;


  if(!user){
    return res.status(401).send("unauthorized user!");
  }

  console.log(user);

  //static data 

  /*var data=[
        {title:'bring Milk',marked:true},
        {title:'Homework finished',marked:false}
    ]
    res.send(data)*/

    const todos=await prisma.todo.findMany({where:{username:user.username}})
    console.log(todos)
    res.send(todos)


})



//post todo
router.post('/to-do',async(req,res)=>{
  try {
    const token=req.headers.authorization.replace("Bearer ","");;
    const tokenToObject=jwt.verify(token,secret);

    const user=tokenToObject.data;

    if(!user){
      return res.status(401).send("unauthorized user!");
    }

    const todofromFrontend=req.body;
    if(!todofromFrontend.title){
      return res.status(400).send("title is required!");
    }

    await prisma.todo.create({
      data:{
        username:user.username,
        title:todofromFrontend.title,
        marked:false
      }
    })

    return res.status(201).send("todo created successfully!");



    
  } catch (error) {

    console.error("Error creating todo:", error);
    return res.status(500).send("Internal server error");
    
  }
})




router.delete("/to-do/:id",async (req,res)=>{
  try {

    const token =req.headers.authorization?.replace("Bearer ", "");
    const tokenToObject = jwt.verify(token, secret);
    const user = tokenToObject.data;
    if (!user) {
      return res.status(401).send("unauthorized user!");
    }
    const id = req.params.id;
    const deletedItem=await prisma.todo.delete({
      where:{
        id:Number(id),
        username:user.username

      }
    });

    return res.status(204).send("item deleted successfully!");
    alert("item deleted successfully!");
    
  } catch (error) {

    console.log("Error deleting todo:", error);
    return res.status(500).send("Internal server error");
    
  }
})




// mark todo
router.put('/to-do/mark/:id', async(req,res)=>{
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const tokenToObject=jwt.verify(token,secret);
    const user = tokenToObject.data;
    if(!user){
      return res.status(401).send("unauthorized user!");
    }
    const id = req.params.id;
    const markTodo=await prisma.todo.findUnique({
      where: {
        id: Number(id),
        username: user.username
      }
    });

    const updatedItem=await prisma.todo.update({
      where:{
        id: Number(id),
        username: user.username
      },

      data:{
        marked:markTodo.marked ? false : true
      }
    });

    return res.status(201).send("todo is"+ updatedItem.marked);
    
  } catch (error) {
    console.error("Error marking todo:", error);
    return res.status(500).send("Internal server error");
    
  }
})


module.exports = router;