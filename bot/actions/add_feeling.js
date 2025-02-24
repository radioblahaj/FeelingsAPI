module.exports = async function addFriend({ event, client, body, say, logger, ack}) {
    await client.chat.postMessage({
            channel: "C074L3A4C3E",
            text: `test`
        });

        try {
            // Use client.views.open to trigger your modal view, passing trigger_id and view payload
            const result = await client.views.open({
                trigger_id: body.trigger_id,
                view: {
                    type: 'modal',
                    callback_id: 'add_friend',
                    title: {
                        type: 'plain_text',
                        text: 'Add a Friend!'
                    },
                    blocks: [
                        {
                            type: "input",
                            element: {
                                type: "multi_users_select",
                                placeholder: {
                                    type: "plain_text",
                                    text: "Select users",
                                    emoji: true
                                },
                                action_id: "multi_users_select-action"
                            },
                            label: {
                                type: "plain_text",
                                text: "Friend Username",
                                emoji: true
                            }
                        },
                        {
                            type: "actions",
                            elements: [
                                {
                                    type: "button",
                                    text: {
                                        type: "plain_text",
                                        text: "Add Friend",
                                        emoji: true
                                    },
                                    value: "click_me_123",
                                    action_id: "next_step_friend"
                                }
                            ]
                        }
                    ],
                    submit: {
                        type: 'plain_text',
                        text: 'Submit'
                    }
                }
            });
            logger.info("Modal opened: " + result);
        } catch (error) {
            logger.error("Error opening modal: \n" + error);
        }
    await ack()

}