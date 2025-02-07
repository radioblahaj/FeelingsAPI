/**
 * @fileoverview Express server for feelings tracking application
 * 
 * API Endpoints:
 * GET /feelings/:userId/:keyword - Get feelings for a user, filtered by query params
 * POST /account - Create a new user account
 * POST /feelings - Create a new feeling entry
 * POST /feelings/friends - Add a friend connection
 * GET /feelings/friends/:userId - Get a user's friends
 */

const express = require("express");
const app = express();
const port = 3000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const feelingsCategories = require("./feelingsCategories.js")


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

/**
 * GET /feelings/:userId/:keyword
 * Get feelings for a user, with optional query param filters
 * @param {string} userId - The user's slack ID
 * @param {string} keyword - Authentication key
 * @returns {Object} Filtered feelings data
 */
app.get('/feelings/:userId/:keyword', async(req, res, next) => {
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
 * POST /account
 * Create a new user account
 * @param {Object} req.body
 * @param {string} req.body.userId - User's slack ID
 * @param {string} req.body.key - Authentication key
 * @returns {string} Confirmation message
 */

app.post('/account', async (req, res) => {
    const {userId, key} = req.body
    const user = await prisma.user.create({
        data: {
            slackId: userId,
            key: key
        }
    })
    console.log(`Account created for ${userId}`)
   res.send(`Account created for ${userId}`)
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

    const {feeling1, feeling2, note, share, userId, keyword } = newFeeling
    
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
 * POST /feelings/friends
 * Add a friend connection
 * @param {Object} req.body
 * @param {string} req.body.userId - User's slack ID
 * @param {string} req.body.friendId - Friend's slack ID
 * @param {string} req.body.key - Authentication key
 */
app.post('/feelings/friends', async (req, res) => {
const {userId, friendId, key} = req.body
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
})

/**
 * GET /feelings/friends/:userId
 * Get a user's friends
 * @param {string} userId - User's slack ID
 * @returns {Object} List of friends
 */
app.get('/feelings/friends/:userId', async (req, res) => {
    const userId = req.params.userId
    const userKey = await prisma.user.findFirst({
        where: {
            slackId: userId,
            key: key
        }
    })
    
    if (!userKey) {
        res.status(401).send("Unauthorized")
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



app.listen(port, () => console.log(`Example app listening on port ${port}! http://localhost:${port}/`));