async function listFeelings(args) {
    const { payload, client } = args;
    const { user_id, text, channel_id } = payload;

    const userInfo = await client.users.info({ user: user_id });
    const isAdmin = userInfo.user.is_admin;
    const commands = text.split(" ");
    

    const friendsList = [
        "U06QST7V0J2", // Eesha
        "U07L45W79E1", // Neon
        "U060YRK2734", // Saran
        "U07SX29CECA", // Froppi
        "U015MCCBXBP", // Cara
        "U056J6JURFF", // Sofia
        "U05PYFCJXV0", // River
        "U06JLP2R8JV", // Firepup
        "U07PYPAF5RR", // Neko
        "U07958J0JJU", // Suya
        "U07BU2HS17Z", // Felix
        "U073Q4F60LQ", // Johnathon
        "U06MCHA590E", // Ari
        "U04FATFRE6T", // Sean
        "U06NHEFDE4S", // Jovie
        "U07346379NY", // Kess
        "U01581HFAGZ", // Alex Park
        "U059VC0UDEU", // Skyfall
        "U06EMBJH71S", // Lou
        "U07BHUMT6UT", // Surya
        "U01MPHKFZ7S", // Me!
    ]

    // // const userProfile = await client.users.profile.get({ user: userToBan });
    // const profilePhoto = userProfile.profile.image_512;
    // const displayName = userProfile.profile.display_name;


    const errors = []
   if (!user_id in friendsList) errors.push("You are not authorized to use this command."
   )
    

    if (errors.length > 0)
                return await client.chat.postEphemeral({  user: `${user_id}`, text: errors.join("\n") });
        
    async function getFeelings() {
        const request = await fetch("http://localhost:3000/feelings?feeling2=bored")
        const data = await request.json()
        console.log(data)
        
    }
    getFeelings()

    try {
        console.log(user_id)
        if (friendsList.includes(user_id)) {
            console.log("User is in friends list")
           
        } else {
            console.log("User is not in friends list")
        }
        // await client.chat.postMessage({
        //     channel: channel_id,
        //     text: `${feeling} ${feeling2} ${note} ${share}`
        // });
            } catch (e) {
                console.log(e)
            }

        // await client.chat.postEphemeral({
        //     channel: channel_id,
        //     user: user_id,
        //     text: `<@${userToBan}> has been banned from all channels for ${reason}`,
        //     mrkdwn: true
        // });
   

}

module.exports = listFeelings;
