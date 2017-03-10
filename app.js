var Botkit = require('botkit');
var system = require('child_process');

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT || !process.env.VERIFICATION_TOKEN) {
    console.log('Error: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN and PORT in environment');
    process.exit(1);
}

var config = {}
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: './db_bigscreen_slash_command/',
    };
}

var controller = Botkit.slackbot(config).configureSlackApp(
    {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scopes: ['commands', 'bot'],
    }
);

controller.setupWebserver(process.env.PORT, function (err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);

    controller.createOauthEndpoints(controller.webserver, function (err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });
});


//
// BEGIN EDITING HERE!
//

controller.on('slash_command', function (slashCommand, message) {
    switch (message.command) {
        case "/bigscreen": 
            // but first, let's make sure the token matches!
            if (message.token !== process.env.VERIFICATION_TOKEN) return; //just ignore it.

            // if no text was supplied, treat it as a help command
            if (message.text === "" || message.text === "help") {
                slashCommand.replyPrivate(message,
                    "send a youtube link you fool!");
                return;
            }

            var youtube_link  = message.text;

            if(youtube_link.includes("www.youtube.com")){

              var hash = youtube_link.split("v=")[1];

              var pre = '\"http://www.youtube.com/embed/';
              var post = '?rel=0&autoplay=1\"';

              var link = pre+hash+post;

              console.log("playing this video: ", link);

              const exec = require('child_process').exec;
              exec('run.bat ' + link, (err, stdout, stderr) => {
                if (err) {
                  console.error(err);
                  slashCommand.replyPrivate(message, "NOT A YOUTUBE LINK, YO!");
                  return;
                }
                  console.log(stdout);
              });

              slashCommand.replyPublic(message, message.text + " is now playing on the bigscreen, party on!");

            }else{
              slashCommand.replyPrivate(message, "NOT A YOUTUBE LINK, YO!");
            }
            break;
        default:
            slashCommand.replyPublic(message, "I'm afraid I don't know how to " + message.command + " yet.");
    }

});