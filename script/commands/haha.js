const fs = require("fs");
module.exports.config = {
	name: "haha",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "Jonell Magallanes", 
	description: "minus one k kung nag mura ka😾",
	commandCategory: "No command marks needed",
	usages: "...",
    cooldowns: 1, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("tangina")==0 || (event.body.indexOf("taena")==0 || (event.body.indexOf("Tangina")==0 || (event.body.indexOf("Taena")==0)))) {
    const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Manila").format("HH:mm:ss || D/MM/YYYY");
		var msg = {
				body: `Ehhh bawal nga mag mura dito ehh... isumbong kita sa admin😾`
			}
			api.sendMessage(msg, threadID, messageID);
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

      }