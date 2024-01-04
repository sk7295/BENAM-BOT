const axios = require('axios');
const fs = require('fs');

module.exports.config = {
  name: "tikstalk",
  hasPermission: 0,
  Credits: "Jonell Magallanes",
  Description: "Get information about a TikTok user", 
  commandCategory: "social",
  usages: "tikstalk [username]",
  cooldowns: 10
};

  module.exports.run = async function ({ args, api, event }) {
    const username = args.join(" ");

    try {
      const response = await axios.get(`https://api-12.diciper09.repl.co/tiktok/infov2?username=${username}`);
      const userData = response.data;

      const imageUrl = userData.avatarLarger;
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const destPath = `./cache/tikstalk.jpeg`;
      fs.writeFileSync(destPath, imageResponse.data);

      const message = `Tiktok Profile User:\n\nName: ${userData.username}\n\nFollowers: ${userData.followerCount}\n\nFollowing: ${userData.followingCount}\n\nLikes: ${userData.heartCount}\n\nUsername: ${userData.nickname}\n\nBio: ${userData.signature}\n\nVerify: ${userData.verified ? "Verified" : "Not Verified"}\n\nPrivate: ${userData.privateAccount}`;
      const attachment = fs.createReadStream(destPath);

      const threadID = event.threadID;

      if (threadID) {
        api.sendMessage({ body: message, attachment }, event.threadID, (err) => {
          if (err) console.error(err);
          else {
            console.log(`Sent message with attachment for ${username}`);
            fs.unlink(destPath, (err) => {
              if (err) console.error(err);
              else console.log(`Deleted file "tikstalk.jpeg"`);
            });
          }
        });
      } else {
        console.error("ThreadID is undefined or null.");
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("🔭 | Error fetching TikTok user information.", event.threadID);
    }
  };