require("babel-register");
const express=require("express");
const morgan = require("morgan")("dev");
const {success,error,isErr}= require("./assets/functionStatus")
const app= express()
const config = require("./assets/config.json")
const mysql=require("promise-mysql");

mysql.createConnection(config.bdConnect)

.then(connect=>{
    const members=require("./assets/classes/Members-class")(connect,config)
    //indique connection bdd
    console.log("Connected!")

    //gère les logue requêtes
    app.use(morgan)
    let MembersRouter= express.Router()

    // app.use(express.json()) 
    app.use(express.urlencoded({ extended: true }))

    
    MembersRouter.route("/")
        //recupéré un membre ou tous les membres
        .get((req,res)=>{
                if (req.query.id && req.query.id > 0) {
                   members.getMemeberById(req.query.id)
                   .then(member=>member!=undefined?
                    res.status(config.status.ok).json(success(member))
                    : 
                    res.status(config.status.unKnow).json(error(config.error.unKwowMembers))
                    )
                   .catch(err=>res.status(config.status.internalError).json(error(err.message)))
                }else
                    members.getAllMembers()
                    .then(result=>res.status(config.status.ok).json(success(result)))
                    .catch(err=>res.status(config.status.internalError).json(error(err.message)))
            })
        //ajoute un membre
        .post(async(req,res)=>{
               let member= await members.postNewMember(req.body.name)
                    res.json(isErr(member))
            })

    MembersRouter.route("/:id")
    //modifie membre 
        .put((req,res)=>{
                if (req.body.name!="" && req.params.id) {
                    members.updateMemberById(req.params.id,req.body.name)
                    .then(result=>result ==1 ?
                        res.status(config.status.ok).json(success(config.success.updateSuccess))
                        :
                        res.status(config.status.internalError).json(error(config.error.noUpdate)) 
                    )
                }
                else res.status(config.status.internalError).json(error(config.error.BadRequest))
                
            })
    //supprime membre
        .delete((req,res)=>{
            if (req.params.id && req.params.id !=undefined) {
                members.deleteMember(req.params.id)
                .then(result=>result!=1?
                    res.status(config.status.internalError).json(error(config.error.BadRequest))
                    :
                    res.status(config.status.ok).json(success(config.success.deleteMember))
                    )
                .catch(err=>res.status(config.status.internalError).json(err))
            }
            else res.status(config.status.internalError).json(error(config.error.BadRequest))
            
        })
    app.use(config.rootApi+"/members", MembersRouter)
    app.listen(config.port,()=>console.log("app started!"))
}).catch(err=>console.log(err.message))


