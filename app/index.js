//Imported the http, url and string_decoder module of node #dependency
const http = require('http')
const url = require('url')
const stringDecoder = require('string_decoder').StringDecoder
let config = require('./config')


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
        console.log(buffer)
        //Choosing the handle
        let chosenHandler = typeof(router[trimmedPath]) == 'undefined' ? handlers.notFound : handlers.sample

        //Construct the data object to be sent to the handler
        let data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        }

        //Route the request to the handler in router
        chosenHandler(data, (statusCode, payload) => {
            //Default status code is 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200
            //Default payload is null
            payload = typeof(payload) == 'object' ? payload : {}

            //Convert the payload to a string
            let payloadString = JSON.stringify(payload)

            //Send the response
            res.setHeader('content-type', 'application/json')
            res.writeHead(statusCode)

            res.end(payloadString, '\n'  )

            //Log the request path
            console.log('Received responses: ', statusCode, payloadString)
            console.log(payloadString)
        })     
        //console.log('Request received on path: ' + trimmedPath + ' with method ' + method + ' and query string object parameters', queryStringObject, 'and a header ', headers)
    
    })

  
})

//The server listens to port 8000($PORT)

server.listen(config.port, () => {
    console.log('The server is listening to port ' + config.port + ' in ' + config.envName + ' mode')
})

//Defining handlers
let handlers = {}

//Sample handler
handlers.sample = (data, callback) => {
    callback(406, { 'name' : 'sample handler' })
}

//Not Found Handler
handlers.notFound = (data, callback) => {
    //Callback an http status code and a payload object
    callback(409)
}


//Creating a router
let router = {
    'sample' : handlers.sample
}
