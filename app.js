require("babel-register");
const express=require("express");
const morgan = require("morgan")("dev");
const {success,error}= require("./assets/functionStatus")
const app= express()
const config = require("./assets/config.json")
const mysql=require("promise-mysql");

const db=mysql.createConnection(config.bdConnect)

.then(connect=>{
    const members=require("./assets/classes/Members-class")(connect,config)
    console.log("Connected!")

    app.use(morgan)
    let MembersRouter= express.Router()

    app.use(express.json()) 
    app.use(express.urlencoded({ extended: true }))

    MembersRouter.route("/")
        .get((req,res)=>{
                if (req.query.max && req.query.max > 0) {
                   members.getMemeberById(req.query.max)
                   .then(member=>{
                       if (member!=undefined) {
                        res.status(200).json(success(member))
                       }else{
                           res.status(404).json(error("Aucun membre ne correspond à la recherche!"))
                       }
                   })
                   .catch(err=>{
                       res.status(500).json(error(err.message))
                   })
                }else{
                    members.getAllMembers()
                    .then(result=>{
                        res.status(200).json(success(result))
                    })
                    .catch(err=>{
                        res.status(500).json(error(err.message))
                    })
                }
            })

        .post((req,res)=>{
                if (req.body.name!="") {
                   members.postNewMember(req.body.name)
                   .then(result=>{
                       if (result==1) {
                           res.status(201).json(success(result))
                       }else{
                           res.status(500).json(error("Internal error!"))
                       }
                   })
                   .catch()
                }else{
                    connect.status(401).json(error("body empty!"))
                }
            })

    MembersRouter.route("/:id")
        .put((req,res)=>{
                if (req.body.name!="" && req.params.id) {
                    members.updateMemberById(req.params.id,req.body.name)
                    .then(result=>{
                      if (result ==1 ) {
                        res.status(200).json(success("Modification effectué!"))
                      }else{
                          res.status(500).json(error("Aucune modification n'a put être faite!"))
                      }
                    })
                }else{
                    res.status(401).json(error("body vide!"))
                }
            })
        .delete((req,res)=>{
            if (req.params.id && req.params.id !=undefined) {
                members.deleteMember(req.params.id)
                .then(result=>{
                    if (result!=1) {
                        res.status(500).json(error("Unknow members!"))
                    }else{
                        res.status(200).json(success("Success!"))
                    }
                })
                .catch(err=>res.status(500).json(err))
            }else{
                res.status(500).json(error("Bad request!"))
            }
        })
    app.use(config.rootApi+"/members", MembersRouter)

    app.listen(config.port,()=>{
        console.log("app started!")
    })
}).catch(err=>{
    console.log(err.message)
})


