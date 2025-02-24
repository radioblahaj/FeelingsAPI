require("dotenv").config();

async function getKey(user) {
    console.log(process.env.AUTH_TOKEN)
   try {

     const getUser = await fetch(`http://localhost:1234/account/key/${process.env.AUTH_TOKEN}?user=${user}`, {
     });
     let response = await getUser.json()
     console.log(response)
     let key = response.data
     let status = getUser.ok

     console.log("Get Key", status)

     return {key, status}

   } catch (error) {
    console.log(error)
 }
}

module.exports = getKey
