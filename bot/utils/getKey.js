require("dotenv").config();

async function getKey(user) {
    console.log(process.env.AUTH_TOKEN)
    const getUser = await fetch(`http://localhost:1234/account/key/${process.env.AUTH_TOKEN}?user=${user}`, {
    });
    let response = await getUser.json()
    let key = response.data
    console.log(key)
    return key
}

module.exports = getKey
