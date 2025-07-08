const axios = require("axios");
const cheerio = require('cheerio');
const { cmd, commands } = require('../lib/command');
const config = require('../settings');
const { fetchJson } = require('../lib/functions');

const searchApi = `https://darksadas-yt-cinezub-search.vercel.app`;
const movieApi = `https://cinesubz-api-zazie.vercel.app`;
const downloadApi = `https://cinesub-info.vercel.app`;

var desc = '';
if (config.LANG === 'SI') desc = "Cinesubz වෙතින් වීඩියෝ චාගත කරයි.";
else desc = "Download videos from Cinesubz.";

var imgmsg = '';
if (config.LANG === 'SI') imgmsg = "*🚩 කරුණාකර වචන කිහිපයක් ලියන්න*";
else imgmsg = "*🚩 Please give me a text*";

var urlneed = '';
if (config.LANG === 'SI') urlneed = "*🚩 කරුණාකර Cinesubz url එකක් ලබා දෙන්න*";
else urlneed = "*🚩 Please give me a Cinesubz url*";

var N_FOUND = '';
if (config.LANG === 'SI') N_FOUND = "*මට කිසිවක් සොයාගත නොහැකි විය :(*";
else N_FOUND = "*I couldn't find anything :(*";

cmd({
  pattern: "cinesubz",
  alias: ["csub"],
  react: "🎬",
  desc: desc,
  category: "movie",
  use: ".cinesubz bad newz",
  filename: __filename
},
async (conn, mek, m, { from, q, prefix }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: imgmsg }, { quoted: mek });

    const res = await fetchJson(`${searchApi}/?query=${encodeURIComponent(q)}`);

    if (!res.data || res.data.length === 0) {
      return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });
    }

    const buttons = res.data.slice(0, 10).map((item, i) => ({
      buttonId: `${prefix}cine_search ${item.link}`,
      buttonText: { displayText: `${item.title} (${item.year})` },
      type: 1
    }));

    const buttonMessage = {
      image: { url: config.LOGO || "https://files.catbox.moe/lmyrtr.jpeg" },
      caption: `*_🔎 𝗖𝗶𝗻𝗲𝘀𝘂𝗯𝘇 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀_*\n\n\`Input:\` ${q}`,
      footer: config.FOOTER || "> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*",
      buttons: buttons,
      headerType: 4
    };

    await conn.buttonMessage2(from, buttonMessage, mek);
  } catch (e) {
    await conn.sendMessage(from, { text: '*Error*' }, { quoted: mek });
    console.error(e);
  }
});

cmd({
  pattern: "cine_search",
  react: "🔎",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, prefix, quoted }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    let cine = await fetchJson(`${movieApi}/api/movie?url=${encodeURIComponent(q)}`);
    if (!cine.result?.data) return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });

    let data = cine.result.data;

    const image = data.image || data.thumbnail || (config.LOGO || "https://files.catbox.moe/lmyrtr.jpeg");

    const caption = `☘️ *\`𝗧ɪᴛʟᴇ\`* : ${data.title}\n
📅 *\`𝗥ᴇʟᴇᴀꜱᴇᴅ ᴅᴀᴛᴇ\`* : ${data.date || 'N/A'}
🌍 *\`𝗖ᴏᴜɴᴛʀʏ\`* : ${data.country || 'N/A'}
⏳ *\`𝗗ᴜʀᴀᴛɪᴏɴ\`* : ${data.duration || 'N/A'}
🌟 *\`𝗥ᴀᴛɪɴɢ\`* : ${data.imdbRate || 'N/A'}
🎭 *\`𝗚ᴇɴʀᴇꜱ\`* : ${data.category?.join(', ') || 'N/A'}
🪄️ *\`𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ\`* : ${data.subtitle_author?.split('\n')[0] || 'Cinesubz'}`;

    const sections = [
      {
        title: "Download Links ⬇️",
        rows: data.dl_links?.map(dl => ({
          title: `${dl.quality} (${dl.size || 'N/A'})`,
          rowId: `${prefix}cinedl ${q}||${data.title}||${dl.quality}`
        })) || []
      },
      {
        title: "Get Details Card",
        rows: [{ title: "View Details", rowId: `${prefix}cine_details ${q}||${data.title}` }]
      }
    ];

    await conn.listMessage2(from, {
      image: { url: image },
      caption,
      footer: config.FOOTER || "> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*",
      title: "",
      buttonText: "`Reply Below Number` 🔢",
      sections,
    }, mek);
  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { text: "❌ Error occurred while fetching data." }, { quoted: mek });
  }
});

cmd({
  pattern: "cine_details",
  react: "☑️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    const [url, title] = q.split("||");
    if (!url || !title) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    let cine = await fetchJson(`${movieApi}/api/movie?url=${encodeURIComponent(url)}`);
    if (!cine.result?.data) return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });

    let data = cine.result.data;
    const image = data.image || data.thumbnail || (config.LOGO || "https://files.catbox.moe/lmyrtr.jpeg");

    const caption = `☘️ *\`𝗧ɪᴛʟᴇ\`* : ${data.title}\n
📅 *\`𝗥ᴇʟᴇᴀꜱᴇᴅ ᴅᴀᴛᴇ\`* : ${data.date || 'N/A'}
🌍 *\`𝗖ᴏᴜɴᴛʀʏ\`* : ${data.country || 'N/A'}
⏳ *\`𝗗ᴜʀᴀᴛɪᴏɴ\`* : ${data.duration || 'N/A'}
🌟 *\`𝗥ᴀᴛɪɴɢ\`* : ${data.imdbRate || 'N/A'}
🗳️ *\`𝗖ɪɴᴇꜱᴜʙᴢ ᴠᴏᴛᴇꜱ\`* : ${data.cineVoteCount || 'N/A'}
🎭 *\`𝗚ᴇɴʀᴇꜱ\`* : ${data.category?.join(', ') || 'N/A'}
🪄️ *\`𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ\`* : ${data.subtitle_author?.split('\n')[0] || 'Cinesubz'}
🎬 *\`𝗗ɪʀᴇᴄᴛᴏʀ\`* : ${data.director || 'N/A'}
📎 *\`𝗨ʀʟ\`* : ${q}

*➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟*

*𝙹𝙾𝙸𝙽 𝚄𝚂 ➟* https://chat.whatsapp.com/Jw9JYWEst4p08aDPyXHfJ6

*➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟*\n\n${config.FOOTER || "> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*"}`;

    const targetJID = config.MV_JID || from;
    await conn.sendMessage(targetJID, {
      image: { url: image },
      caption,
      footer: config.FOOTER || "> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*"
    }, { quoted: mek });
  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { text: "❌ Error occurred while fetching details." }, { quoted: mek });
  }
});

cmd({
  pattern: "cinedl",
  react: "⬇️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, quoted }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    const [url, title, quality] = q.split("||");
    const safeTitle = title?.replace(/[^\w\s\-]/gi, '') || "Movie";

    let linkData = await fetchJson(`${downloadApi}/?url=${encodeURIComponent(url)}&apikey=dinithimegana`);
    if (!linkData.result?.data?.dl_links) return await conn.sendMessage(from, { text: "❌ No download links found." }, { quoted: mek });

    const downloadLink = linkData.result.data.dl_links.find(dl => dl.quality === quality)?.link;
    if (!downloadLink) return await conn.sendMessage(from, { text: "❌ Download link for the specified quality not found." }, { quoted: mek });

    const message = {
      document: { url: downloadLink },
      mimetype: "video/mp4",
      fileName: `${safeTitle} - 𝙷𝙸𝚁𝙰𝙽-𝙼𝙳 𝙼𝙾𝚅𝙸𝙴 𝙳𝙻.mp4`,
      caption: `[ *Quality:* \`${quality}\` ]\n\n${config.MV_FOOTER || "> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*"}`,
      thumbnail: { url: config.LOGO || "https://files.catbox.moe/lmyrtr.jpeg" }
    };

    const targetJID = config.MV_JID || from;
    await conn.sendMessage(targetJID, message, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✔", key: mek.key } });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { text: "❌ Failed to send the video." }, { quoted: mek });
  }
});
