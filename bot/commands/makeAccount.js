async function makeAccount(args) {
    const { payload, client, respond } = args;
    const { user_id, text, channel_id } = payload;

    const userInfo = await client.users.info({ user: user_id });
    const isAdmin = userInfo.user.is_admin;
    const commands = text.split(" ");
    let channel = commands[0].split('|')[0].replace("<#", "");


    // // const userProfile = await client.users.profile.get({ user: userToBan });
    // const profilePhoto = userProfile.profile.image_512;
    // const displayName = userProfile.profile.display_name;


    const errors = []
  
    

    if (errors.length > 0)
                return await client.chat.postEphemeral({  user: `${user_id}`, text: errors.join("\n") });
        
 

    try {
        const makeAccount = await fetch("http://localhost:1234/account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user_id,
                channel: channel
            })    
        });


        let response = await makeAccount.json()
        let key = response.data.key
        console.log(response)
        console.log(key)

        await respond(key)
        
    } catch (e) {
                console.log(e)
            }

      
   

}

module.exports = makeAccount;
