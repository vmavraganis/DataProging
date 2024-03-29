const Nightmare = require('nightmare');
const utilities = require('../../utilities')
const config = require('../../config');



const getURLS = async () => {
    const nightmare = new Nightmare({ show: false });
    try {
        const result = await nightmare
            .goto(config.progarchivesBaseUrl)
            .on('console', (log, msg) => {
                console.log(msg)
            })
            .wait('#navAlphaBands ul li')
            .evaluate(() => {
                links = []
                var list = [...document.querySelectorAll("#navAlphaBands ul li")]
                links = list.map((el) => { return el.firstChild.href })
                return links.filter((url) => (url && !(url.includes("*") || url.includes("id"))))

            }

            ).end()
        return result
    } catch (e) {
        console.error(e);
        return undefined
    }
}
const GetUrlPromise = (urls)=>{
    return new Promise(async (resolve, reject) => {
        if (urls.length) {
            resolve(urls)
            return
        }
        console.log("getting urls")
        try{const data = await  getURLS()
        resolve (data)}
        catch(err){
            reject(err)
        }
       
    })
    }


const getBand = async (url) => {
    const nightmare = new Nightmare({ show: false });
    // Go to initial start page, navigate to Detail search
    try {
        const result = await nightmare
            .goto(url)
            .on('console', (log, msg) => {
                console.log(msg)
            })
            .wait('table')
            .wait("tbody tr")
            .wait('td')
            .wait(1800)
            .evaluate((url) => {
                artists = []
                links = []
                const table_rows = Array.from(document.querySelectorAll("tbody tr"));

                index = url.indexOf("=")
                letter = url.substring(index + 1, url.length);
                console.log("checking bands starting with letter " + letter)
                artists.push({
                    'letter': letter
                })
                table_rows.forEach((row) => {
                    const columns = [...row.querySelectorAll('td')];
                    if (columns[0] && columns[0].childElements()) {
                        link = columns[0].childElements(0).map((el) => {
                            return el.href
                        })
                    }



                    const col = columns.map((el) => el.innerText)
                    const artist = {
                        'name': col[0],
                        'genre': col[1],
                        'country': col[2],
                        'progArchivesID': link[0]
                    }

                    if (link[0]) artists.push(artist);
                })

                return artists
            }

                , url).end()
        return result
    } catch (e) {
        console.error(e);
        return e.url
    }
}




const getBands = async (urls = []) => {


    const series = urls.reduce(async (queue, number) => {
        const dataArray = await queue;
        dataArray.push(await getBand(number));
        return dataArray;
    }, Promise.resolve([]));

    return series
}




const getAllBandsTask = async (urls = [], fileWritimgmode = config.writeToFileModes.write, displayBrowser = false) => {
    
    return new Promise(async(resolve, reject) => {


    try {
        urls = await GetUrlPromise(urls)
    }
    catch (err) {
        console.log(err)
        reject(err)
    }

    try{
    const bands = await getBands(urls) 
    await dataTofile(bands, config.bandParsingSuccesFileName, config.errorFileName, fileWritimgmode)
    const path = config.bandparsingErrors
    if (!utilities.fileExists(path)) {
    console.log("finished with no errors")
    resolve([])    
    return;
}
}
catch(err){
    console.log(err)
    reject(err)

}
    const path = config.bandparsingErrors
    const failures = await utilities.readFile(path)
    if(failures.length){
            try{
                const failedbands = await getBands(failures.map((datum) => { return datum.url }))
                await dataTofile(failedbands, config.bandParsingSuccesFileName, config.errorFileName, config.writeToFileModes.append)
                console.log("added errors")
                
            }
            catch(err){
           console.log(err)
           reject(err)
            }
    }
    const finalpath = config.resultsdir + config.bandParsingSuccesFileName + ".json"
    if (!utilities.fileExists(finalpath)) {
        console.log(null)
    }
    const finalbands = await  utilities.readFile(finalpath)
    dataFromFile = finalbands.map((letter) => { return letter[0].letter })
                        intialData = urls.map((url) => { return url.substring(url.indexOf("=") + 1, url.length) })
                        const differences = utilities.checkForMissingData(intialData, dataFromFile)
                        if (differences.length) {
                            resolve(await getAllBandsTask(differences.map((diff) => { return config.bandsurl + diff }), config.writeToFileModes.append
                            ))
                        }
                        else {
                            resolve(finalbands)
                        }
                    }
)
}

dataTofile = (data, successfile, errorlogfiles, mode) => {
    return new Promise(async (resolve, reject) => {
        try {
            await logData(data, mode, successfile)
            await logErrors(data, errorlogfiles)
            resolve([])
        }
        catch (err) {
            reject(err)
        }
    })


}

logData = async (data, mode, successfile) => {
    return new Promise(async (resolve, reject) => {
        try {
            const file = config.resultsdir + "" + "" + successfile + "" + ".json";
            var finalData = data.filter(i => i && i[0] && i[0].letter);
            if (finalData.length) {

                finalData = finalData.map((letter) => {
                    return letter ? letter.map((artist) => {
                        return (artist.progArchivesID) ? {
                            ...artist,
                            progArchivesID: artist.progArchivesID.substring((artist.progArchivesID.indexOf("=")) + 1, artist.progArchivesID.length)
                        } : artist
                    }) : letter
                })

                if (mode == "append" && utilities.fileExists(file)) {
                    utilities.readFile(file)
                        .then(async (dataFromFile) => {
                            dataFromFile = dataFromFile ? dataFromFile : []
                            finalData = dataFromFile.concat(finalData)
                            resolve(await utilities.NodeWritetoFile(successfile, finalData))

                        })
                }
                else {
                    resolve(await utilities.NodeWritetoFile(successfile, finalData, mode))
                }

            }
        }
        catch (err) {
            reject(err)
        }
    })
}


logErrors = (data, errorlogfiles) => {
    return new Promise(async (resolve, reject) => {
        try {

            const failedData = data.filter((i) => (i && i[0] && !i[0].letter))
            if (!failedData.length) resolve([])
            if (failedData.length) {
                const failures = [].concat(failedData.map((url) => {
                    return {
                        "url": url
                    }
                }))
                resolve(await utilities.NodeWritetoFile(errorlogfiles, failures, config.writeToFileModes.write))
            }

        }
        catch (err) {
            reject(err)
        }
    })
}





module.exports.urls = getURLS
module.exports.getAllBandsTask = getAllBandsTask
module.exports.getBand = getBand
module.exports.getBands = getBands




    