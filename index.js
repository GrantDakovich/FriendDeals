var express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var app = express();
app.use(bodyParser.json());

const str = "EAAC7SW3lmZAMBAIhRQ3RvcRy8DbT4KcZCvnpRBUjqU8c2sw388W3tD3z2Lb5Klt1PCwhKZA3NJP468HZAMMek0GWOCwHLKcXHFDMYm9mvAVT9ZALHnu2jITeu4ibSRLLls0wZBJBwkRTLTtIsXQwTzHhkSZBDEAIdXeoDlIuFDrG651h4r5GOPN";

function handleMessage(sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {    

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  } 
  
  // Sends the response message
  callSendAPI(sender_psid, response);  
  sendButtonMessage(sender_psid);
}

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          title: "This is a generic",
          image_url: "https://i.picsum.photos/id/430/200/100.jpg",
          subtitle: "Use FriendDeals and save you and a friend money!",
          buttons:[{
            type: "web_url",
            url: "https://www.google.com",
            title: "Buy now!"
          }, {
            type: "web_url",
            url: "https://www.google.com",
            title: "Invite a friend and save with FriendDeals!"
          }, {
            type: "web_url",
            url: "https://www.google.com",
            title: "Use another friend's code!"
          }]
        }
      }
    }
  };

  callGenericSendAPI(messageData);
}

function callGenericSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: str },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s",
          messageId, recipientId);
      } else {
      console.log("Successfully called Send API for recipient %s",
        recipientId);
      }
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": str },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 

}

/*
var FBBotFramework = require('fb-bot-framework');
// Initialize
var bot = new FBBotFramework({
page_token: "EAADXTIp7SSkBAFqdZAwak5HDYqMcZCB4KsLlcQMPOcyZB4ChztEjgSkORXF9KZAKXNvBpis6oDsQ5CyRmri64ZAbs5PljjNfJntTTuOiHvqOeaFhyZBrV1QXOk2uDPRdxrr4Y9hBWJzrYuNKcV5bD8ZC86mDxLMla42gaZBSS6ByV0XBX6Er6AYP",
verify_token: "verify_token"
});
// Setup Express middleware for /webhook
app.use('/webhook', bot.middleware());
// Setup listener for incoming messages
bot.on('message', function(userId, message){
bot.sendTextMessage(userId, "Echo Message: " + message);
});
*/

/*function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}*/

app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "verify_token";
    
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
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } 


    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});



app.get("/", function (req, res){
res.send("hello world");
});
//Make Express listening
app.listen(process.env.PORT || 80); 
