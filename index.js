var express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

//const dbhandler = require('./dbhandler.js');


var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const str = "EAAC7SW3lmZAMBAIhRQ3RvcRy8DbT4KcZCvnpRBUjqU8c2sw388W3tD3z2Lb5Klt1PCwhKZA3NJP468HZAMMek0GWOCwHLKcXHFDMYm9mvAVT9ZALHnu2jITeu4ibSRLLls0wZBJBwkRTLTtIsXQwTzHhkSZBDEAIdXeoDlIuFDrG651h4r5GOPN";

function handleMessage(sender_psid, received_message) {

  // Check if the message contains text
  if (received_message.text) {    
  	if (received_message.text == "Hey"){
  		sendGenericMessage(sender_psid, 1);
  	}else {
	    // Create the payload for a basic text message
	    let response = {
	      "text": "Type 'Hey' to get started"
	    }
	    // Sends the response message
	  	callSendAPI(sender_psid, response); 
	}
  } 
  else {
		// Create the payload for a basic text message
	    let response = {
	      "text": "Type 'Hey' to get started"
	    }
	    // Sends the response message
	  	callSendAPI(sender_psid, response); 
  }
  
   
  
}

function handlePostback(sender_psid, postback_event){

  	var payload = postback_event.postback.payload;
  	console.log(payload);
  	var response = {};
  	if (payload == "Getting Started"){
  		sendGenericMessage(sender_psid, 1);
  	}
	else if (payload == "Pay"){
		/*response = {
			"text": "FriendCode is: 23sjdw3"
		}
		callSendAPI(sender_psid, response);*/
		var messageData = {
		    recipient: {
		      id: sender_psid
		    },
		    message: {
			    attachment: {
			        type: "template",
			        payload: {
			            template_type: "button",
			            text: "Ready to pay?",
			            buttons: [{
			                type: "web_url",
			                url: "https://messenger-bot-hack.herokuapp.com/pay",
			                title: "Go to Pay",
			                webview_height_ratio: "compact",
			                messenger_extensions: true
			            }]
			        }
			    }
			}
		};
		callGenericSendAPI(messageData);
	}
	else if (payload == "Going back"){
		sendGenericMessage(sender_psid, 1);
	}
	else if (payload == "Access Friend Deals"){
		sendGenericMessage(sender_psid, 2);
	}
	else if (payload == "Use friend code"){
		response = {
			"text": "Message us a code from your friend"
		}
		callSendAPI(sender_psid, response);
	}
	else if (payload == "Get Friend Code"){
		sendGenericMessage(sender_psid, 3);
	}
  
}

function sendGenericMessage(recipientId, generic_num) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
        	template_type: "generic",
        	elements: getGenericElements(generic_num)
        }
      }
    }
  };

  callGenericSendAPI(messageData);
}

function getGenericElements(pay_num){
	var elements = [];
	if (pay_num === 1){
	    elements = [{
        	title: "This is a generic",
          	image_url: "https://i.picsum.photos/id/430/250/150.jpg",
          	subtitle: "Use FriendDeals and save you and a friend money!",
          	buttons:[{
            	type: "postback",
            	title: "Buy now!",
            	payload: "Pay"
          	}, {
            	type: "postback",
            	title: "FriendDeals!!",
            	payload: "Access Friend Deals"
          	}]
	    }];
	} else if (pay_num === 2){
		elements = [{
        	title: "This is a generic",
          	image_url: "https://i.picsum.photos/id/430/250/150.jpg",
          	subtitle: "Use FriendDeals and save you and a friend money!",
          	buttons:[{
            	type: "postback",
            	title: "Get Friend Code",
            	payload: "Get friend code"
          	}, {
            	type: "postback",
            	title: "Use a Friend Code",
            	payload: "Use friend code"
          	}, {
            	type: "postback",
            	title: "Go Back",
            	payload: "Going back"
          	}]
	    }];
	} else if (pay_num === 3){
		elements = [{
        	title: "This is a generic",
          	image_url: "https://i.picsum.photos/id/430/250/150.jpg",
          	subtitle: "Take a screen-shot and send friend code to a friend. \nYour friend code is xerwio3",
          	buttons:[{
            	type: "postback",
            	title: "Continue...",
            	payload: "Pay"
          	}]
	    }];
	}
	
	return elements;
}



/*
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
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",
            image_url: "https://i.picsum.photos/id/430/200/100.jpg",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",
            image_url: "https://i.picsum.photos/id/430/200/100.jpg",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };

  callGenericSendAPI(messageData);
}
*/
function callGenericSendAPI(messageData){
	request({
	    "uri": "https://graph.facebook.com/v2.6/me/messages",
	    "qs": { "access_token": str },
	    "method": "POST",
	    "json": messageData
	  }, (err, res, body) => {
	    if (!err) {
	      console.log('message sent!')
	    } else {
	      console.error("Unable to send message:" + err);
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

/*
app.get('/fill', (req, res) => {
  dbhandler.fillWithData();
  res.send("sfioae");
})
*/

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
      } else if (webhook_event.postback){
      	handlePostback(sender_psid, webhook_event);
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

app.get('/pay', (req, res) => {
	let referer = req.get('Referer');
	if (referer) {
	    if (referer.indexOf('www.messenger.com') >= 0) {
	        res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
	    } else if (referer.indexOf('www.facebook.com') >= 0) {
	        res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
	    }
	    console.log("here");
	    res.sendFile('public/pay.html', {root: __dirname});
	}
});

app.get('/paypostback', (req, res) => {
	let body = req.query;
	var response = {
	    "text": `Success ${body.card_number}`
	};
	sendGenericMessage(body.psid, 1)
	callSendAPI(body.psid, response);
	res.status(200).send('Please close this window to return to the conversation thread.');
});

//Make Express listening
app.listen(process.env.PORT || 80);






