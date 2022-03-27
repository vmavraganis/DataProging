const { Client, Pool } = require('pg');
const config = require('./config');
const utilities = require('../utilities')
const queeries = require('./querries')
const providersconfig = require("../config")
client = new Client(config.client);
const pool = new Pool(config.pool);
const postgressSQLClient = "postgress"
const postgressKnexClient = "knex"
const knex = require('./knex/KNEXDB')


const records = require("../providers/progarchives/Records")
const bands = require("../providers/progarchives/Bands")

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

module.exports.JSONFileToQuerries = (path, populateQueeriesfn) => {
    return new Promise((resolve, reject) => {
        if (!utilities.fileExists(path)) return null
        utilities.readFile(path)
            .then((data) => {
                resolve(populateQueeriesfn(data))
            }
            )
            .catch((err) => reject(err))
    })
}

const executeQuerry= async (querry,client=postgressKnexClient)=>{
return new Promise(async (resolve,reject)=>{
    try{
        if(client == postgressKnexClient){
            const data = await knex.executeSQLQuery(querry)
            resolve (data)
        }
        else if (client == postgressSQLClient){
        const client = await pool.connect()
        const res = await client.query(querry)
        await client.release()
        resolve(res.rows)
        }



        

    }
    catch(err){reject(err)}

})
}

module.exports.saveToDB = async (querries) => {
    querries.forEach((querry) => {
        (async () => {
            const client = await pool.connect()
            try {
                const res = await client.query(querry)
            } finally {
                client.release()
            }
        })().catch(err => {
            console.log(err)
            console.log(querry)
        })
    }
    )
}

const getAllIds = async()=>{
    const bandsandids= await knex.getbandsnamesids();
    return bandsandids.map((band)=>band.progarchivesid);
}


test= async () => {
   try{
//     //scrap artists from site
    const artistsOnSite = await bands.getAllBandsTask();
    
    //get artists from DB
    
    const countries = await(knex.executeSQLQuery(knex.CountriesQuery()))
    const genres = await(knex.executeSQLQuery(knex.GenresQuery()))
    let bandsandids= await knex.getbandsnamesids();
    const fetchedArtistsFromDB = bandsandids.map((row) => row.progarchivesid.toString())

    
    //get Scrapped Artists id
    const artistsFromFile = await utilities.readFile(providersconfig.resultsdir + providersconfig.bandParsingSuccesFileName + ".json")

    const resids = artistsFromFile
         .map((letter) => letter.map((artist) => { return artist.progArchivesID }))
         .flat(Infinity)
         .filter((id) => !!id)

         const newids =  utilities.checkForMissingData(resids, fetchedArtistsFromDB)
         if(!newids.length){
             console.log("no new entries")
             return;
         }

         const newartists = artistsFromFile
         .map((letter) => letter.filter((artist) => { return artist.progArchivesID }))
         .flat(Infinity)
         .filter((id) => !!id)
         .filter((artist)=>newids.indexOf(artist.progArchivesID)>=0)
         .map((artist) => {
            const obj = Object.assign({}, artist);
            obj.country =  countries.find((country)=>country.name == artist.country).id
            obj.genre = genres.find((genre)=>genre.genre_name == artist.genre).id
            return obj
        } )
         

         const newartistsqueeries =populateArtistsQuerries(newartists)
         let saveewartists = await this.saveToDB(newartistsqueeries)
          bandsandids= await knex.getbandsnamesids();





//     //deleted from site 
      console.log(utilities.checkForMissingData(fetchedArtistsFromDB, resids))

        // get all records
        //const ids = await getAllIds(); 
        //records.getRecordsProcess(ids)

          //  //scrap new artists records
      await records.getRecordsProcess(newids)
     
      const newRecords =  await utilities.readFile(providersconfig.resultsdir + providersconfig.recordsParsingSuccesFileName + ".json")
      const recordstoQuerries  = queeries.populateRecordsQuerries( 
        newRecords.map((record)=>{
        const obj = Object.assign({}, record);
        obj.artist  =  bandsandids.find((band)=>band.progarchivesid == record.artist).id
        return obj
      }))
      //await this.JSONFileToQuerries(providersconfig.resultsdir + providersconfig.recordsParsingSuccesFileName+".json", queeries.populateRecordsQuerries)
      const bios =  await this.JSONFileToQuerries(providersconfig.resultsdir + providersconfig.recordsParsingSuccesFileName + ".json", queeries.fetchBiographies)
      console.log(recordstoQuerries)
    //   //save them to db
     const savebios = await this.saveToDB(bios)
     const saverecords = await this.saveToDB(recordstoQuerries)
   }
   catch(err){
       console.log(err)
   }



//      //records.getRecordsProcess(utilities.checkForMissingData(res, fetchedArtistsFromDB))
//      chuncids = utilities.arrayToChunks(fetchedArtistsFromDB, 100)
//      utilities.executeChunc(chuncids,records.getRecordsProcess)

}












// countries()
test()
