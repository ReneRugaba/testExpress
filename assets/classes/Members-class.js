

module.exports=(_db,_config)=>{
    db = _db
    config = _config
    return Members
}

let Members=class{

    /**
     * @param {*} id 
     * @returns 1 members
     */
    static getMemeberById(id){
        return new Promise((resolve,reject)=>{
            db.query("SELECT * FROM members WHERE id=?",[id])
            .then(res=>res[0]!=undefined?
                resolve(res[0])
                :
                resolve(undefined)
                )
            .catch(err=>reject(err))
        })
    }

    /**
     * @returns array Members
     */
    static getAllMembers(){
        return new Promise((resolve,reject)=>{
            db.query("SELECT * FROM members")
            .then(res=>{
                if (res && res.length>0) {
                    resolve(res)
                }
            })
            .catch(err=>{
                reject(err)
            })
        })
    }

    /**
     * @param {*} id 
     * @param {*} reqBody 
     * @returns res.affectedrows if success
     */
    static updateMemberById(id,reqBody){
        return new Promise((resolve,reject)=>{
            db.query("UPDATE members SET name=? WHERE id=?",[reqBody,id])
            .then(res=>{
                if (res.affectedRows==1) {
                   
                    resolve(res.affectedRows)
                }else{
                    
                    resolve(0)
                }
            })
            .catch(err=>{
                reject(err)
            })
        })
    }


    /**
     * @param {*} reqBody 
     * @returns post new Member
     */
    static postNewMember(reqBody){
        if (reqBody!=undefined) {
            return new Promise((resolve,reject)=>{
                    db.query("INSERT INTO members(name) values(?)",[reqBody])
                .then(res=>{
                    resolve(res.affectedRows)
                })
                .catch(err=>{
                    reject(err)
                })
            })
        }else{
            return new Error()
        }
    }

    static deleteMember(id){
        return new Promise((resolve,reject)=>{
            if (id && id!=undefined) {
                db.query("DELETE FROM members WHERE id=?",[id])
                .then(res=>{
                    if (res.affectedRows==1) {
                        resolve(res.affectedRows)
                    }else{
                        resolve(res.affectedRows)
                    }
                })
                .catch(err=>{
                    reject(err)
                })
            }
        })
    }
}