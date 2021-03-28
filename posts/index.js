const express = require('express')
const bodyParser = require('body-parser')      // so when a user sends us json in the body of a request that it shows up correct in the function’s request handler (the param) & actually gets parsed. 
const { randomBytes } = require('crypto')      // for getting UUID for post
const cors = require('cors')
const { default: axios } = require('axios')

const app = express()      
app.use(bodyParser.json())
app.use(cors())

const posts = {}   // all posts will be stored on RAM only


// ENDPOINTS

// --------------- get all posts --------------- // 
app.get('/posts', (req, res) => {       
    res.send(posts)
})

// ---------------- create post ---------------- //
app.post('/posts/create', async (req, res) => {     
    const id = randomBytes(4).toString('hex')               // 4 byes of random data (so we can get a string), it'll be hexadecimal
    const { title } = req.body
    posts[id] = { id, title }                               // add post to dictionary
    // -------- send event to event bus -------- //
    await axios.post('http://event-bus-srv:4005/events', {      // added await here & async to app.post(/posts,) cuz it's an async operation
        type: 'PostCreated',
        data: { id, title }                                 // data is the post
    })
    res.status(201).send(posts[id])                         // sending post w/ the response 
});

// ----------------- gets event ----------------- //
app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);
  res.send({});
});


// LOCAL SERVER

app.listen(4000, () => {
    console.log('--- v3 ---');
    console.log('LISTENING ON 4000 - posts service')
})


