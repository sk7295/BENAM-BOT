const configCommand = {
    name: 'tikdl',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'modified by Jonell MAGALLANES',
    description: 'Download TikTok video via link',
    commandCategory: 'Tiktok',
    usages: '[link tiktok video]',
    cooldowns: 5
};

const axios = require('axios');
const fs = require('fs');
const https = require('https');

const reqStreamURL = async url => (await axios.get(url, {
    responseType: 'stream'
})).data;

async function runCommand({ api, event, args }) {
    const regEx_tiktok = /https:\/\/((vt)\.)?(tiktok)\.com\//;
    const link = args[0];
    if (!link || !regEx_tiktok.test(link)) {
        return api.sendMessage('Please provide a valid TikTok video link.', event.threadID, event.messageID);
    }
  
    try {
      api.sendMessage("📫 | Downloading The Video You Link Provided please wait...", event.threadID, event.messageID);
        const response = await axios.post(`https://www.tikwm.com/api/`, {
            url: link
        });

        const data = response.data.data;
        const videoStream = await reqStreamURL(data.play);
        const fileName = `TikTok-${Date.now()}.mp4`;
        const filePath = `./${fileName}`;
        const videoFile = fs.createWriteStream(filePath);
        
        videoStream.pipe(videoFile);
        
        videoFile.on('finish', () => {
            videoFile.close(() => {
                console.log('Downloaded video file.');
                api.sendMessage({
                    body: `\n\n==== Here's Your TikTok Video====\nTitle: ${data.title}\nLikes: ${data.digg_count}\nComments: ${data.comment_count}`,
                    attachment: fs.createReadStream(filePath)
                }, event.threadID, () => {
                    fs.unlinkSync(filePath); // Delete the video file after sending it
                });
            });
        });
    } catch (error) {
        api.sendMessage(`Error when trying to download the TikTok video: ${error.message}`, event.threadID, event.messageID);
    }
}

module.exports = {
    config: configCommand,
    run: runCommand
};