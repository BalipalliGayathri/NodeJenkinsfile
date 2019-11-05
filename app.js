// Load the Watson Developer Cloud library.
var express = require('express');
var app = express();
var watson = require('watson-developer-cloud');
var bodyParser = require('body-parser');
var request = require('request');
var port = 8000;
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json())
var context={};
var token = 'EAAFu0jBgqQYBABKD27EUC5F6IQqpBiTC8aj6vERE5hq1b6ObBIYPaw6pnnwg28agQCCaAQSF65DheiHdiqscD1ruOI5ltn5yXKzuYlZCpfZBOpbAZBZAWpp5U55mhZBxo7ZBSHPOIIvwpg6Tl3sW466nxB0JNj2KLIopZBAVLaovXufzREHr1aLtux5zzBWRW0ZD';
var FbUserId = '';
var respBasicData;

//Initializing Watson Assiatant

var assistant = new watson.AssistantV1({
  iam_apikey: 'CjGbUCXpTokp2szQnmdEwUaibXmb6SEONFVC-Ez8kEwK',
  version: '2019-09-20',
  url: 'https://gateway-lon.watsonplatform.net/assistant/api'
});


app.get('/', (req, res) => {
	console.log('get webhook');
	if (req.query['hub.verify_token'] === 'RetailChatbot') {
		res.send(req.query['hub.challenge']);
	} else
		res.send('Error when we try to validating your token.');
});

app.post('/', (req, res) => {

	res.sendStatus(200);
	for (let i = 0; i < req.body.entry[0].messaging.length; i++) 
	{
		FbUserId = req.body.entry[0].messaging[i].sender.id;
		respBasicData = req.body.entry[0].messaging[i].message.text;
      var payload = {
		workspace_id: 'eeaf35d6-2ef2-4425-b18c-451f14f7ddff',
		input: {
			"text": respBasicData
		},
		context: context
	}		
		assistant.message(payload,  function(err, response) {
				  if (err)
					console.log('error:', err);
				  else{
					  console.log(JSON.stringify(response, null, 2));	
                    context=response.context;					  
				   loginSend(FbUserId,response.output.text[0])
				  }
				   
				});
	}

	});
	
// Getting user details using Facebook Graph API
	function loginSend(id, text)
	{

    var dataPost = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: token
        },
        method: 'POST',
        json: {
            recipient: {
                id: id
            },
            message: {
                "text": text	  
            }
        }
    };
    requestFunction(dataPost)
}

function requestFunction(dataPost) {

    request(dataPost, (error, response, body) => {
        if (error) {
            console.log('Error when we try to sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        } else {
            console.log("Successfully Sent the message");
        }
    });

}

app.listen(port, function() {
  console.log('running on 8000');
});
 