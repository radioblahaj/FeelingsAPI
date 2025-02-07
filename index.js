const express = require("express");
const app = express();
const port = 3000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const feelingsCategories = require("./feelingsCategories.js")


app.use(express.json());



function getCategory(feeling) {
    let category = ""
    let category2 = ""
    for (let i = 0; i < feelingsCategories.length; i++) {
        if (feeling === feelingsCategories[i].feeling) {
          category = feelingsCategories[i].category
        }
    }
    return category
  }

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

app.post('/account', async (req, res) => {
    const {userId, key} = req.body
    const user = await prisma.user.create({
        data: {
            slackId: userId,
            key: key
        }
    })
    console.log(`Account created for ${userId}`)
    console.log(user)
   res.send(`Account created for ${userId}`)
})


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

  if (!newFeeling.share) {
    share = false;
  }

  if (!newFeeling.feeling2) {
   feeling2 = null;
  }

  if (!newFeeling.note) {
    note = "";
}


  const category = getCategory(newFeeling.feeling1);
  const category2 = getCategory(newFeeling.feeling2);

  
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