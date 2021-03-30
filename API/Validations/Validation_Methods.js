isRequestValid=async(querry,schema)=>{
    try{
      const isValid = await schema.validate(querry,{abortEarly: false})

      return {
        result:!isValid.error,
        message:isValid.error
      }
    }
    catch(err){
      console.log(err)
    }
}


module.exports.isRequestValid = isRequestValid


