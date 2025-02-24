async function publishBlocks (type, userId, client, blocks) {
    const result = await client.views.publish({
        user_id: userId,
        view: {
          type: type,
          blocks: blocks
        }
      });
}
module.exports = publishBlocks;