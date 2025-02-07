require("dotenv").config();


async function postNewFeeling(feeling1, feeling2, note, share) {

await client.chat.postMessage({
    channel: "C074L3A4C3E",
    text: `💛 Alaska shared their feelings: they're feeling ${feeling}`
});

}




module.exports = postNewFeeling;