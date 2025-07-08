const axios = require("axios");
const cheerio = require('cheerio');
const { cmd, commands } = require('../lib/command');
const config = require('../settings');
const { fetchJson } = require('../lib/functions');

const api = `https://nethu-api-ashy.vercel.app`;

var desc = '';
if (config.LANG === 'SI') desc = "sinhalasub වෙතින් වීඩියෝ බාගත කරයි.";
else desc = "Download Movies from sinhalasub.";

var imgmsg = '';
if (config.LANG === 'SI') imgmsg = "*🚩 කරුණාකර වචන කිහිපයක් ලියන්න*";
else imgmsg = "*🚩 Please give me a text*";

var urlneed = '';
if (config.LANG === 'SI') urlneed = "*🚩 කරුණාකර sinhalasub url එකක් ලබා දෙන්න*";
else urlneed = "*🚩 Please give me a sinhalasub url*";

var N_FOUND = '';
if (config.LANG === 'SI') N_FOUND = "*මට කිසිවක් සොයාගත නොහැකි විය :(*";
else N_FOUND = "*I couldn't find anything :(*";

cmd({
  pattern: "sinhalasub",
  alias: ["ssub"],
  react: "🎬",
  desc: desc,
  category: "movie",
  use: ".sinhalasub 2024",
  filename: __filename
},
async (conn, mek, m, { from, q, prefix }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: imgmsg }, { quoted: mek });

    const res = await fetchJson(`${api}/movie/sinhalasub/search?text=${encodeURIComponent(q)}`);

    if (!res.result || res.result.data.length === 0) {
      return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });
    }

    const buttons = res.result.data.slice(0, 10).map((item, i) => ({
      buttonId: `${prefix}sub_search ${item.link}||${item.title}`,
      buttonText: { displayText: `${item.title}` },
      type: 1
    }));

    const buttonMessage = {
      image: { url: config.LOGO },
      caption: `_️🔎 𝗦𝗶𝗻𝗵𝗮𝗹𝗮𝘀𝘂𝗯 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀_\n\n\`Input :\` ${q}`,
      footer: config.FOOTER,
      buttons: buttons,
      headerType: 4
    };

    // Send search results only to the original chat
    return await conn.buttonMessage2(from, buttonMessage, mek);

  } catch (e) {
    await conn.sendMessage(from, { text: '*Error*' }, { quoted: mek });
    console.error(e);
  }
});

cmd({
  pattern: "sub_search",
  react: "🔎",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, prefix, quoted }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    const [url, title] = q.split("||");
    if (!url || !title) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    let sin = await fetchJson(`${api}/movie/sinhalasub/movie?url=${url}`);
    if (!sin.result?.data) return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });

    let data = sin.result.data;

    const movieTitle = title;
    const image = data.images.find(img => img.startsWith("https://sinhalasub.lk")) || data.images[0];

    const caption = `☘️ *\`𝗧ɪᴛʟᴇ\` : ${movieTitle}* \n
📅 *\`𝗥ᴇʟᴇᴀꜱᴇᴅ ᴅᴀᴛᴇ\` : ${data.date || 'N/A'}*
🌍 *\`𝗖ᴏᴜɴᴛʀʏ\` : ${data.country || 'N/A'}*
🌟 *\`𝗥ᴀᴛɪɴɢ\` : ${data.tmdbRate || 'N/A'}*
🏷️ *\`𝗖ᴀᴛᴇɢᴏʀɪᴇꜱ\` : ${data.category?.length ? data.category.join(', ') : 'N/A'}*
🪄️ *\`𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ\` : ${data.subtitle_author || 'N/A'}*`;

    const sections = [
      {
        title: "Download PixelDrain ⬇️",
        rows: data.pixeldrain_dl?.length ? data.pixeldrain_dl.map(dl => ({
          title: `${dl.quality} (${dl.size})`,
          rowId: `${prefix}subsdl ${dl.link}||${movieTitle}||${dl.quality}||${image}`
        })) : [{ title: "N/A", rowId: `${prefix}subsdl none||${movieTitle}||N/A||${image}` }]
      },
      {
        title: "Download DDL ⬇️",
        rows: data.ddl_dl?.length ? data.ddl_dl.map(dl => ({
          title: `${dl.quality} (${dl.size})`,
          rowId: `${prefix}subsdl ${dl.link}||${movieTitle}||${dl.quality}||${image}`
        })) : [{ title: "N/A", rowId: `${prefix}subsdl none||${movieTitle}||N/A||${image}` }]
      },
      {
        title: "Get the Movie Details",
        rows: [{
          title: "Get Details Card",
          rowId: `${prefix}sub_details ${url}||${movieTitle}`
        }]
      }
    ];

    // Send movie info card only to the original chat
    await conn.listMessage2(from, {
      image: { url: image },
      caption,
      footer: config.FOOTER,
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
  pattern: "sub_details",
  react: "☑️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    const [url, title] = q.split("||");
    if (!url || !title) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    let sin = await fetchJson(`${api}/movie/sinhalasub/movie?url=${url}`);
    if (!sin.result?.data) return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });

    let data = sin.result.data;

    const movieTitle = title;
    const image = data.images.find(img => img.startsWith("https://sinhalasub.lk")) || data.images[0];

    // Add "N/A" for unavailable details
    const caption = `☘️ *\`𝗧ɪᴛʟᴇ\` : ${movieTitle}* \n
📅 *\`𝗥ᴇʟᴇᴀꜱᴇᴅ ᴅᴀᴛᴇ\` : ${data.date || 'N/A'}*
🌍 *\`𝗖ᴏᴜɴᴛʀʏ\` : ${data.country || 'N/A'}*
🌟 *\`𝗥ᴀᴛɪɴɢ\` : ${data.tmdbRate || 'N/A'}*
🗳️ *\`𝗦ɪɴʜᴀʟᴀꜱᴜʙ ᴠᴏᴛᴇꜱ\` : ${data.sinhalasubVote || 'N/A'}*
🎭 *\`𝗗ɪʀᴇᴄᴛᴇᴅ ʙʏ\` : ${data.director || 'N/A'}*
🏷️ *\`𝗖ᴀᴛᴇɢᴏʀɪᴇꜱ\` : ${data.category?.length ? data.category.join(', ') : 'N/A'}*
🪄️ *\`𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ\` : ${data.subtitle_author || 'N/A'}*
📎 *\`𝗨ʀʟ\` : ${url}*

*➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟*

*𝙹𝙾𝙸𝙽 𝚄𝚂 ➟* https://chat.whatsapp.com/Jw9JYWEst4p08aDPyXHfJ6

*➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟* \n\n> *© 𝐏𝐨𝐰ᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*`;

    // Send to MV_JID if defined, else to original chat
    const targetJID = config.MV_JID || from;
    await conn.sendMessage(targetJID, {
      image: { url: image },
      caption,
      footer: config.FOOTER
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { text: "❌ Error occurred while fetching details." }, { quoted: mek });
  }
});

cmd({
  pattern: "subsdl",
  react: "⬇️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, quoted }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    const [link, title, quality, image] = q.split("||");
    if (link === "none") return await conn.sendMessage(from, { text: "❌ No download link available for this quality." }, { quoted: mek });

    const safeTitle = title?.replace(/[^\w\s\-]/gi, '') || "Movie";

    const message = {
      document: { url: link },
      mimetype: "video/mp4",
      fileName: `${safeTitle}- 𝙷𝙸𝚁𝙰𝙽-𝙼𝙳 𝙼𝙾𝚅𝙸𝙴 𝙳𝙻.mp4`,
      caption: `[ *Quality:* \`${quality}\` ]\n\n${config.MV_FOOTER}`,
      thumbnail: { url: image || config.LOGO } // Add movie poster as thumbnail
    };

    // Send to MV_JID if defined, else to original chat
    const targetJID = config.MV_JID || from;
    await conn.sendMessage(targetJID, message, { quoted: mek });

    // Add ✔ reaction to indicate successful sending in original chat
    await conn.sendMessage(from, { react: { text: "✔", key: mek.key } });

  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: "❌ Failed to send the Movie." }, { quoted: mek });
  }
});
