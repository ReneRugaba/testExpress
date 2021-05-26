require("babel-register");
const express=require("express");
const morgan = require("morgan");
const {success,error}= require("functionStatus")
const app= express()
const mysql=require("mysql")
const db=mysql.createConnection({
    host:"localhost",
    database:"nodejs",
    user:"root",
    password:""
})


// const members=[
//     {
//         id:1,
//         name:'Jean'
//     },
//     {
//         id:2,
//         name:'Julie'
//     },
//     {
//         id:3,
//         name:'François'
//     }
// ]
db.connect((err)=>{
    if (err) {
        console.log(err.message)
    }else{
        console.log("Connected!")

        app.use(morgan("dev"))
        let MembersRouter= express.Router()

        app.use(express.json()) 
        app.use(express.urlencoded({ extended: true }))

        MembersRouter.route("/")
            .get((req,res)=>{
                    if (req.query.max && req.query.max > 0) {
                       db.query("SELECT * FROM members",(err,results)=>{
                        let members=results
                           if (err || req.query.max > members.length) {
                               return res.status(500).json(error("Incorrect request!"))
                           }else{
                            res.send(members.slice(0,req.query.max))
                           }
                           
                           
                       })
                    }else{
                        db.query("SELECT * FROM members",(err,result)=>{
                            if (err) {
                                throw err
                            }else{
                                let members=result
                            if (members) {
                                res.status(200).json(members)
                            }
                            }
                            
                        })
                        
                    }
                })

            .post((req,res)=>{
                    if (req.body.name!="") {
                       
                       db.query("INSERT INTO members(name) values(?)",[req.body.name],(err,result)=>{
                        if (err) {
                            res.status(500).json(error("Incorrect request!"))
                        }else{
                            res.status(201).json(success(result))
                        }
                       })
                    }else{
                        res.status(401).json(error("body empty!"))
                    }
                })

        MembersRouter.route("/:id")
            .put((req,res)=>{
                    if (req.body.name!="" && req.params.id) {
                        db.query("UPDATE members SET name=? WHERE id=?",[req.body.name,req.params.id],(err,result)=>{

                            if (err) {
                                res.status(500).json(error("bad request!"))
                            }else{
                                res.status(201).json(success(result.message))
                            }
                        })
                    }else{
                        res.status(401).json(error("body vide!"))
                    }
                })
 
        app.use("/api/v1/members", MembersRouter)

        app.listen(8080,()=>{
            console.log("app started!")
        })
            }
})
