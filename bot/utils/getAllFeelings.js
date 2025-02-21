const getKey = require("./getKey");

async function getAllFeelings(user) {
    const key = await getKey(user)
    const getFeelings = await fetch(`http://localhost:1234/feelings/${user}/${key}`)
    let response = await getFeelings.json()
    // console.log(response)

    const feelings = new Map()

    response.forEach(element => {
        feelings.set(element.id, element)
    });
    
    return feelings
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