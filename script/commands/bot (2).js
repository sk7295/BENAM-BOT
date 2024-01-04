const axios = require('axios');

module.exports.config = {
  name: "bot",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Jonell Magallanes", // Credits for the API KENLIEPLAYS
  description: "chat with bot",//powered by simini command
  commandCategory: "chat",
  usages: "bot [your message]",
  cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
  const message = args.join(" ") || "hi"; api.setMessageReaction("✅", event.messageID, () => { }, true);
  if (!args[0]) return api.sendMessage("Please input your message", event.threadID, event.messageID); api.setMessageReaction("🗨️", event.messageID, () => { }, true);

  const apiUrl = `https://simsimi.fun/api/v2/?mode=talk&lang=en&message=${encodeURIComponent(message)}&filter=true`;

  try {
    const response = await axios.get(apiUrl);
    if (response.data.success) {
      api.sendMessage(response.data.success, event.threadID, event.messageID); api.setMessageReaction("❤️", event.messageID, () => { }, true);
    } else {
      api.sendMessage("Unable to get a response from the bot.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error('Error making API Call:', error);
    api.sendMessage('An error occurred while talking to the bot.', event.threadID, event.messageID); api.setMessageReaction("😥", event.messageID, () => { }, true);


  }
};