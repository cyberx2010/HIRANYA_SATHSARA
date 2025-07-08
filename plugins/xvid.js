const axios = require("axios");
const cheerio = require('cheerio');
const { cmd, commands } = require('../lib/command')
const config = require('../settings');
const {fetchJson} = require('../lib/functions');

const api = `https://raganork-network.vercel.app`;

var desc =''
if(config.LANG === 'SI') desc = "Xvideo වෙතින් වීඩියෝ බාගත කරයි."
else desc = "Download videos from Xvideo."

var imgmsg =''
if(config.LANG === 'SI') imgmsg = "*🚩 කරුණාකර වචන කිහිපයක් ලියන්න*"
else imgmsg = "*🚩 Please give me a text*"

var urlneed =''
if(config.LANG === 'SI') urlneed = "*🚩 කරුණාකර Xvideo url එකක් ලබා දෙන්න*"
else urlneed = "*🚩 Please give me a Xvideo url*"

var N_FOUND =''
if(config.LANG === 'SI') N_FOUND = "*මට කිසිවක් සොයාගත නොහැකි විය :(*"
else N_FOUND = "*I couldn't find anything :(*"

cmd({
  pattern: "xvid",
  alias: ["xvideo"],
  use: ".xvid <query>",
  react: "🔞",
  desc: "Search videos from Xvideos (18+)",
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, q, reply, prefix }) => {
  try {
    if (!q) return reply(imgmsg);

    const res = await fetchJson(`${api}/api/xvideos/search?query=${encodeURIComponent(q)}`);

    if (!res.result || res.result.length === 0) {
      return reply(N_FOUND);
    }

    const results = res.result.slice(0, 10);

    const formatted = {
      provider: "raganork-network",
      result: results.map(video => ({
        title: video.title || "No Title",
        url: video.url || video.link || "No URL",
        duration: video.duration || "N/A"
      }))
    };


    const buttons = formatted.result.map((item, i) => ({
      buttonId: `.xvinfo ${item.url}`,
      buttonText: { displayText: `${item.title}` },
      type: 1
    }));

    const buttonMessage = {
      image: {url: config.LOGO}, 
      caption: `*🔞 Xvideos Search Results for:* _${q}_`,
      footer: "> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*",
      buttons,
      headerType: 4
    };

    await conn.buttonMessage2(from, buttonMessage, mek);

  } catch (err) {
    console.error(err);
    reply("*❌ Error occurred while searching.*");
  }
});

cmd({
    pattern: "xvinfo",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, prefix, quoted, reply }) => {
    try {
        if (!q) return reply(urlneed);

        let xv_info = await fetchJson(`https://www.dark-yasiya-api.site/download/xvideo?url=${q}`);
        if (!xv_info.result) return reply(N_FOUND);

        const msg = `*🍑 XVIDEO DOWNLOADER*
     
*┃* 📝 \`Title\` : ${xv_info.result.title}
*┃* 📈 \`Views\` : ${xv_info.result.views}
*┃* 👍 \`Like\` : ${xv_info.result.like}
*┃* 👎 \`Dislike\` : ${xv_info.result.deslike}
*┃* 🏷️ \`Size\` : ${xv_info.result.size}`;

      const buttons = [
      {
        buttonId: `${prefix}xvdl ${q}`,
        buttonText: { displayText: "▶️ Download Now" },
        type: 1
      }
    ];

    await conn.buttonMessage2(from, {
      image: { url: xv_info.result.image },
      caption: msg,
      footer: "> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*",
      buttons,
      headerType: 4
    }, mek);

    } catch (e) {
        reply('*ERROR*');
        console.log(e);
    }
});

cmd({
    pattern: "xvdl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, quoted, reply }) => {
    try {
        if (!q) return reply(urlneed);

        let xv_info = await fetchJson(`https://www.dark-yasiya-api.site/download/xvideo?url=${q}`);
        if (!xv_info.result) return reply(N_FOUND);

        await conn.sendMessage(from, {
            video: { url: xv_info.result.dl_link },
            caption: `*${xv_info.result.title}*\n\n> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*`,
        }, { quoted: mek });

    } catch (e) {
        reply('*ERROR*');
        console.log(e);
    }
});
