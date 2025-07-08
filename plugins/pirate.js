const axios = require("axios");
const cheerio = require('cheerio');
const { cmd, commands } = require('../lib/command');
const config = require('../settings');
const { fetchJson } = require('../lib/functions');
const { File } = require('megajs');
const mime = require('mime-types');
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const api = `https://nethu-api-ashy.vercel.app`;

var desc = '';
if (config.LANG === 'SI') desc = "Pirate වෙතින් වීඩියෝ බාගත කරයි.";
else desc = "Download videos from Pirate.";

var imgmsg = '';
if (config.LANG === 'SI') imgmsg = "*🚩 කරුණාකර වචන කිහිපයක් ලියන්න*";
else imgmsg = "*🚩 Please give me a text*";

var urlneed = '';
if (config.LANG === 'SI') urlneed = "*🚩 කරුණාකර Pirate url එකක් ලබා දෙන්න*";
else urlneed = "*🚩 Please give me a Pirate url*";

var N_FOUND = '';
if (config.LANG === 'SI') N_FOUND = "*මට කිසිවක් සොයාගත නොහැකි විය :(*";
else N_FOUND = "*I couldn't find anything :(*";

cmd({
  pattern: "pirate",
  alias: ["psub"],
  react: "🎬",
  desc: desc,
  category: "movie",
  use: ".pirate 2024",
  filename: __filename
},
async (conn, mek, m, { from, q, reply, prefix }) => {
  try {
    if (!q) return reply(imgmsg);

    const res = await fetchJson(`${api}/movie/pirate/search?text=${encodeURIComponent(q)}`);

    if (!res.result || res.result.data.length === 0) {
      return reply(N_FOUND);
    }

    const buttons = res.result.data.slice(0, 10).map((item, i) => ({
      buttonId: `${prefix}pirate_search ${item.link}||${item.title}`,
      buttonText: { displayText: `${item.title} (${item.year})` },
      type: 1
    }));

    const buttonMessage = {
      image: { url: "https://files.catbox.moe/apqvg7.jpeg" },
      caption: `_🔎 Pirate Search Results_\n\nInput: ${q}`,
      footer: "> *© Powered By Hiran-Md 🧚🪄*",
      buttons: buttons,
      headerType: 4
    };

    return await conn.buttonMessage2(from, buttonMessage, mek);

  } catch (e) {
    reply('*Error*');
    console.error(e);
  }
});

cmd({
  pattern: "pirate_search",
  react: "🔎",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, prefix, quoted, reply }) => {
  try {
    if (!q) return reply(urlneed);

    const [url, title] = q.split("||");
    if (!url || !title) return reply(urlneed);

    let pirate = await fetchJson(`${api}/movie/pirate/movie?url=${encodeURIComponent(url)}`);
    if (!pirate.result?.data) return reply(N_FOUND);

    let data = pirate.result.data;
    const movieTitle = title;
    const image = data.image || "https://files.catbox.moe/apqvg7.jpeg";

    const caption = `☘️ *Title: ${movieTitle}* \n
📅 *Released Date: ${data.date || 'N/A'}*
🌍 *Country: ${data.country || 'N/A'}*
⏳ *Runtime: ${data.runtime || 'N/A'}*
🌟 *IMDb Rating: ${data.imdb || 'N/A'}*
🌟 *TMDB Rating: ${data.tmdb || 'N/A'}*
🏷️ *Categories: ${data.category?.join(', ') || 'N/A'}*
🎬 *Directed By: ${data.director || 'N/A'}*
🪄 *Subtitle By: ${data.subtitle_author || 'Pirate'}*`;

    const filteredLinks = data.dl_links?.filter(dl => 
      dl.link.includes('mega.nz') || dl.link.includes('pixeldrain.com')
    ) || [];

    // Translate "සිංහල උපසිරැසි එකතු කල වීඩියෝ" to "Sinhala Subtitled Video" and use quality with file size
    const sections = [
      {
        title: "Download Links ⬇️",
        rows: filteredLinks.map(dl => {
          let displayQuality = dl.quality;
          if (dl.quality === "සිංහල උපසිරැසි එකතු කල වීඩියෝ") {
            displayQuality = `Sinhala Subtitled Video (${dl.size})`;
          } else {
            displayQuality = `${dl.quality} (${dl.size || 'N/A'})`;
          }
          return {
            title: displayQuality,
            rowId: `${prefix}piratedl ${dl.link}||${movieTitle}||${displayQuality}`
          };
        })
      },
      {
        title: "Get the Movie Details",
        rows: [{
          title: "Get Details Card",
          rowId: `${prefix}pirate_details ${url}||${movieTitle}`
        }]
      }
    ];

    await conn.listMessage2(from, {
      image: { url: image },
      caption,
      footer: "> *© Powered By Hiran-Md 🧚🪄*",
      title: "",
      buttonText: "Reply Below Number 🔢",
      sections,
    }, mek);

  } catch (err) {
    console.error(err);
    reply("❌ Error occurred while fetching data.");
  }
});

cmd({
  pattern: "pirate_details",
  react: "☑️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply(urlneed);

    const [url, title] = q.split("||");
    if (!url || !title) return reply(urlneed);

    let pirate = await fetchJson(`${api}/movie/pirate/movie?url=${encodeURIComponent(url)}`);
    if (!pirate.result?.data) return reply(N_FOUND);

    let data = pirate.result.data;
    const movieTitle = title;
    const image = data.image || "https://files.catbox.moe/apqvg7.jpeg";

    const caption = `☘️ *Title: ${movieTitle}* \n
📅 *Released Date: ${data.date || 'N/A'}*
🌍 *Country: ${data.country || 'N/A'}*
⏳ *Runtime: ${data.runtime || 'N/A'}*
🌟 *IMDb Rating: ${data.imdb || 'N/A'}*
🌟 *TMDB Rating: ${data.tmdb || 'N/A'}*
🎭 *Directed By: ${data.director || 'N/A'}*
🏷️ *Categories: ${data.category?.join(', ') || 'N/A'}*
🪄 *Subtitle By: ${data.subtitle_author || 'Pirate'}*
📎 *Url: ${url}*

*➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟*

*𝙹𝙾𝙸𝙽 𝚄𝚂 ➟* https://chat.whatsapp.com/Jw9JYWEst4p08aDPyXHfJ6

*➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟*

🧾 *Description:*\n${data.description ? data.description.split('\n')[0] : 'No description available.'}\n\n> *© Powered By Hiran-Md 🧚🪄*`;

    await conn.sendMessage(from, {
      image: { url: image },
      caption,
      footer: "> *© Powered By Hiran-Md 🧚🪄*"
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply("❌ Error occurred while fetching details.");
  }
});

cmd({
  pattern: "piratedl",
  react: "🍟",
  dontAddCommandList: true,
  desc: "Download movie files from Pirate",
  category: "download",
  use: ".piratedl <url>",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply(urlneed);

    const [link, title, quality] = q.split("||");
    if (!link || !title) return reply(urlneed);

    const safeTitle = title.replace(/[^\w\s\-]/gi, '') || "Movie";
    let file, data, mimetype;

    // Optimize download by using streams instead of buffering entire file
    if (link.includes('mega.nz')) {
      file = File.fromURL(link);
      await file.loadAttributes();
      data = file.download(); // Use stream instead of buffer
      mimetype = mime.lookup(file.name) || "application/octet-stream";
    } else if (link.includes('pixeldrain.com')) {
      const response = await fetch(link, { method: 'GET', redirect: 'follow' });
      data = response.body; // Use stream
      mimetype = mime.lookup(link) || "application/octet-stream";
    } else {
      return reply("❌ Only Mega.nz and Pixeldrain links are supported.");
    }

    const fileExtension = mimetype.includes('video') ? '.mp4' :
                          mimetype.includes('pdf') ? '.pdf' :
                          mimetype.includes('zip') ? '.zip' :
                          mimetype.includes('rar') ? '.rar' :
                          mimetype.includes('7z') ? '.7z' :
                          mimetype.includes('jpeg') ? '.jpg' :
                          mimetype.includes('png') ? '.png' :
                          mimetype.includes('subrip') ? '.srt' : '.bin';

    await conn.sendMessage(from, {
      document: { stream: data },
      mimetype: mimetype,
      fileName: `${safeTitle} [${quality}] - HIRAN-MD MOVIE-DL${fileExtension}`,
      caption: `[ *Quality:* \`${quality}\` ]\n\n> *© Powered By Hiran-Md 🧚🪄*`
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    reply(`❌ Failed to send the video: ${e.message}`);
  }
});
