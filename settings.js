const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {

SESSION_ID: process.env.SESSION_ID === undefined ? '𝙷𝙸𝚁𝙰𝙽-𝙼𝙳=68hDzZTQ#Q7d5ynTk06-hoS0OgzPFa3fgJgPJNUxgfUfJrfz-qaY' : process.env.SESSION_ID,
GITHUB_AUTH_TOKEN: process.env.GITHUB_AUTH_TOKEN === undefined ? '9vTGprGCy75LVTdeiIYZDsvT0u7yIy0WRx7F' : process.env.GITHUB_AUTH_TOKEN,
GITHUB_USER_NAME: process.env.GITHUB_USER_NAME === undefined ? 'cyberx2010' : process.env.GITHUB_USER_NAME,
    
DELETEMSGSENDTO : process.env.DELETEMSGSENDTO === undefined ? '94768698018' : process.env.DELETEMSGSENDTO,
POSTGRESQL_URL: process.env.POSTGRESQL_URL === undefined ? 'postgresql://sadiya:MTCV3kmoO4YSt6bcK8naY9WCRRO7wL2v@dpg-d07n7k2li9vc73ff97bg-a/sula_md_db' : process.env.POSTGRESQL_URL,
JID: process.env.JID ||  '120363401446603948@newsletter',
AUTO_VOICE: process.env.AUTO_VOICE === undefined ? "false" : process.env.AUTO_VOICE,
AUTO_REPLY: process.env.AUTO_REPLY === undefined ? "false" : process.env.AUTO_REPLY,
AUTO_STICKER: process.env.AUTO_STICKER === undefined ? "false" : process.env.AUTO_STICKER,
NEWS_SEND_JID: process.env.NEWS_SEND_JID === undefined ? "120363401446603948@newsletter" : process.env.NEWS_SEND_JID,
AUTO_NEWS_SENDER: process.env.AUTO_NEWS_SENDER === undefined ? "false" : process.env.AUTO_NEWS_SENDER,
TIKTOK_SEND_JID: process.env.TIKTOK_SEND_JID === undefined ? "120363401446603948@newsletter" : process.env.TIKTOK_SEND_JID,
AUTO_TIKTOK_SENDER: process.env.AUTO_TIKTOK_SENDER === undefined ? "false" : process.env.AUTO_TIKTOK_SENDER,
};
