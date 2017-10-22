'use strict';

// Imports dependencies and set up http server
const
  fs = require('fs'),
  https = require('https'),
  express = require('express'),
  bodyParser = require('body-parser'),
  chatApi = require('./api/chat'),  
  app = express().use(bodyParser.json()); // creates express http server

app.set('port', (process.env.PORT || 5555));

app.get('/ping', (req, res) => {
  res.status(200).send('{"message": "welcome"}');
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  console.log('receive /webhook get request');
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "EAACouNekzsIBAKSbVILZBAHQwSlW7ZBoIaLiztK1znRkzOhJozYRp1NEfXfbXnC26xkFdhHVO1wvogZAayAGATvZAghuqpD17ylDDBH0JZC6OcADtRBbzQ5eT0uF3HZAE1bYzvGl5TqBFDoAz5nsmDCo1GEZB3IU2yQdzQ0jyhuuwZDZD"

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    }
  } else {
    // Responds with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {

  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhookEvent = entry.messaging[0];
      console.log(webhookEvent);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        chatApi.handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        chatApi.handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});


// Sets server port and logs message on success
// app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/message.vitestore.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/message.vitestore.com/fullchain.pem'),
  passphrase: 'abcde'
}, app).listen(app.get('port'), function () {
  console.log('Example app listening on port' + app.get('port'));
});
