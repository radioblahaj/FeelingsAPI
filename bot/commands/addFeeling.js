
async function addFeeling(args) {
    const { payload, client } = args;
    const { user_id, text, channel_id } = payload;

    const userInfo = await client.users.info({ user: user_id });
    const isAdmin = userInfo.user.is_admin;
    const commands = text.split(" ");

    const feeling = commands[0];
    const feeling2 = commands[1];
    const note = commands[2];
    const share = commands[3];
    const api = `localhost:3000/feelings?feeling=${feeling}&feeling2=${feeling2}&note=${note}&share=${share}`

    //TODO: Add temporary channel banning

    // // const userProfile = await client.users.profile.get({ user: userToBan });
    // const profilePhoto = userProfile.profile.image_512;
    // const displayName = userProfile.profile.display_name;


    const errors = []
    if(!feeling) errors.push("A feeling is required.")
    if(!feeling2) errors.push("A feeling is required.")
    if(!note) errors.push("A note is required.")
    if(!share) errors.push("A share is required.")
    

    if (errors.length > 0)
                return await client.chat.postEphemeral({  user: `${user_id}`, text: errors.join("\n") });
        
    
    try {
        await client.chat.postMessage({
            channel: channel_id,
            text: `${feeling} ${feeling2} ${note} ${share}`
        });

       

      

        // await client.chat.postEphemeral({
        //     channel: channel_id,
        //     user: user_id,
        //     text: `<@${userToBan}> has been banned from all channels for ${reason}`,
        //     mrkdwn: true
        // });
    } catch (e) {
        // await client.chat.postEphemeral({
        //     channel: channel_id,
        //     user: user_id,
        //     text: `An error occured: ${e}`
        // });
    }

}

module.exports = addFeeling;
