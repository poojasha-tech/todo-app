const express = require("express");
const router = express.Router();
const prisma = require("../prisma/db");
const{ hashPassword, jwtToken } = require("../utilities/utilities");
const jwt = require("jsonwebtoken");




router.get("/helloworld",async (req,res)=>{
   res.send("hello from todo page!")
  //res.redirect("/page")
})

router.post("/signup", async (req, res) => {
  try {

    const userinfo = req.body;
    //console.log(userinfo)
    const infoInDb = await prisma.user.findFirst({ where: { username: userinfo.username } });
    if (infoInDb) {
      return res.status(409).send("username exists!")
    }

    else {
      const newUser = await prisma.user.create({
        data: {
          username: userinfo.username,
          password: hashPassword(userinfo.password)

        }
      })
      //return res.status(201).send("user created")
      // need to create token by removing password from the newuser info
      newUser.password = null;
      const token = jwtToken(newUser)
      console.log(token)
      return res.status(201).send({ token: token })
    }
  }

  catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

router.post("/signin",async (req,res) =>{
  const userinfo=req.body;
  const userInfoInDb=await prisma.user.findFirst({where:{username:userinfo.username}});
  if(userInfoInDb){
    if(userInfoInDb.password==hashPassword(userinfo.password)){
      delete userInfoInDb.password;
      const token=jwtToken(userInfoInDb)
      return res.send({token:token})
    }
    else{
      return res.status(401).json({message:"incorrect password!"})
    }
  }
  //return res.status(401).send("username not found!")
  return res.status(409).json({ message: "Username not found" })
})



module.exports = router;




