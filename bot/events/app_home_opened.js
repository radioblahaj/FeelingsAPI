const getAllFeelings = require("../utils/getAllFeelings");

module.exports = async function appHomeOpened({ event, client, body, say, logger }) {
  try {
    const feelings = await getAllFeelings(event.user);
    console.log("User:", event.user);
    let blocks = [];
    let emoji;


    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Welcome home, <@${event.user}> :house:*`
      }
    });

    feelings.forEach((feelingItem, key) => {
      emoji = getCategory(feelingItem, emoji);
      
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${emoji} Feeling ${key}:* ${feelingItem.feeling}`
        }
      });
    });
    
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Time ${key}:* ${feelingItem.date}`
      }
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
        emoji = "💛";
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
