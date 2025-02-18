module.exports = async function addFriend({ event, client, body, say, logger}) {
   
    await client.chat.postMessage({
            channel: "C074L3A4C3E",
            text: `test`
        });
}