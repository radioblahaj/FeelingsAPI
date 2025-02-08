/**
 * @fileoverview Express server for feelings tracking application
 * 
 * API Endpoints:
 * GET /feelings/:userId/:keyword - Get feelings for a user, filtered by query params
 * GET /feelings/date/:userId/:keyword - Get feelings for a user on a specific date
 * GET /feelings/all/:userId/:keyword - Get all feelings for a user
 * POST /account - Create a new user account
 * POST /feelings - Create a new feeling entry
 * POST /account/friends - Add a friend connection
 * GET /account/friends/:userId/:keyword - Get a user's friends
 * GET /feelings/friends/:userId/:keyword - Get feelings shared by friends
 */

const express = require("express");
const app = express();
const port = 3000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const feelingsCategories = require("./feelingsCategories.js")
const crypto = require("crypto");
const chrono = require('chrono-node');


app.use(express.json());


/**
 * Gets the category for a given feeling
 * @param {string} feeling - The feeling to look up
 * @returns {string} The category the feeling belongs to
 */
function getCategory(feeling) {
    let category = ""
    for (let i = 0; i < feelingsCategories.length; i++) {
        if (feeling === feelingsCategories[i].feeling) {
            category = feelingsCategories[i].category
        }
    }
    return category
}

app.get('/', (req, res) => {
    res.redirect("https://github.com/radioblahaj/YouFeelWeFeel")
})


/**
 * GET /feelings/:userId/:keyword
 * Get feelings for a user, with optional query param filters
 * @param {string} userId - The user's slack ID
 * @param {string} keyword - Authentication key
 * @param {Object} req.query - Query parameters to filter feelings
 * @returns {Object} Filtered feelings data
 */
app.get('/feelings/:userId/:keyword', async (req, res, next) => {
    const userId = req.params.userId
    const keyword = req.params.keyword


    const userKey = await prisma.user.findFirst({
        where: {
            slackId: userId,
            key: keyword
        }
    })

    if (!userKey) {
        res.status(401).send("Unauthorized")
        return
    }

    const feelings = await prisma.feelings.findMany({
        where: {
            userId: userId
        }
    })

    console.log(feelings)

    const data = feelings;
    const filters = req.query;
    console.log(filters)
    const filteredFeelings = data.filter(feeling => {
        let isValid = true;
        for (key in filters) {
            console.log(key, filters[key], filters[key])
            isValid = isValid && feeling[key] == filters[key];
        }
        return isValid;
    });

    res.json({
        data: filteredFeelings
    })
});

/**
 * GET /feelings/date/:userId/:keyword
 * Get feelings for a user on a specific date
 * @param {string} userId - The user's slack ID
 * @param {string} keyword - Authentication key
 * @param {string} req.query.range - Date range in natural language (e.g. "today", "yesterday")
 * @returns {Object} Feelings for the specified date
 */
app.get('/feelings/date/:userId/:keyword', async (req, res) => {

    const userId = req.params.userId
    const keyword = req.params.keyword


    const userKey = await prisma.user.findFirst({
        where: {
            slackId: userId,
            key: keyword
        }
    })

    if (!userKey) {
        res.status(401).send("Unauthorized")
        return
    }

    const range = req.query.range
    const parsedRange = chrono.parse(range)



    if (range === "today") {

        let date = parsedRange[0].start.date()
        let yesterday = chrono.parse("Yesterday")
        console.log(yesterday[0].start.date())
        let tomorrow = chrono.parse("Tomorrow")
        console.log(tomorrow[0].start.date())

        const feelings = await prisma.feelings.findMany({
            where: {
                userId: userId,
                date: {
                    gte: yesterday[0].start.date(),
                    lte: tomorrow[0].start.date()
                }
            }
        })
        return res.json({
            data: feelings
        })
    } else if (range === "yesterday") {
        let date = parsedRange[0].start.date()
        let yesterday = chrono.parse("Yesterday")
        console.log(yesterday[0].start.date())
        let tomorrow = chrono.parse("Tomorrow")
        console.log(tomorrow[0].start.date())

        const feelings = await prisma.feelings.findMany({
            where: {
                userId: userId,
                date: {
                    gte: yesterday[0].start.date(),
                    lte: tomorrow[0].start.date()
                }
            }
        })
        return res.json({
            data: feelings
        })

    } else if (range === "week") {
        let yesterday = chrono.parse("Yesterday")
        console.log(yesterday[0].start.date())
        let today = chrono.parse("Today")
        let lastWeek = chrono.parse("Last week")
        console.log(today[0].start.date())
        let tomorrow = chrono.parse("Tomorrow")
        console.log(tomorrow[0].start.date())

        const feelings = await prisma.feelings.findMany({
            where: {
                userId: userId,
                date: {
                    gte: lastWeek[0].start.date(),
                    lte: tomorrow[0].start.date()
                }
            }
        })
        return res.json({
            data: feelings
        })

    } else if (range === "month") {


    } else if (range === "year") {

    }
})

/**
 * GET /feelings/all/:userId/:keyword
 * Get all feelings for a user
 * @param {string} userId - The user's slack ID
 * @param {string} keyword - Authentication key
 * @returns {Object} All feelings for the user
 */
app.get('/feelings/all/:userId/:keyword', async (req, res) => {

    const userKey = await prisma.user.findFirst({
        where: {
            slackId: userId,
            key: keyword
        }
    })

    if (!userKey) {
        res.status(401).send("Unauthorized")
        return
    }

    const userId = req.params.userId
    const keyword = req.params.keyword
    console.log(range)
    res.json({
        data: range
    })

})

/**
 * POST /account
 * Create a new user account
 * @param {Object} req.body
 * @param {string} req.body.userId - User's slack ID
 * @param {string} req.body.channel - User's slack channel
 * @returns {Object} Generated authentication key
 */
app.post('/account', async (req, res) => {
    const { userId, channel } = req.body
    const key = crypto.randomBytes(20).toString('hex');

    const user = await prisma.user.create({
        data: {
            slackId: userId,
            key: key,
            channel: channel
        }
    })
    console.log(`Account created for ${userId}`)
    res.json({
        data: {
            key: key
        },
    })
})

/**
 * GET /account/:userId/:keyword
 * Get a user's account information
 * @param {string} userId - The user's slack ID
 * @param {string} keyword - Authentication key
 * @returns {Object} User account data
 */
app.get('/account/:userId/:keyword', async (req, res) => {
    const userId = req.params.userId
    const keyword = req.params.keyword
    const category = req.query.category


    const userKey = await prisma.user.findFirst({
        where: {
            slackId: userId,
            key: keyword
        }
    })

    if (!userKey) {
        res.status(401).send("Unauthorized")
        return
    }


    const feelingsByCategory = await prisma.feelings.count({
        where: {
            userId: userId,
            category: category
        }
    })

    const user = await prisma.user.findFirst({
        where: {
            slackId: userId
        }
    })

    const totalFeelings = await prisma.feelings.count({
        where: {
            userId: userId
        }
    })

    const friends = await prisma.friend.findMany({
        where: {
            userId: userId
        }
    })

    if (!feelingsByCategory) {
        feelingsByCategory = 0
    }


    res.json({
        data: {
            slackId: user.slackId,
            totalFeelings: totalFeelings,
            friends: friends,
            feelingsByCategory: feelingsByCategory
        }
    })
})


/**
 * POST /feelings
 * Create a new feeling entry
 * @param {Object} req.body
 * @param {string} req.body.feeling1 - Primary feeling
 * @param {string} req.body.feeling2 - Secondary feeling (optional)
 * @param {string} req.body.note - Note about the feeling (optional)
 * @param {boolean} req.body.share - Whether feeling is shared (optional)
 * @param {string} req.body.userId - User's slack ID
 * @param {string} req.body.keyword - Authentication key
 * @returns {Object} Categories for the feelings
 */
app.post('/feelings', async (req, res) => {
    const newFeeling = req.body;

    const { feeling1, feeling2, note, share, userId, keyword } = newFeeling

    const userKey = await prisma.user.findFirst({
        where: {
            slackId: userId,
            key: keyword
        }
    })
    if (!userKey) {
        res.status(401).send("Unauthorized")
        return
    }



    console.log("Received new feeling:", newFeeling);

    if (!userId) {
        res.error("User ID is required");
    }

    if (!share) {
        share = false;
    }

    if (!feeling1) {
        res.error("Feeling 1 is required");
        return
    }

    if (!feeling2) {
        feeling2 = null;
    }

    if (!note) {
        note = "";
    }


    const category = getCategory(feeling1);
    const category2 = getCategory(feeling2);


    try {
        const feeling = await prisma.feelings.create({
            data: {
                date: new Date(),
                feeling: feeling1,
                note: note,
                feeling2: feeling2,
                share: share,
                category: category,
                category2: category2,
                userId: userId
            }
        });
        console.log(feeling)
        console.log(new Date())

        res.json({
            data: {
                category: category,
                category2: category2
            }
        });
        console.log(category, category2)

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to save feeling",
            error: error.message
        });
    }
});

/**
 * POST /account/friends
 * Add a friend connection
 * @param {Object} req.body
 * @param {string} req.body.userId - User's slack ID
 * @param {string} req.body.friendId - Friend's slack ID
 * @param {string} req.body.key - Authentication key
 * @returns {Object} Confirmation message
 */
app.post('/account/friends', async (req, res) => {
    const { userId, friendId, key } = req.body
    const userKey = await prisma.user.findFirst({
        where: {
            slackId: userId,
            key: key
        }
    })

    if (!userKey) {
        res.status(401).send("Unauthorized")
        return
    }

    const addFriend = await prisma.friend.create({
        data: {
            userId: userId,
            friendId: friendId
        }
    })

    res.json({
        data: {
            message: `Friend added: ${friendId}`
        }
    })
})

/**
 * GET /account/friends/:userId/:keyword
 * Get a user's friends
 * @param {string} userId - User's slack ID
 * @param {string} keyword - Authentication key
 * @returns {Object} List of friends
 */
app.get('/account/friends/:userId/:keyword', async (req, res) => {
    const userId = req.params.userId
    const keyword = req.params.keyword
    const userKey = await prisma.user.findFirst({
        where: {
            slackId: userId,
            key: keyword
        }
    })

    if (!userKey) {
        res.status(401).send("Unauthorized")
        return
    }

    const friends = await prisma.friend.findMany({
        where: {
            userId: userId
        }
    })

    res.json({
        data: friends
    })
})

/**
 * GET /feelings/friends/:userId/:keyword
 * Get feelings shared by friends
 * @param {string} userId - User's slack ID
 * @param {string} keyword - Authentication key
 * @returns {Object} List of feelings shared by friends
*/

app.get('/feelings/friends/:userId/:keyword', async (req, res) => {
    const userId = req.params.userId
    const keyword = req.params.keyword

    const userKey = await prisma.user.findFirst({
        where: {
            slackId: userId,
            key: keyword
        }
    })

    if (!userKey) {
        res.status(401).send("Unauthorized")
        return
    }

    const friends = await prisma.friend.findMany({
        where: {
            userId: userId
        }
    })
   
    // AI wrote this part
    const friendsFeelings = await Promise.all(
        friends.map(friend => 
            prisma.feelings.findMany({
                where: {
                    userId: friend.friendId,
                    share: true
                }
            })
        )
    )


    // Flatten the array of arrays into a single array of feelings
    const allFriendsFeelings = friendsFeelings.flat()

    // Group feelings by user ID
    const groupedFeelings = allFriendsFeelings.reduce((groups, feeling) => {
        if (!groups[feeling.userId]) {
            groups[feeling.userId] = [];
        }
        groups[feeling.userId].push(feeling);
        return groups;
    }, {});


    return res.json({
        data: groupedFeelings
    });
  
})


app.listen(port, () => console.log(`Example app listening on port ${port}! http://localhost:${port}/`));