const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];  


// ENDPOINTS


// ----------------------- gets event & sends it out to services ------------------- //
app.post('/events', (req, res) => { 
  const event = req.body;   // w/e is in our req.body will be our event
  events.push(event); // most recent event is at the end of the array
  // todo - handle event failures that may occur at each endpoint
  axios.post('http://localhost:4000/events', event).catch((err) => {    // posts
    console.log(err.message);
  });
  axios.post('http://localhost:4001/events', event).catch((err) => {    // comments
    console.log(err.message);
  });
  axios.post('http://localhost:4002/events', event).catch((err) => {    // query service
    console.log(err.message);
  });
  axios.post('http://localhost:4003/events', event).catch((err) => {    // moderation service
    console.log(err.message);
  });
  res.send({ status: 'OK' });
});

// --------------------- gets all the events & returns them to user ----------------- //
app.get('/events', (req, res) => { 
  res.send(events);
});


// LOCAL SERVER

app.listen(4005, () => {
  console.log('Listening on 4005 - event bus');         // 4005
});

