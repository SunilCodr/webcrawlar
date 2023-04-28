const {JSDOM} = require('jsdom')

async function crawlPage(currentURL) {
    console.log(`actively crawling: ${currentURL} `)
    try {
        const resp = await fetch(currentURL)
        if(resp.status > 399) {
            console.log(`error in fetch status code ${resp.status} on page ${currentURL}`)
            return
        }

        const contentType = resp.headers.get('content-type')
        if(!contentType.includes('text/html')) {
            console.log(`no html response, content type ${contentType} on page ${currentURL}`)
            return
        }

        console.log(await resp.text()) 
    } catch (error) {
        console.log(`Error in page: ${error.message}, on page: ${currentURL}`)
    }
}

function getURLsFromHTML (htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for(const linkElement of linkElements) {
        if(linkElement.href.slice(0, 1) === "/") {
            //relative
            urls.push(`${baseURL}${linkElement.href}`)
        }
        else {
            //absolute
            urls.push(linkElement.href)
        }
    }
    console.log(urls)
    return urls
}


function normalizeURL (urlString) {
    const urlObj = new URL (urlString)
    const hostpath =  `${urlObj.hostname}${urlObj.pathname}`
    if(hostpath.length > 0 && hostpath.slice(-1) === "/") {
        return hostpath.slice(0, -1)
    }
    return hostpath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}