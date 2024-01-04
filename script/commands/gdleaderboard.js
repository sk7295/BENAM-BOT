
const axios = require('axios');

module.exports.config = {
  name: "gdleaderboard",
  hasPermission: 0,
  credits: "Jonell Magallanes", 
  description: "Get the Geometry Dash leaderboard",
  commandCategory: "game",
  usages: "gdleaderboard",
  cooldowns: 10,
};

  module.exports.run = async function ({ api, event }) {
    try {
      const response = await axios.get(`https://gdbrowser.com/api/leaderboard?count=10`);
      const leaderboardData = response.data;
      const message = leaderboardData.map((player, index) => {
        return `Rank ${index + 1} - Username: ${player.username}, Stars: ${player.stars}, Diamonds: ${player.diamonds}, Coins: ${player.coins}`;
      }).join('\n\n');

      api.sendMessage(`📊 GEOMETRY DASH LEADERBOARD\n\n${message}`, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage("🔭 | Error fetching leaderboard information. Please try again later.", event.threadID);
    }
  };
