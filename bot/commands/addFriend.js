async function addFriend(args) {
    const { payload, client, logger, ack, body } = args;
    const { user_id, text, channel_id } = payload;

    const commands = text.split(" ");
    const friendId = commands[1]
    

    const errors = []
    // if (!frienId) errors.push("You need to specify a friend to add.")

    if (errors.length > 0)
                return await client.chat.postEphemeral({  user: `${user_id}`, text: errors.join("\n") });
  

    try {
        // Call views.open with the built-in client
        const result = await client.views.open({
          // Pass a valid trigger_id within 3 seconds of receiving it
          trigger_id: body.trigger_id,
          // View payload
          view: {
            type: 'modal',
            // View identifier
            callback_id: 'view_1',
            title: {
              type: 'plain_text',
              text: 'Modal title'
            },
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Who are you?"
                        },
                        "accessory": {
                            "type": "users_select",
                            "placeholder": {
                                "type": "plain_text",
                                "text": "Who do you want to add?",
                                "emoji": true
                            },
                            "action_id": "users_select-action"
                        }
                    },
                    {
                        "type": "input",
                        "element": {
                            "type": "plain_text_input",
                            "action_id": "plain_text_input-action"
                        },
                        "label": {
                            "type": "plain_text",
                            "text": "What is your Key?",
                            "emoji": true
                        }
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Add Friend",
                                    "emoji": true
                                },
                                "value": "click_me_123",
                                "action_id": "add_friend"
                            }
                        ]
                    }
                ],
            submit: {
              type: 'plain_text',
              text: 'Submit',
            }
          }
        });
        logger.info("hi" + result);

        
      }

      catch (error) {
        logger.error("hi! \n" + error);
      }

    // try {
    //     const response = await fetch("https://api.blahaj.diy/account/friends", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             userId: user_id,
    //             key: key,
    //             friendId: friendId
    //         })
    //     });
    //         } catch (e) {
    //             console.log(e)
    //         }

        // await client.chat.postEphemeral({
        //     channel: channel_id,
        //     user: user_id,
        //     text: `<@${userToBan}> has been banned from all channels for ${reason}`,
        //     mrkdwn: true
        // });
   

}

module.exports = addFriend;
