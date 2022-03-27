const Nightmare = require('nightmare');
const utilities = require('../../utilities')
const config = require('../../config');

const cheerio = require("cheerio");
const axios = require("axios").default;

const fetchHtml = async url => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch {
    console.error(`ERROR: An error occurred while trying to fetch the URL: ${url}`);
  }
};


  const extractCategoryRecords = (category,idx,domSelector) => {
    const categoryRecords = domSelector(category.find("td"))
   
     return categoryRecords.get().map((record)=>{
       const album = domSelector(record)
       const users=album.find("span:nth-of-type(2)").text()
       const rating = album.find("span:nth-of-type(1)").text()
         return{
       year:album.find("span:nth-child(10)").text(),
       title:album.find("strong").text(),
       progArchivesAlbumlink:album.find("a").attr("href").split("=").pop(),
       progArchivesRating:Math.log(users) * rating,
       category:idx
     }
   
    })
   }
   
    
   const getCategories= (header)=> {
     categories = [
     header.indexOf("top albums"),
     header.indexOf("Live Albums"),
     header.indexOf("Videos (DVD, Blu-ray, VHS etc)"),
     header.indexOf("Boxset & Compilations"),
     header.indexOf("Official Singles, EPs, Fan Club & Promo")
   ]
   
   return  categories.indexOf(categories.find((x)=>x>0))
   }
    
   
   const scrapRecordsByID = async (id) => {

    return new Promise(async(resolve,reject)=>{
      try{

        const url = config.artistsurl+id   
   
        
        const html = await fetchHtml(url);
      
        const selector = cheerio.load(html);
        console.log("checking band on url "+url+" : "+selector("#main > div > h1").text())
   
      
        const categoriesTables = selector("body").find(
          "h3+table"
        );
      
        const longbiography = selector("body").find("#moreBio").text()
        const sortbiography = selector("body").find("#main > div > div:nth-child(6) > div:nth-child(3)").text()
      
        const biography= (longbiography.length)?longbiography:sortbiography
        
      
        const albums = categoriesTables
          .map((idx, el) => {
            const category = selector(el);
            categoryCode = getCategories(category.prev().text())
            return extractCategoryRecords(category,categoryCode,selector);
          })
      
          resolve({
            artist:url.substring(url.indexOf("=") + 1, url.length),
            albums:albums.get(),
            biography:biography
        });
       }catch(err){
          console.log(err)
          reject(err)
      }
    })


   };


  const getRecords = async (ids = [], displayBrowser = false) => {
    
    const series = ids.map((id)=>(scrapRecordsByID(id)))
    let series2 = await Promise.all(series)
    return series2
}


const getRecordsProcess = async(ids,filetowriteData=config.recordsParsingSuccesFileName)=>{
  
  const getAllRecordData = new Promise(async(resolve,reject)=>{
        
    try{
      records = await getRecords(ids)
        resolve(records.filter((rec)=>rec))
    }
    catch(err){
        console.log(err)
        reject(err)
    }
    })

    return new Promise(async(resolve,reject)=>{
        try{
            const resolvedData = await getAllRecordData

    
        resolve (utilities.NodeWritetoFile(filetowriteData,resolvedData,config.writeToFileModes.append))
        }
        catch(err){
            console.log(err)
            reject(err)
        }

    })

}

module.exports.getRecordsProcess = getRecordsProcess
module.exports.scrapRecordsByID = scrapRecordsByID
module.exports.getRecords = getRecords
