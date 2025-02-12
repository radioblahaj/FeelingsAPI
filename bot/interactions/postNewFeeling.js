require("dotenv").config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

async function postNewFeeling(body) {
    const {feeling1, feeling2, note, share, userId, channel} = body
    console.log(feeling1, feeling2, note, share, userId)
    
    await client.chat.postMessage({
        channel: channel, 
        text: `💛 <@${userId}> shared their feelings: they're feeling ${feeling1}`
    });
}

module.exports = {postNewFeeling};