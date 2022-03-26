const Koa = require('koa');
const countriesRoutes = require('./routes/countries');
const artistsRoutes = require('./routes/bands');
const genresRoutes = require('./routes/genres');
const utils = require('../utilities')
const app = new Koa();
const PORT = process.env.PORT || 1337;
const HOST = "0.0.0.0" 

app.use(async (ctx, next) => {
  console.log(ctx)
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  utils.NodeWritetoFile('logs',ctx.request.ip,"append")
  await next();
});
app.use(countriesRoutes.routes());
app.use(artistsRoutes.routes());
app.use(genresRoutes.routes());




const server = app.listen(PORT,HOST,12,()=>{
  message= `Server listening on http://${HOST}:${PORT}`
  
  console.log(message)
 }
)
 
module.exports = server;