const Router = require('koa-router');
const db = require('../../db/knex/KNEXDB')
const validationSchema = require ('../Validations/artists')
const validations = require('../Validations/Validation_Methods')
const router = new Router();
const BASE_URL = `/api/v1/`;

router.get(BASE_URL +'bands', async (ctx,next) => {
    
        try {
          const isValid = await validations.isRequestValid(ctx.query,validationSchema.schema)
      if(!isValid.result ){
        ctx.body = {
            status: 'failure',
            data: (isValid.message)
          };    
          throw "invalid request"
      }

      const rawdata = await getArtistsQuery(ctx.request.query)
      let data  = addRecordsToArtistQuery(rawdata)
      .map(({artist,records})=>{
        return {
          name:artist.name,
          country:artist.country,
          id:artist.artistID,
          progarhives:{
            genre:artist.genre,
            id:artist.progarchivesid,
            url:"http://www.progarchives.com/artist.asp?id="+artist.progarchivesid,
            biography: (artist.progarchivesbiography)? artist.progarchivesbiography.replace(/(?:\r\n|\r|\n)/g, '<br>'):null
          },
          records
        }

      })

   

       
        ctx.body = {
        status: 'success',
        count:data.length,
         data: data
      };
    } catch (err) {
      console.log(err)
      // ctx.body = {
      //   status: 'failure',
      //    data: err
      // };
    }
  })



getArtistsQuery=async(query)=>{

  var dbQuery = db.BandsQuery(query)
  var rows = await db.executeSQLQuery(dbQuery);
  return rows
}

var addRecordsToArtistQuery= (data)=>{
  var res = data.map(({name,genre,country,artistID,progarchivesbiography,progarchivesid,...rest})=>{
    records=[]
    records.push(rest)
    return {
    artist:{name,genre,country,artistID,progarchivesid,progarchivesbiography},
    records
    }
    })


    res= res.map((a,index)=>{
        var pointer = index
		if(pointer>=1 && res[pointer-1].artist.artistID == a.artist.artistID) return null
        while(res[pointer+1] && res[pointer+1].records && res[pointer+1].artist.artistID == a.artist.artistID ){
            a.records.push(res[pointer+1].records[0])
            pointer++
        }
        return a
        })
        res = res.filter( (a)=>a != null )

        return res

}

module.exports = router;