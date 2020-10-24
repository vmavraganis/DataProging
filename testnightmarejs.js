const Nightmare = require('nightmare');
const utilities = require('./utilities')
const config = require('./config');




const getURLS = async () => {
    const nightmare = new Nightmare({ show: true });
    try {
        const result = await nightmare
            .goto(config.progarchivesBaseUrl)
            .on('console', (log, msg) => {
                console.log(msg)
            })
            .wait(2000)
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


const getBand = async (url, displayBrowser) => {
    const nightmare = new Nightmare({ show: displayBrowser });
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
            .wait(2000)
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
                        'link': link[0]
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


getBands = async (urls = [], displayBrowser = false) => {

  
    if (!urls) return

    const series = urls.reduce(async (queue, number) => {
        const dataArray = await queue;
        dataArray.push(await getBand(number, displayBrowser));
        return dataArray;
    }, Promise.resolve([]));

    return series
}



getBandByURL = async (url, filename) => {
    data = getBand(url)
        .then((data) => utilities.NodeWritetoFile(filename, data))
        .catch(e => console.error(e));
}



getAllBandsTask = async (urls = [], displayBrowser = false) => {
    if (!urls.length) {
        urls = await getURLS()
    }
    getBands(urls, displayBrowser)
        .then(data => {
            utilities.dataTofile(data, config.bandParsingSuccesFileName, config.errorFileName, config.writeToFileModes.append)
        }
        )
        .catch(e => console.error(e))
        .then(() => {
            const path = config.bandparsingErrors
            if (!utilities.fileExists(path)) return
            const failures = utilities.readFile(path)
                .then((data) => {
                    if (!data.length) return
                    getBands(data.map((datum) => { return datum.url }))
                        .then(data =>
                             utilities.dataTofile(data, config.bandParsingSuccesFileName, config.errorFileName, config.writeToFileModes.append))
                             .then(()=>{
                                const path = config.outputpath
                                if (!utilities.fileExists(path)) return
                                const bands = utilities.readFile(path)
                                    .then((data) => {
                                     dataFromFile = data.map((letter)=> {return letter[0].letter})
                                     intialData = urls.map((url)=> {return url.substring(url.indexOf("=") + 1, url.length)})
                                     const differences  = utilities.checkForMissingData(intialData,dataFromFile)
                                     console.log(differences)
                                     if (differences.length) getAllBandsTask(differences.map((diff)=> {return  config.bandsurl+diff}))
                                    }
                                    )
                            })





                }
                )
        })
        .catch((err) => console.error(err))
       
}




getAllBandsTask()

