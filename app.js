require("babel-register");
const express=require("express");
const morgan = require("morgan");
const functStatus= require("functionStatus")
const app= express()
const APP_ACCUEIL="/"
const APP_VERSION="/api/v1/members"

const members=[
    {
        id:1,
        name:'Jean'
    },
    {
        id:2,
        name:'Julie'
    },
    {
        id:3,
        name:'François'
    }
]
app.use(morgan("dev"))

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.get(APP_VERSION,(req,res)=>{
    
   if (req.query.max && req.query.max > 0) {
    res.send(members.slice(0,req.query.max))
   }else{
    res.send(members)
   }
})

app.post(APP_VERSION,(req,res)=>{
   if (req.body.name!="") {
       members.push({
           id:members.length+1,
           name:req.body.name
       })
    res.status(201).json(functStatus.success(members))
   }else{
    res.status(401).json(functStatus.error("body vide!"))
   }
})

app.listen(8080,()=>{
    console.log("app started!")
})