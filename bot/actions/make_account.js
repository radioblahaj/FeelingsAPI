module.exports = async function makeAccount({ event, client, body, say, logger, ack }) {
    try {
        const getAllFeelings = require("../utils/getAllFeelings");
        const getAccountStats = require("../utils/getAccountStats");

        let blocks = [];
        let emoji;

        const { friendCount, friends, totalFeelings, categoryCount, status } = await getAccountStats(body.user.id)
       const feelings = await getAllFeelings(body.user.id);

        const makeAccount = await fetch("http://localhost:1234/account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: body.user.id,
                channel: "hi"
            })
        });


        let response = await makeAccount.json()

        blocks.push({
            type: "actions",
                  elements: [
                      {
                          type: "button",
                          text: {
                              type: "plain_text",
                              emoji: true,
                              text: "Add Feeling"
                          },
                          style: "primary",
                action_id: "add_feeling",
                          value: "click_me_123"
                      },
              {
                          type: "button",
                          text: {
                              type: "plain_text",
                              emoji: true,
                              text: "Add Friend"
                          },
                action_id: "add_friend",
                          value: "click_me_123"
                      },
                  ]
          });
      
          blocks.push({
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Account Details*\n*Total Feelings:* ${totalFeelings}\n💛Yellow Feelings:${categoryCount.get("yellow")} $4,289.70\nRemain: $13,710.30`
              },
              {
                type: "mrkdwn",
                text: "*Top Expense Categories*\n:airplane: Flights · 30%\n:taxi: Taxi / Uber / Lyft · 24% \n:knife_fork_plate: Client lunch / meetings · 18%"
              }
            ]
          })
      
          feelings.forEach((feelingItem, key) => {
            emoji = getCategory(feelingItem, emoji);
      
            blocks.push({
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*${emoji} Feeling ${key}:* ${feelingItem.feeling}`
              }
            });
      
            blocks.push({
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Time:* ${feelingItem.date}`
              }
            });
          });

        const result = await client.views.update({
            user_id: body.user.id,
            view_id: "V08FBCUNS00",
            view: {
                type: "home",
                blocks: blocks
            }
        });

    } catch (e) {
        console.log(e)
    }

    await ack()

}

function getCategory(feelingItem, emoji) {
    switch (feelingItem.category) {
      case 'yellow':
        emoji = "💛 hi";
        break;
      case 'blue':
        emoji = "💙";
        break;
      case 'green':
        emoji = "💚";
        break;
      case 'red':
        emoji = "🟥";
        break;
      default:
        emoji = "💜";
    }
    return emoji;
  }
