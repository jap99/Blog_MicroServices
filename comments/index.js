const express = require('express')
const bodyParser = require('body-parser')      // for parsing json that's in body of request
const { randomBytes } = require('crypto')      // for getting a UID for postIDs
const cors = require('cors')
const { default: axios } = require('axios')

const app = express()      
app.use(bodyParser.json())
app.use(cors())

const commentsByPostID = {};    


// ENDPOINTS

// --------------- get all comments of a particular post --------------- // 
app.get('/posts/:id/comments', (req, res) => {       
    res.send(commentsByPostID[req.params.id]) || [];                // empty array is sent back to user in case the post has no comments
})

// -------------------------- create comment --------------------------- //
app.post('/posts/:id/comments', async (req, res) => {     
    const commentID = randomBytes(4).toString('hex')   
    const { content } = req.body
    const commentsArr = commentsByPostID[req.params.id] || [];      // uses endpoint url's id to see if post has array of comments; undefined returns []
    commentsArr.push({ 
        id: commentID, 
        content,
        pending: 'pending' 
    })
    commentsByPostID[req.params.id] = commentsArr
    // -------- send event to event bus -------- //
    await axios.post('http://event-bus-srv:4005/events', {       
        type: 'CommentCreated',
        data: { 
            id: commentID, 
            content, 
            postId: req.params.id,
            status: 'pending'
        }                                  
    })                       
    res.status(201).send(commentsArr)  
})

// -------------- gets events going to the /event endpoint ------------- //
app.post('/events', async (req, res) => {
  console.log('Received Event', req.body.type);
  const { type, data } = req.body;
  if (type === 'CommentModerated') {    // find comment & update status
    const { postId, id, status, content } = data;
    const commentsArr = commentsByPostID[postId] // gets all a post's comments
    const comment = commentsArr.find(comment => {
        return comment.id === id;
    });
    comment.status = status;  // it's a reference type so we don't need to directly update it in the array
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentUpdated',
        data: {
            id, 
            status,
            postId,
            content
        }
    })
  }
  res.send({});
});


// LOCAL SERVER

app.listen(4001, () => {
    console.log('LISTENING ON 4001 - comments service')
})


