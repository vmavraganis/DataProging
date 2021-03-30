const createbandstablequerry = `CREATE TABLE IF NOT EXISTS bands (
    id  serial ,
    genre varchar(200),
    country varchar(200),
    name varchar(400),
    progarchivesid int not null unique
 );`


 const createrecordstablequerry = `CREATE TABLE IF NOT EXISTS records (
    id  serial ,
    category varchar(60),
    progArchivesAlbumId int not null unique,
    progArchivesRating double precision,
    title text
    year int,
    progarchivesartist int not null unique
 );`

 const artisToQuery = (artist)=>{

    const query =   `INSERT INTO bands (country,genre,name,progarchivesid) VALUES ('${artist.country}' ,'${artist.genre}','${artist.name.replace(/'/g,"''")}','${artist.progArchivesID}') 
    ON CONFLICT (progarchivesid)  DO UPDATE SET 
    country = '${artist.country}', 
    genre = '${artist.genre}',
   name = '${artist.name.replace(/'/g,"''")}',
   progarchivesid = '${artist.progArchivesID}';
    `
    return query
}

const updateArtistBio = (artist)=>{
const query = `
update bands 
set progarchivesbiography = '${artist.biography.replace(/'/g,"''")}'
where progarchivesid = ${artist.progArchivesID }
`
return query
}

const recordToQuery = (record)=>{
    year = (record.year)?record.year:1900
    record.progArchivesRating =(record.progArchivesRating)?record.progArchivesRating:0

    const query =   `
    INSERT INTO records (category,progArchivesAlbumId,progArchivesRating,title,year,progarchivesartist) 
    VALUES 
    ('${record.category}' ,
    '${record.progArchivesAlbumlink}',
    '${record.progArchivesRating}',
    '${record.title.replace(/'/g,"''")}',
    '${year}',
    '${record.progarchivesartist}'
    ) 
    ON CONFLICT (progArchivesAlbumId)  DO UPDATE SET 
    category = '${record.category}', 
    progArchivesAlbumId = '${record.progArchivesAlbumlink}',
    title = '${record.title.replace(/'/g,"''")}',
    progArchivesRating = '${record.progArchivesRating}',
    year = '${year}',
    progarchivesartist = '${record.progarchivesartist}'
    ;
    `
    return query
}

fetchBiographies = (data)=>{
    const querries = []
    data.map((artist)=>{
    querries.push(updateArtistBio({biography:artist.biography,progArchivesID:artist.artist}).trim().replace(`\n`,"") )
}
    )
    
   return querries
}

populateArtistsQuerries = (data)=>{

    const querries = []
     data.forEach( letter => {
        letter.filter((artist)=>artist.country).forEach( artist => {
           querries.push(artisToQuery(artist))
        }
        );   
    });
    return querries
}

populateRecordsQuerries = (data)=>{

    const querries = []
    getRecordsForQuerries(data).forEach( record => {
        querries.push(recordToQuery(record))
         
    });
    return querries
}

getRecordsForQuerries=(data)=>{
    const albums = []
    data.forEach((artist)=>albums.push(artist.albums.map((album)=>{
        return{...album,progarchivesartist:artist.artist}
    })))
    return [].concat.apply([], albums);
  }




module.exports.populateRecordsQuerries = populateRecordsQuerries
module.exports.fetchBiographies = fetchBiographies
module.exports.populateArtistsQuerries = populateArtistsQuerries
