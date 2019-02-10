//Imported the http, url and string_decoder module of node #dependency
const http = require('http')
const url = require('url')
const stringDecoder = require('string_decoder').StringDecoder

//The server's response to requests
const server = http.createServer( (req, res) => {
    // Get the url and parse it
    const parsedUrl = url.parse(req.url, true)
    
    if (req.url === '/favicon.ico') {
        return;
    }

    //Get the path
    const path = parsedUrl.pathname
    const regExp = /^\/+|\/+$/g
    const trimmedPath = path.replace(regExp, '') //This omits the unwanted slashes from the url path

    //Get the query string as an object
    const queryStringObject = parsedUrl.query

    //Get the headers as object
    const headers = req.headers

    //Get the method
    const method = req.method.toUpperCase()

    //Getting the payloads
    const decoder = new stringDecoder('utf-8')
    let buffer = ''

    req.on('data', (info) => {
        buffer += decoder.write(info)
    })

    req.on('end', () => {
        buffer += decoder.end()

        //Send the response
        res.end('The server is actively responding!\n')

        //Log the request path
        console.log('Received payloads: ', buffer)
        //console.log('Request received on path: ' + trimmedPath + ' with method ' + method + ' and query string object parameters', queryStringObject, 'and a header ', headers)
    
    })

  
})

//The server listens to port 8000($PORT)
const PORT = 8000
server.listen(PORT, () => {
    console.log('The server is listening to port ' + PORT)
})

