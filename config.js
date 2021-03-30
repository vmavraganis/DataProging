module.exports={
bandsurl:'http://www.progarchives.com/bands-alpha.asp?letter=',
artistsurl:"http://www.progarchives.com/artist.asp?id=",
progarchivesBaseUrl:'http://www.progarchives.com',
resultsdir:__dirname+"/providers/progarchives/data/",
bandparsingErrors :__dirname+"/providers/progarchives/data/failedParsings.json",
writeToFileModes : {
    write: 'write',
    append: 'append',
  },
errorFileName : 'failedParsings',
bandParsingSuccesFileName:"bands",
recordsParsingSuccesFileName:"records",


}
