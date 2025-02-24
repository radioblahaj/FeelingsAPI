const getAllFeelings = require("../utils/getAllFeelings");
const getAccountStats = require("../utils/getAccountStats");
const publishBlocks = require("../utils/publish")

module.exports = async function appHomeOpened({ event, client, body, say, logger }) {
  try {
    let blocks = [];
    let emoji;
    console.log(body)

    const { friendCount, friends, totalFeelings, categoryCount, status } = await getAccountStats(event.user)
    const feelings = await getAllFeelings(event.user);
    console.log(__filename, "app home opened (line 13)")
    console.log(status)
    if (!status) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Welcome <@${event.user}>*, you don't have an account! You need to make one to use Blahaj DIY!`
        }
      });

      blocks.push({
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Make account"
            },
            style: "primary",
            action_id: "make_account",
            value: "click_me_123"
          },
        ]
      });

      
      publishBlocks("home", event.user, client, blocks)
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

    console.log(__dirname, "I just added the buttons")

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
    console.log(__dirname, "I just added the dashboard")

      console.log(feelings)
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
          text: `*Time!:* ${feelingItem.date}`
        }
      });
    });
    console.log(__dirname, "I just added the feelings")


    publishBlocks("home", event.user, client, blocks)
    console.log(__filename, "I published the view!")

    

    logger.info("View published");
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
