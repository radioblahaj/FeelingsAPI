async function updateView(type, userId, viewid, client, blocks) {
    const result = await client.views.update({
        user_id: userId,
        view_id: viewid,
        view: {
            type: type,
            blocks: blocks
        },
    });
}
module.exports = updateView;