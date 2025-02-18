
const fs = require("fs");
const path = require("path");

const eventsDir = path.resolve(__dirname, "./events");
// Dynamically import and handle events
module.exports = async function handleEvent({ event, client, body, say }) {
  try {
    const eventName = event.type;
    const eventFile = path.join(eventsDir, `${eventName}.js`);

    if (fs.existsSync(eventFile)) {
      const { default: eventHandler } = await import(`./events/${eventName}.js`);
      await eventHandler({ event, client, body, say });
    } else {
      console.warn(`No handler found for event: ${eventName}`);
    }
  } catch (error) {
    console.error(`Error handling event ${event.type}:`, error);
  }
}