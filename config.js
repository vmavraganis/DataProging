

module.exports={
bandsurl:'"http://www.progarchives.com/bands-alpha.asp?letter="',
progarchivesBaseUrl:'http://www.progarchives.com',
util :'./utilities',
outputpath :"./bands/bands.json",
resultsdir:"./bands/",
bandparsingErrors :"./bands/failedParsings.json",
writeToFileModes : {
    write: 'write',
    append: 'append',
  },
errorFileName : 'failedParsings',
bandParsingSuccesFileName:"bands",
testurls : ['http://www.progarchives.com/bands-alpha.asp?letter=h',
        'http://www.progarchives.com/bands-alpha.asp?letter=b',
        'http://www.progarchives.com/bands-alpha.asp?letter=f'
    ]

}

module.exports.utilities=require('./utilities');