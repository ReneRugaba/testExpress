require("babel-register");
const express=require("express");
const morgan = require("morgan");
const {success,error}= require("functionStatus")
const app= express()



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
let MembersRouter= express.Router()

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

MembersRouter.route("/")
    .get((req,res)=>{
            if (req.query.max && req.query.max > 0) {
                res.send(members.slice(0,req.query.max))
            }else{
                res.send(members)
            }
        })

    .post((req,res)=>{
            if (req.body.name!="") {
                members.push({
                    id:members.length+1,
                    name:req.body.name
                })
                res.status(201).json(success(members))
            }else{
                res.status(401).json(error("body vide!"))
            }
         })

MembersRouter.route("/:id")
    .put((req,res)=>{
            if (req.body.name!="" && req.params.id) {
                let indexMembers=""
                for (let index = 1; index < members.length; index++) {
                    if (req.params.id==members[index].id) {
                        indexMembers=index
                    }
                }
                members[indexMembers].name=req.body.name
                res.status(201).json(success(members[indexMembers]))
            }else{
                res.status(401).json(error("body vide!"))
            }
         })

app.use("/api/v1/members", MembersRouter)

app.listen(8080,()=>{
    console.log("app started!")
})