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

module.exports.executeQuerry= async (querry,client=postgressKnexClient)=>{
return new Promise(async (resolve,reject)=>{
    try{
        if(client == postgressKnexClient){
            const data = await knex.executeSQLQuery(querry)
            resolve (data)
        }
        else if (client == postgressSQLClient){
            console.log(querry,"in db.js line 50")
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
            console.log(querry)
        })
    }
    )
}


test = async () => {
   try{
//     //scrap artists from site
//     const artistsOnSite = await bands.getAllBandsTask();
    
//     //get artists from DB
//     const rows = await this.executequery(
//           "select  progarchivesid from bands  group by progarchivesid  order by progarchivesid desc")
//     const fetchedArtistsToDB = rows.rows.map((row) => row.progarchivesid.toString())
    
//     //get Scrapped Artists id
//     const artistsFromFile = await utilities.readFile(providersconfig.resultsdir + providersconfig.bandParsingSuccesFileName + ".json")
    
//     const res = artistsFromFile
//          .map((letter) => letter.map((artist) => { return artist.progArchivesID }))
//          .flat(Infinity)
//          .filter((id) => !!id)


// //compare scrapped artists with artists from db

//     //new artists
//      console.log(utilities.checkForMissingData(res, fetchedArtistsToDB))
//     //deleted from site 
//      console.log(utilities.checkForMissingData(fetchedArtistsToDB, res))
//      await records.getRecordsProcess(utilities.checkForMissingData(res, fetchedArtistsToDB))
     
     //scrap new artists records
     const recordstoQuerries = await this.JSONFileToQuerries(providersconfig.resultsdir + providersconfig.recordsParsingSuccesFileName+".json", queeries.populateRecordsQuerries)
     const bios =  await this.JSONFileToQuerries(providersconfig.resultsdir + providersconfig.recordsParsingSuccesFileName + ".json", queeries.fetchBiographies)


      //save them to db
      const save = this.saveToDB(recordstoQuerries.concat(bios))
   }
   catch(err){
       console.log(err)
   }



//      //records.getRecordsProcess(utilities.checkForMissingData(res, fetchedArtistsToDB))
//      chuncids = utilities.arrayToChunks(fetchedArtistsToDB, 100)
//      utilities.executeChunc(chuncids,records.getRecordsProcess)

}












// countries()
//test()
