const {JSDOM} = require('jsdom')

async function crawlPage(baseURL,currentURL, pages) {

    const baseURLObj = new URL (baseURL)
    const currentURLObj = new URL (currentURL)
    if(baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)
    if(pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1
    console.log(`actively crawling: ${currentURL} `)

    try {
        const resp = await fetch(currentURL)
        if(resp.status > 399) {
            console.log(`error in fetch status code ${resp.status} on page ${currentURL}`)
            return pages
        }

        const contentType = resp.headers.get('content-type')
        if(!contentType.includes('text/html')) {
            console.log(`no html response, content type ${contentType} on page ${currentURL}`)
            return pages
        }

        const htmlbody = await resp.text()

       const nextURLs = getURLsFromHTML(htmlbody, baseURL)

       for(const nextURL of nextURLs) {
        pages = await crawlPage(baseURL, nextURL, pages)
       }

    } catch (error) {
        console.log(`Error in page: ${error.message}, on page: ${currentURL}`)
    }
    return pages
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