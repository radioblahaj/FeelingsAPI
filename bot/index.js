const { App, LogLevel, ExpressReceiver } = require("@slack/bolt");
require("dotenv").config();
// const { getPrisma } = require('./utils/prismaConnector.js');
// const prisma = getPrisma();
const express = require('express')


// const receiver = new ExpressReceiver({
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
// })


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    // receiver,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    // Using socket mode, however we still want for it to reply to OAuth
    port: process.env.PORT || 3000,
});

// receiver.router.use(express.json())
// receiver.router.get('/', require('./endpoints/index'))
// receiver.router.get('/ping', require('./endpoints/ping'))

// app.client.chat.postMessage({
//     channel: "C074L3A4C3E",
//     text: `Alaska Feelings is online again!`
// })




app.event('message', async (args) => {
    // begin the firehose
    const { body, client } = args
    const { event } = body
    const { type, subtype, user, channel, ts, text } = event

  

});



app.command(/.*?/, async (args) => {

    const { ack, command, respond } = args;

    await ack();

    switch (command.command) {
        case '/addfeeling' :
            await require('./commands/addFeeling.js')(args);
            break;
        case '/removeFeeling':
            await require('./commands/removeFeeling.js')(args);
            break;
        case '/listFeeling':
            await require('./commands/listFeelings.js')(args);
            break;
        default:
            await respond(`I don't know how to respond to the command ${command.command}`);
            break;
    }

})


// Start the app on the specified port
// const port = process.env.PORT || 3000; // Get the port from environment variable or default to 3000
app.start().then(() => {
    app.logger.info(`Bolt is running!}`)
});
