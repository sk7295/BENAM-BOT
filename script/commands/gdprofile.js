const axios = require('axios');

module.exports.config = {
  name: "gdprofile",
version: "1",
  hasPermission: 0,
  credits: "Jonell Magallanes", 
  Description: "Get information about a Geometry Dash player",
  commandCategory: "game",
  usages: "gdprofile [username]",
  cooldowns: 10
};

  module.exports.run = async function ({ api, event, args }) {
    const username = args.join(" ");

    try {
      const response = await axios.get(`https://gdbrowser.com/api/profile/${username}`);
      const playerInfo = response.data;

      const message = `GEOMETRY DASH PROFILE USER\n\nUsername: ${playerInfo.username}\n\nStars: ${playerInfo.stars}\n\nDiamonds: ${playerInfo.diamonds}\n\nCoins: ${playerInfo.coins}\n\nUser Coins: ${playerInfo.userCoins}\n\nMoons: ${playerInfo.moons}\n\nuserID: ${playerInfo.accountID}\n\nRank: ${playerInfo.rank}\n\nFriendRequest: ${playerInfo.friendRequests}\n\nMessages: ${playerInfo.messages}`;

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage("🔭 | Error fetching player information. Please check the username and try again.", event.threadID);
    }
  };