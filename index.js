var express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(express.static('public'));
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


app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  var data = req.body;
  console.log("hit");

  // Make sure this is a page subscription
  if (data.object == 'page') {

    res.sendStatus(200);
  }
});



app.get("/", function (req, res){
res.send("hello world");
});
//Make Express listening
app.listen(process.env.PORT || 80); 
