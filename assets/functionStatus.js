require("babel-register");

exports.success=(result)=>{
    return{
        status:"Success",
        result:result
    }
}

exports.error=(err)=>{
    return{
        status:"Error",
        error:err
    }
}

exports.isSucces=(result)=>result.name!=undefined?this.success(result):this.error("body empty!")

exports.isErr=(result)=>result instanceof Error? this.error("Internal error!"):this.success(result)

