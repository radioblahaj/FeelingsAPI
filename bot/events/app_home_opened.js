const getAllFeelings = require("../utils/getAllFeelings");
const getAccountStats = require("../utils/getAccountStats");

module.exports = async function appHomeOpened({ event, client, body, say, logger }) {
  try {
    let blocks = [];
    let emoji;

    const { friendCount, friends, totalFeelings, categoryCount, status } = await getAccountStats(event.user)
    await getAllFeelings(event.user);
    console.log("app home opened", status)
    console.log(status)
    if (!status) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Welcome! <@${event.user}> :D :house:*`
        }
      });

      const result = await client.views.publish({
        user_id: event.user,
        view: {
          type: "home",
          blocks: blocks
        }
      });
      return 
    }

    console.log("User:");
  

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

    






    const result = await client.views.publish({
      user_id: event.user,
      view: {
        type: "home",
        blocks: blocks
      }
    });

    

    logger.info("View published:", result);
  } catch (error) {
    logger.error("Error handling appHomeOpened event:", error);
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
};
