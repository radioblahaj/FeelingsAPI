const express = require("express");
const app = express();
const port = 3000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());

const feelingsCategories = [
    {"feeling": "happy", category: "yellow"},
    {"feeling": "sad", category: "blue"},
    {"feeling": "angry", category: "red"},
    {"feeling": "anxious", category: "red"},
    {"feeling": "excited", category: "yellow"},
    {"feeling": "grateful", category: "yellow"},
    {"feeling": "content", category: "green"},
    {"feeling": "bored", category: "blue"},
    {"feeling": "tired", category: "blue"},
    {"feeling": "hungry", category: "red"},
    {"feeling": "sick", category: "red"},
    {"feeling": "nervous", category: "red"},
    {"feeling": "stressed", category: "red"},
    {"feeling": "anxious", category: "red"},
    {"feeling": "depressed", category: "blue"},
    {"feeling": "lonely", category: "blue"},
    {"feeling": "frustrated", category: "red"},
    {"feeling": "disappointed", category: "red"},
    {"feeling": "disconnected", category: "blue"},
]

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

app.get('/', (req, res) => 
     res.send('Hello World!'));

app.get('/feelings', async(req, res, next) => {
    const feelings = await prisma.feelings.findMany();    

    const data = feelings;
    const filters = req.query;
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



app.post('/feelings', async (req, res) => {
    const newFeeling = req.body;
    
console.log("Received new feeling:", newFeeling);

  if (!newFeeling.share) {
    newFeeling.share = false;
  }

  if (!newFeeling.feeling2) {
    newFeeling.feeling2 = null;
  }

  if (!newFeeling.note) {
    newFeeling.note = "";
  }


  const category = getCategory(newFeeling.feeling1);
  const category2 = getCategory(newFeeling.feeling2);

  
    try {
        const feeling = await prisma.feelings.create({
            data: {
                date: new Date(),
                feeling: newFeeling.feeling,
                note: newFeeling.note,
                feeling2: newFeeling.feeling2,
                share: newFeeling.share,
                category: category,
                category2: category2
            }
        });

        const categories = category
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

app.delete('/feelings/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const feeling = await prisma.feelings.delete({
        where: {
            id: id
        }
    });
    res.send("Deleted feeling at ID: " + req.params.id);
});

app.listen(port, () => console.log(`Example app listening on port ${port}! http://localhost:${port}/`));