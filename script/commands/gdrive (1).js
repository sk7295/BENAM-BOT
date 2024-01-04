const fs = require('fs');
const request = require('request');
const { google } = require('googleapis');
const mime = require('mime-types');
const PATH = require('path');

module.exports.config = {
  name: 'gdrive',
  version: '1.0.1',
  hasPermission: 0,
  credits: 'Jonell Magallanes',
  description: 'Download file from Google Drive and send to the chat',
  commandCategory: 'No Prefix',
  usages: '[Google Drive link]',
  cooldowns: 5,
  apiKey: 'AIzaSyCYUPzrExoT9f9TsNj7Jqks1ZDJqqthuiI', // Your api key
};

module.exports.handleEvent = async function({ api, event, client, __GLOBAL }) {
  const { threadID, body, messageID } = event;

  
  if (!module.exports.config.apiKey) {
    console.error('No Google Drive API key provided in the module config.');
    return;
  }
  
  const drive = google.drive({ version: 'v3', auth: module.exports.config.apiKey });

  // Regex pattern to detect Google Drive links in messages
  const gdriveLinkPattern = /(?:https?:\/\/)?(?:drive\.google\.com\/(?:folderview\?id=|file\/d\/|open\?id=))([\w-]{33}|\w{19})(&usp=sharing)?/gi;
  let match;
  while ((match = gdriveLinkPattern.exec(body)) !== null) {
    // Extract fileId from Google Drive link
    const fileId = match[1];

    try {
      const res = await drive.files.get({ fileId: fileId, fields: 'name, mimeType' });
      const fileName = res.data.name;
      const mimeType = res.data.mimeType;

      const extension = mime.extension(mimeType);
      const destFilename = `${fileName}${extension ? '.' + extension : ''}`;
      const destPath = PATH.join(__dirname, destFilename);

      console.log(`Downloading file "${fileName}"...`); api.setMessageReaction("⤵️", event.messageID, () => { }, true);

      
      const dest = fs.createWriteStream(destPath);
      let progress = 0;

      const resMedia = await drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' }
      );

      resMedia.data
        .on('end', () => {
          console.log(`Downloaded file "${fileName}"`);
          
          api.sendMessage({ body: `==AUTO DOWN GOOGLE DRIVE==\n\nFileName: ${fileName}`, attachment: fs.createReadStream(destPath) }, threadID, () => {
            
            fs.unlink(destPath, (err) => {
              if (err) console.error(err);
              else console.log(`Deleted file "${fileName}"`);
            });
          });
        })
        .on('error', err => {
          console.error('Error downloading file:', err);
        })
        .on('data', d => {
          progress += d.length;
          process.stdout.write(`Downloaded ${progress} bytes\r`); api.setMessageReaction("✅", event.messageID, () => { }, true);
        })
        .pipe(dest);
    } catch (err) {
      console.error('The API returned an error: ', err);
    }
  }
};

module.exports.run = function({ api, event }) { api.sendMessage("This command gdrive is functionality when detected google drive and to download it the bot", event.threadID, event.messageID); };