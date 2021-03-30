const axios = require("axios");
const { default: knex } = require("knex");
const countriesBasePath = 'https://restcountries.eu/rest/v2/alpha/'
const db = require('../db/knex/KNEXDB')

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  
};



const GetCountriesInfo =async(name)=>{

    return new Promise(async(resolve,reject)=>{

        let config = {
            headers: headers,
          }
    try{
          const res = await axios.get(
            countriesBasePath+name.toLowerCase(),
            config
         );
         resolve(res.data)  
        }
    
          
          catch (err){
              reject(null)
          }
    })


   
}


GetCountries = async()=>{
    try{
        const data =await(db.executeSQLQuery(db.CountriesQuery()))
        return data.filter((country)=>country.id!=63 && country.id!=97).map((country)=>country.iso3)
    }
    catch(err){
    }

}

const main = async()=>{
    countries = await GetCountries()



    // console.log(countries)

    countries.map((country)=>{
       test(country)
    })
    
}


test = async (country)=>{
    try{    const countryInfo = await GetCountriesInfo(country)
          if(countryInfo && countryInfo){
        console.log(`name:${countryInfo.name},code:${countryInfo.alpha3Code}`)
       updateCountriesDB(country,countryInfo.region)
    }
    else{
        console.log(country)
    }
    
    }
    catch(err){
        console.log(country)
    }

  
    
    
}

updateCountriesDB =async (filterkey,value)=>{
    console.log(`name:${filterkey}, code:${value}`)
    const query = db
    .knex('countries')
  .where('iso3', '=',filterkey)
  .update({
   region: value,
  })
  db.executeSQLQuery(query)


}


recordsUpdate =async (filterkey,value)=>{
    const query = db
    .knex('records')
  .where('artistid', '=',filterkey)
  .update({
   artistid: value,
  })
  console.log(query.toSQL().toNative())
  db.executeSQLQuery(query)


}









updateRecords =async()=>{
    const query = 
    db
    .knex("records")
    .distinct('artistid', 'bands.id')
    .innerJoin('bands', 'bands.progarchivesid', 'records.artistid')

    const data = await db.executeSQLQuery(query)
    data.map((set)=>recordsUpdate(set.artistid,set.id))
}

updateRecords()