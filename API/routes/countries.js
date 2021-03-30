const Router = require('koa-router');
const router = new Router();
const BASE_URL = `/api/v1/`;
const db = require('../../db/knex/KNEXDB')
router.get(BASE_URL +'countries', async (ctx,next) => {


    try {
      const countries = await GetCountries()       
        ctx.body = {
          status: 'success',
          count:countries.length,
          data: countries
          
        };
      } catch (err) {
        console.log(err)
      }
    }
    )
    GetCountries = async()=>{
      const data =await(db.executeSQLQuery(db.CountriesQuery()))
      return data
  
  }
  module.exports =router