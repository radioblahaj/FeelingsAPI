module.exports = async function view1({ ack, event, client, body, say, logger}) {
    console.log(body)
    const view = body.view.callback_id
    const key = body.view.state.values.GP0QW["plain_text_input-action"].value
    let users = []
    users = body.view.state.values.mFlbi["multi_users_select-action"].selected_users;
    const user = body['user']['id'];
    console.log(users)

       try {
        const response = await fetch("http://api.blahaj.diy/account/friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user,
                key: key,
                friendId: users[0]
            })
        })

        if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message from the response
        throw new Error(`Error: ${response.status} - ${errorMessage}`);
    }

    // Parse and return the JSON response
    const jsonResponse = await response.json();
    return jsonResponse;

    } catch(e) {
        console.log(e)
    }

    await ack();
}