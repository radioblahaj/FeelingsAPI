async function addFeeling(args) {
    const { payload, client } = args;
    const { user_id, text, channel_id } = payload;

    const commands = text.split(" ");

    const feeling = commands[0];
    const feeling2 = commands[1];
    const note = commands[2]
    const share = commands[3];
    const key = commands[4];


    const userProfile = await client.users.profile.get({ user: user_id });
    const profilePhoto = userProfile.profile.image_512;
    const displayName = userProfile.profile.display_name;


    const errors = []
    if(!feeling) errors.push("A feeling is required.")
    if(!feeling2) errors.push("A feeling is required.")
    if(!note) errors.push("A note is required.")
    if(!share) errors.push("A share is required.")
    

    if (errors.length > 0)
                return await client.chat.postEphemeral({  user: `${user_id}`, text: errors.join("\n") });
        
    
    try {
        // await client.chat.postMessage({
        //     channel: channel_id,
        //     text: `${feeling} ${feeling2} ${note} ${share}`
        // });

        const response = await fetch("http://localhost:3000/feelings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                feeling1: feeling, 
                feeling2: feeling2, 
                note: note, 
                share: share === "true",
                userId: user_id,
                key: "your-secret-key"
            })
        });
    
        const data = await response.json();
        const {category, category2} = data.data;
        const channel = "C074L3A4C3E"


        if (share === "true") {
            if (category === "yellow") {
                await client.chat.postMessage({
                    channel: channel,
                    text: `💛 <@${user_id}> shared their feelings: they're feeling ${feeling}`
                });
            } else if (category === "blue") {
                await client.chat.postMessage({
                    channel: channel,
                    text: `💙 <@${user_id}> shared their feelings: they're feeling ${feeling}`
                });
            }
            else if (category === "green") {
                await client.chat.postMessage({
                    channel: channel,
                    text: `💚 <@${user_id}> shared their feelings: they're feeling ${feeling}`
                });
            }
            else if (category === "red") {
                await client.chat.postMessage({
                    channel: channel,
                    text: `🟥 <@${user_id}> shared their feelings: they're feeling ${feeling}`
                });
            }
        }

    } catch (e) {
       console.log(e)
    }

}

module.exports = addFeeling;
