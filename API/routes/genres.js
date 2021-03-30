const Router = require('koa-router');
const router = new Router();
const BASE_URL = `/api/v1/`;
const db = require('../../db/knex/KNEXDB')
router.get(BASE_URL +'genres', async (ctx,next) => {


    try {
      const genres = await GetGenres()       
        ctx.body = {
          status: 'success',
          count:genres.length,
          data: genres
          
        };
      } catch (err) {
        console.log(err)
      }
    }
    )
    GetGenres = async()=>{
      const data =await(db.executeSQLQuery(db.GenresQuery()))
      return data
  
  }


module.exports = router;