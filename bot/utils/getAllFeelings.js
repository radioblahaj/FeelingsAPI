const getKey = require("./getKey");

async function getAllFeelings(user) {
   try {
     const {key, status} = await getKey(user)
     console.log(status)
     const status2 = status;
     const getFeelings = await fetch(`http://localhost:1234/feelings/${user}/${key}`)
     if (!getFeelings.ok) {
      return status
     }
     let response = await getFeelings.json()
     // console.log(response)
     
     const feelings = new Map()
 
     response.forEach(element => {
         feelings.set(element.id, element)
     });
 
     // console.log(feelings)
     return { feelings, status2 }

   } catch (error) {
    console.log(error)
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