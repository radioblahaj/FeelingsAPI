require("dotenv").config();


async function postNewFeeling(body) {
    const {feeling1, feeling2, note, share, userId} = body
await client.chat.postMessage({
    channel: "C074L3A4C3E",
    text: `💛 <@${userId}> shared their feelings: they're feeling ${feeling}`
});

}




module.exports = postNewFeeling;