module.exports = async function view1({ ack, event, client, body, say, logger }) {
    const view = body.view.callback_id
    let users = []
    console.log(body.view.state.values)
    users = body.view.state.values.l8waY["multi_users_select-action"].selected_users;
    const user = body['user']['id'];
    console.log(users)
    const getKey = require("../utils/getKey");
    const key = await getKey(user)

    try {
        const makeAccount = await fetch("http://localhost:1234/account/friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                key: key,
                userId: user,
                friendId: users[0]
            })
        });
        
        await client.chat.postMessage({
            channel: users[0],
            text: `<@${user}> added you as a friend! You can see their feelings now (this is a test, ignore this message)`
        })


        console.log("?")
        await ack()
        
        if (!makeAccount.ok) {
            const errorMessage = await makeAccount.text(); // Get the error message from the response
            throw new Error(`Error: ${makeAccount.status} - ${errorMessage}`);
        }
        console.log(makeAccount)

        // Parse and return the JSON response
        const jsonResponse = await makeAccount.json();
        return jsonResponse;

    } catch (e) {
        console.log(e)
    }

   
}