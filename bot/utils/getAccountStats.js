const getKey = require("./getKey");

async function getAccountStats(user) {
    try {
        const { key, status } = await getKey(user)
        console.log(user)


        switch (status) {
            case true:
                const getAccount = await fetch(`http://localhost:1234/account/${user}/${key}`)
                let response = await getAccount.json()
                console.log(response)

                const totalFeelings = response.totalFeelings;
                const getFriends = response.friends
                const friends = []

                getFriends.forEach(element => {
                    if (!friends.includes(element.friendId)) {
                        friends.push(element.friendId)
                    }
                })

                const friendCount = friends.length
                let categoryCount = new Map()
                categoryCount.set("yellow", response.yellowCount)
                categoryCount.set("blue", response.blueCount)
                categoryCount.set("red", response.redCount)
                categoryCount.set("green", response.greenCount)
                console.log(__filename, "account stats (line 31)")
                return { friends, categoryCount, totalFeelings, friendCount, status}
                break;
            case false:
                console.log("no account found")
                console.log(__filename, "account stats (line 36)", false)
                return {status}
        }

    } catch (error) {
        console.log(error)
    }
}








module.exports = getAccountStats;

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