const path = require("path");

async function handleAction({ event, client, body, say }) {
  try {
    const firstAction = body.actions[0];
    const actionId = firstAction.action_id;
    const blockId = firstAction.block_id;

    
    console.log("it's working")
    const block_id = body.block_id;
    const actionFile = path.resolve(__dirname, `${actionId}.js`);

    // Dynamically require event handlers
    const actionHandler = require(actionFile);
    if (actionHandler) {
      await actionHandler({ event, client, body, say });
    } else {
      console.warn(`No handler found for action: ${actionId}`);
    }
  } catch (error) {
    console.error(`Error handling action ${body.actions[0].action_id}:`, error);
  }
}

module.exports = handleAction;