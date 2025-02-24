const getKey = require("./getKey");
const path = require("path");


async function getAllFeelings(user, item="", query="") {
   try {
     const {key, status} = await getKey(user)
     console.log(__filename, "I'm running (Line 8)")
     const getFeelings = await fetch(`http://localhost:1234/feelings/${user}/${key}?${item}=${query}`)
     if (!getFeelings.ok) {
      return status
     }
     let response = await getFeelings.json()
     console.log(response)
     console.log(__filename, "i got feelings! (Line 15)")
     const feelings = new Map()
 
     response.forEach(element => {
         feelings.set(element.id, element)
     });
 
     console.log(feelings)
     return feelings

   } catch (error) {
    console.log(__filename, error)
   }
}








module.exports = getAllFeelings;

// const friendsFeelings = await Promise.all(
//     friends.map(friend =>
//         prisma.feelings.findMany({
//             where: {
//                 userId: friend.friendId,
//                 share: true
//             }
//         })
//     )
// )