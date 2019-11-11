const http = require('http') // core module of node (comes with the globally installed node you have on machine)

// fake mock data
const todos = [
  { id: 1, text: 'Todo One' },
  { id: 2, text: 'Todo Two' },
  { id: 3, text: 'Todo Three' }
]

/* 
 http.createServer takes a callback function as an argument whose params are a request object and a response object.
 When the server is running and listening for requests, every request will pass through that callback function
*/
const server = http.createServer((req, res) => {
  const { method, url } = req
  let body = []

  req
    .on('data', chunk => {
      // event listening that's listening if there's data within the body (the data key represents body that's send to server)
      // after every chunk of the body we get, we push it onto a body array
      body.push(chunk)
    })
    .on('end', () => {
      // after it ends we concat the chunks together and convert it to a usable format
      body = Buffer.concat(body).toString()

      let status = 404
      const response = {
        success: false,
        data: null,
        error: null
      }

      if (method === 'GET' && url === '/todos') {
        status = 200
        response.success = true
        response.data = todos
      } else if (method === 'POST' && url === '/todos') {
        const { id, text } = JSON.parse(body)

        if (!id || !text) {
          // confirming that both id and text are submitted to the server
          status = 400
          response.error = 'please enter id and text'
        } else {
          todos.push({ id, text })
          status = 201
          response.success = true
          response.data = todos
        }
      }

      res.writeHead(status, {
        'Content-Type': 'application/json',
        'X-Powered-By': 'Node.js'
      })

      res.end(JSON.stringify(response))
    })
  /*
    IMPORTANT: Remember that data doesn't actually get to the server all in one piece. Think about networking and how the entire body gets split up
    to be sent bit by bit. That's why body is it an array. Every time there's a 'data' event that happens with the request body, it gets pushed to the
    back of the array and the Buffer helps turn that data back into a usable form for us. Chunk refers to the bits that get sent each time
  */
})

const PORT = 5000

server.listen(PORT, () => console.log(`server running on port ${PORT}`))
