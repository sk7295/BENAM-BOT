const axios = require('axios');
const fs = require('fs');

module.exports.config = {
  name: "hutchins",
  version: "1.0.0",
  hasPermission: 0,
  credits: "JV Barcenas & cyril, modified by Jonell MAGALLANES",
  description: "Chat with ChatGPT-4 or download a TikTok video via link",
  commandCategory: "general",
  cooldowns: 5,
};

module.exports.run = async function ({ api, args, event }) {
  const { threadID, messageID } = event;
  let messageText = event.body.trim();
  messageText = messageText.toLowerCase(); // Convert message text to lowercase
  const aiCommandRegex = /\?hutchins what is (.+)/i;
  const tikTokDownloadRegex = /\?hutchins can you download this link/i;
  const regEx_tiktok = /https:\/\/((vt)\.)?(tiktok)\.com\//;

  if (aiCommandRegex.test(messageText)) {
    const prompt = messageText.match(aiCommandRegex)[1].trim();
    if (!prompt) {
      api.sendMessage("Please provide a question to answer\n\nExample:\n?hutchins what is the solar system?", threadID, messageID);
      return;
    }

    await api.sendMessage("🔍 | Searching and Typing Your Answer! Please Wait....", threadID, messageID);

    try {
      const response = await axios.get(`https://chatgayfeyti.archashura.repl.co?gpt=${encodeURIComponent(prompt)}`);
      if (response.status === 200 && response.data && response.data.content) {
        await api.sendMessage(response.data.content.trim(), threadID, messageID);
      } else {
        throw new Error('Invalid or missing response from API');
      }
    } catch (error) {
      console.error(`Failed to get an answer: ${error.message}`);
      api.sendMessage(`${error.message}.\nAn error occurred fetching GPT API, please try again later.`, threadID);
    }
  } else if (tikTokDownloadRegex.test(messageText)) {
    const link = args.join(" ").match(regEx_tiktok)?.[0];
    if (!link) {
      return api.sendMessage('Please provide a valid TikTok video link.', threadID, messageID);
    }

    api.sendMessage("📫 | Noted. Downloading the TikTok video. Please wait...", threadID, messageID);

    try {
      const response = await axios.post('https://www.tikwm.com/api/', { url: link });
      const data = response.data.data;
      const videoStream = await axios.get(data.play, { responseType: 'stream' }).data;
      const fileName = `TikTok-${Date.now()}.mp4`;
      const filePath = `./${fileName}`;
      const videoFile = fs.createWriteStream(filePath);

      videoStream.pipe(videoFile);

      videoFile.on('finish', () => {
        videoFile.close(async () => {
          console.log('Downloaded video file.');
          await api.sendMessage({
            body: `==== Here's Your TikTok Video====\nTitle: ${data.title}\nLikes: ${data.digg_count}\nComments: ${data.comment_count}`,
            attachment: fs.createReadStream(filePath)
          }, threadID, () => {
            fs.unlinkSync(filePath); // Delete the video file after sending it
          });
        });
      });
    } catch (error) {
      api.sendMessage(`Error when trying to download the TikTok video: ${error.message}`, threadID, messageID);
    }
  } else {
    api.sendMessage("Sorry, I didn't understand that. You can ask me something or request a TikTok video download.", threadID, messageID);
  }
};