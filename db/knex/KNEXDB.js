const { Query } = require('pg');
const config = require('../config')

const knex = require('knex')({
    client: 'pg',
    connection: config.client,
    pool:config.knexpool
  });


const query2 =
knex
.select('bands.name as band')
.select('countries.name as coyntry')
.from('bands')
.innerJoin('countries', 'countries.id', 'bands.country')
.orderBy('countries.name')




const FilterBandsQuery=(querry)=>
{
  try{
  const result = knex.from("bands")
  .select('bands.name','genre','country','progarchivesid','bands.id as artistID')
  .orderBy('bands.name')
    if(querry.id){
      result
     .select('*')   
     .where('id',querry.id)
   }
  if(querry.genre){
     result
    .where('genre',querry.genre)
  }
  if(querry.country){
    result
   .where('country',querry.country)
 }
 if(querry.progarchivesid){
  result
  .clear('where')
 .where('progarchivesid',querry.progarchivesid)
}
 if(querry.name){
   const name = "%"+querry.name.toUpperCase().trim()+"%"
  result
 .where('bands.name', 'like', name)
}
if(querry.orderBy){
  
 result
 .clear('order')
.orderBy(querry.orderBy)
}


if(querry.includeBio && querry.includeBio.toString().toLowerCase()=='true'){
  result
  .select('progarchivesbiography')
}

if(querry.includeRecords && querry.includeRecords.toString().toLowerCase()=='true'){
  result
  .select("records.*")
  .innerJoin('records', 'bands.id', 'records.artistid')
  .orderBy("records.year")
}

if(querry.region){
  result
  .where('region','=',querry.region)
  .innerJoin('countries', 'bands.country', 'countries.id')
}

  return result
}
catch(err){
  console.log(err)
}
}


const getGenresQuery=()=>{
  try{
  const result = knex.from("genres")
  .select('*')
  return result
  }
  catch(err){
    console.log(err)
  }
}

const getCountriesQuery=()=>{
  try{
  const result = knex.from("countries")
  .select('*')
  

  
  return result
  }
  catch(err){
    console.log(err)
  }
}



  const  executeSQLQuery = async(query)=>{
const DBExecutePromise =  new Promise(async(resolve,reject)=>{
  try{
    console.log(query.toSQL().toNative())
      const data = await query
    resolve(data)
  }
  catch(err){
  console.log(`query:${query.toSQL().toNative()} error:${err}`)
  reject(err)
  }
    
})
return DBExecutePromise


  }

module.exports.executeSQLQuery = executeSQLQuery
module.exports.BandsQuery = FilterBandsQuery
module.exports.GenresQuery = getGenresQuery
module.exports.CountriesQuery = getCountriesQuery
module.exports.knex = knex