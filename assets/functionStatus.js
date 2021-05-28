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