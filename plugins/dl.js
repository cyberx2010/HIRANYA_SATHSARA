const {cmd , commands} = require('../lib/command');
const axios = require("axios");
const {fetchJson} = require('../lib/functions');

const apikey = `sadiya`;

cmd({
    pattern: "fb",
    alias: ['facebook'],
    react: "🎬",
    desc: "Downlord Fb Video.",
    use: ".fb <fb url>",
    category: "download",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if(!q) return reply("Please give me fb url");

const fb = await fetchJson(`https://sadiya-tech-apis.vercel.app/download/fbdl?url=${q}&apikey=sadiya`);
let fbmsg = `*🧚‍♂️ HIRAN-MD FB DL 🍁*

*Title* - ${fb.result.title}`;

await conn.sendMessage(from, { image: {url: fb.result.thumb }, caption: fbmsg }, { quoted: mek });

await conn.sendMessage(from, { video: { url: fb.result.sd }, mimetype: "video/mp4", caption: `SD\n\n> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*` }, { quoted: mek });
await conn.sendMessage(from, { video: { url: fb.result.hd }, mimetype: "video/mp4", caption: `HD\n\n> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*` }, { quoted: mek });

}catch(e){
console.log(e)
reply(e)
}
})

//============ringtone DL==================

cmd({
    pattern: "ringtone",
    alias: ["ringtones", "ring"],
    desc: "Get a random ringtone from the API.",
    react: "🎵",
    category: "download",
    use: ".ringtone Query",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("Please provide a search query! Example: .ringtone Suna");
        }

        const { data } = await axios.get(`https://www.dark-yasiya-api.site/download/ringtone?text=${encodeURIComponent(query)}`);

        if (!data.status || !data.result || data.result.length === 0) {
            return reply("No ringtones found for your query. Please try a different keyword.");
        }

        const randomRingtone = data.result[Math.floor(Math.random() * data.result.length)];

        await conn.sendMessage(
            from,
            {
                audio: { url: randomRingtone.dl_link },
                mimetype: "audio/mpeg",
                fileName: `${randomRingtone.title}.mp3`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Error in ringtone command:", error);
        reply("Sorry, something went wrong while fetching the ringtone. Please try again later.");
    }
});


cmd({
    pattern: "tt",
    react: "▶",
    desc: "Download tiktok Video.",
    category: "download",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if(!q) return reply("Please give me tiktok url");

const ttdl = await fetchJson(`https://sadiya-tech-apis.vercel.app/download/tiktokdl?url=${q}&apikey=sadiya`);
let ttmsg = `*🎥 HIRAN-MD TIK TOK DL 🎥*

*Title* - ${ttdl.result.title}
*caption* - ${ttdl.result.caption}`;

await conn.sendMessage(from, { image: {url: ttdl.result.thumbnail }, caption: ttmsg }, { quoted: mek });

await conn.sendMessage(from, { video: { url: ttdl.result.nowm }, mimetype: "video/mp4", caption: `NOWM\n\n> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*` }, { quoted: mek });
await conn.sendMessage(from, { audio: { url: ttdl.result.music }, mimetype: "audio/mpeg" }, { quoted: mek });

}catch(e){
console.log(e)
reply(e)
}
})
