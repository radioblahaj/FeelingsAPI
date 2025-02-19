async function addFriend(args) {
    // Correct the import - no destructuring here
    const { payload, client, logger, ack, body } = args;
    const { user_id, text, channel_id } = payload;

    const commands = text.split(" ");
    const friendId = commands[1];

    const errors = [];
    // if (!friendId) errors.push("You need to specify a friend to add.")

    if (errors.length > 0)
        return await client.chat.postEphemeral({ user: `${user_id}`, text: errors.join("\n") });
  
  
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
}

module.exports = addFriend;
