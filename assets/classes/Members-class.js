

module.exports=(_db,_config)=>{
    db = _db
    config = _config
    return Members
}

let Members=class{
    static getConfig(){
        return config
    }
}