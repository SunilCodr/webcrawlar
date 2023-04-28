const {normalizeURL, getURLsFromHTML} = require("./crawl")

const {test, expect} = require("@jest/globals")

test("normalizeURL strip protocol", ()=> {
    const input = "https://blog.boot.dev/path"
    const actual = normalizeURL(input);
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
})

test("normalizeURL strip trailing slash", ()=> {
    const input = "https://blog.boot.dev/path/"
    const actual = normalizeURL(input);
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
})
test("normalizeURL capitals", ()=> {
    const input = "https://BLOG.boot.dev/path"
    const actual = normalizeURL(input);
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
})
test("normalizeURL http", ()=> {
    const input = "http://BLOG.boot.dev/path"
    const actual = normalizeURL(input);
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
})

// test("getURLsFromHML absolute", ()=> {
//     const inputHTMLBody = `
//     <html?>
//         <body>
//             <a href="https://blog.boot.dev/path">
//                 Boot.dev blog
//             </a>
//         </body>
//     </html?
//     `
//     const inputBaseURL = 'https://blog.boot.dev/path'
//     const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
//     const expected = ["https://blog.boot.dev/path"]
//     expect(actual).toEqual(expected)
// })

// test("getURLsFromHML relative", ()=> {
//     const inputHTMLBody = `
//     <html?>
//         <body>
//             <a href="/path/">
//                 Boot.dev blog
//             </a>
//         </body>
//     </html?
//     `
//     const inputBaseURL = 'https://blog.boot.dev'
//     const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
//     const expected = ["https://blog.boot.dev/path/"]
//     expect(actual).toEqual(expected)
// })

test("getURLsFromHML both", ()=> {
    const inputHTMLBody = `
    <html?>
        <body>
            <a href="https://blog.boot.dev/path1/"
                Boot.dev blog path 1
            </a>
            <a href="/path2/">
                Boot.dev blog path 2
            </a>
        </body>
    </html?
    `
    const inputBaseURL = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ["https://blog.boot.dev/path1/","https://blog.boot.dev/path2/" ]
    expect(actual).toEqual(expected)
})