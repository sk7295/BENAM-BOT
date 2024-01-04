const axios = require('axios');

module.exports.config = {
    name: "presetsearch",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Jonell Magallanes",
    description: "Search API endpoints via market command",
    commandCategory: "Market",
    cooldowns: 5,
    dependencies: {
        "axios": "^0.24.0" // Specify the required version of axios
    }
};

module.exports.run = async ({ api, event, args }) => {
    const query = args.join(" ");
    if (!query) return api.sendMessage("Please provide search keywords.", event.threadID);

    // Make the endpoint URL configurable or use environment variables
    const apiUrl = `https://api-preset-collaborative-editors.hutchin.repl.co/market?search=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(apiUrl);
        const searchResults = response.data;

        if (searchResults.length === 0) {
            return api.sendMessage("No results found for your search.", event.threadID);
        }

        let message = '🎟️ PRESETS SEARCH FROM COLLABORATIVE EDITORS\n\n';
        searchResults.forEach((result, index) => {

            message += `${index + 1}: Name of Preset: ${result.name}\n\nCredits: ${result.description}\n\nPreset Link: ${result.link}\n\nTiktok Link Video: ${result.ApiOwner}\n\n==============================\n\n`;
        });

        api.sendMessage(`${message}\n`, event.threadID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while trying to search the market.", event.threadID);
    }
};