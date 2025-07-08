const axios = require("axios");
const cheerio = require('cheerio');
const { cmd, commands } = require('../lib/command');
const config = require('../settings');
const { fetchJson } = require('../lib/functions');

const searchApi = `https://nethu-api-ashy.vercel.app`;
const seriesApi = `https://suhas-bro-api.vercel.app`;

var desc = config.LANG === 'SI' ? "sinhalasub වෙතින් ටීවී කතාමාලා චාගත කරයි." : "Download TV series from SinhalaSub.";
var imgmsg = config.LANG === 'SI' ? "*🚩 කරුණාකර වචන කිහිපයක් ලියන්න*" : "*🚩 Please give me a text*";
var urlneed = config.LANG === 'SI' ? "*🚩 කරුණාකර sinhalasub TV series url එකක් ලබා දෙන්න*" : "*🚩 Please give me a SinhalaSub TV series url*";
var epurlneed = config.LANG === 'SI' ? "*🚩 කරුණාකර sinhalasub episode url එකක් ලබා දෙන්න්*" : "*🚩 Please give me a SinhalaSub episode url*";
var N_FOUND = config.LANG === 'SI' ? "*මට කිසිවක් සොයාගත නොහැකි විය :(*" : "*I couldn't find anything :(*";

// Search for TV series
cmd({
  pattern: "sinhalasubtv",
  alias: ["sstv"],
  react: "📺",
  desc: desc,
  category: "movie",
  use: ".sinhalasubtv game of thrones",
  filename: __filename
},
async (conn, mek, m, { from, q, prefix }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: imgmsg }, { quoted: mek });

    const res = await fetchJson(`${searchApi}/movie/sinhalasub/search?text=${encodeURIComponent(q)}`);

    if (!res.result || res.result.data.length === 0) return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });

    const buttons = res.result.data
      .filter(item => item.link.includes('/tvshows/'))
      .slice(0, 10)
      .map(item => ({
        buttonId: `${prefix}tv_search ${item.link}||${item.title}`,
        buttonText: { displayText: `${item.title}` },
        type: 1
      }));

    if (buttons.length === 0) return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });

    const buttonMessage = {
      image: { url: config.LOGO || "https://files.catbox.moe/apqvg7.jpeg" },
      caption: `_🔎 𝗦𝗶𝗻𝗵𝗮𝗹𝗮𝘀𝘂𝗯 𝗧𝗩 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀_\n\n\`Input :\` ${q}`,
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

// Fetch TV series details and episodes
cmd({
  pattern: "tv_search",
  react: "🔎",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, prefix, quoted }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    const [url, title] = q.split("||");
    if (!url || !title) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    let series = await fetchJson(`${seriesApi}/movie/sinhalasub/tvshow?url=${encodeURIComponent(url)}`);
    if (!series.result?.data) return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });

    let data = series.result.data;
    let imageData = await fetchJson(`${searchApi}/movie/sinhalasub/movie?url=${encodeURIComponent(url)}`);
    const image = imageData.result?.data?.images && Array.isArray(imageData.result.data.images) && imageData.result.data.images.length > 0
      ? imageData.result.data.images[0]
      : (data.image && (data.image.startsWith("https://sinhalasub.lk") || data.image.startsWith("https://image.tmdb.org"))
        ? data.image
        : config.LOGO || "https://files.catbox.moe/apqvg7.jpeg");

    const seriesTitle = title;

    const caption = `☘️ *\`𝗧ɪᴛʟᴇ\` : ${seriesTitle}* \n
📅 *\`𝗥ᴇʟᴇᴀꜱᴇᴅ ᴅᴀᴛᴇ\` : ${data.date || 'N/A'}*
🌟 *\`𝗥ᴀᴛɪɴɢ\` : ${data.imdb || data.tmdbRate || 'N/A'}*
🏷️ *\`𝗖ᴀᴛᴇɢᴏʀɪᴇꜱ\` : ${data.category?.join(', ') || 'N/A'}*
🪄️ *\`𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ\` : ${data.subtitle_author || 'N/A'}*`;

    const sections = [
      {
        title: "Get the Series Details",
        rows: [{ title: "Get Details Card", rowId: `${prefix}tv_info ${url}||${seriesTitle}` }]
      },
      {
        title: "Download All Episodes ⬇️",
        rows: [{ title: "Download All Episodes", rowId: `${prefix}tv_download_all ${url}||${seriesTitle}` }]
      },
      {
        title: "Select Episode ⬇️",
        rows: data.episodes?.map((ep, i) => ({
          title: `Episode ${ep.title || `S${Math.floor((i + 1) / 10) + 1}E${(i + 1) % 10 || 10}`}`,
          rowId: `${prefix}tv_episode ${ep.episode_link || ep.link}||${seriesTitle}||${image}`
        })) || []
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
    await conn.sendMessage(from, { text: "❌ Error occurred while fetching series data." }, { quoted: mek });
  }
});

// Fetch and download individual episode
cmd({
  pattern: "tv_episode",
  react: "⬇️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, prefix, quoted }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: epurlneed }, { quoted: mek });

    const [url, seriesTitle, image] = q.split("||");
    if (!url || !seriesTitle) return await conn.sendMessage(from, { text: epurlneed }, { quoted: mek });

    let episode = await fetchJson(`${seriesApi}/movie/sinhalasub/episode?url=${encodeURIComponent(url)}`);
    if (!episode.result?.data) return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });

    let data = episode.result.data;

    const safeTitle = data.ep_name?.replace(/[^\w\s\-]/gi, '') || data.title?.replace(/[^\w\s\-]/gi, '') || "Episode";

    const caption = `☘️ *\`𝗧ɪᴛʟᴇ\` : ${seriesTitle} - ${safeTitle}* \n
📅 *\`𝗥ᴇʟᴇᴀꜱᴇᴅ ᴅᴀᴛᴇ\` : ${data.date || 'N/A'}*
🪄️ *\`𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ\` : ${data.subtitle_author || 'N/A'}*`;

    const sections = [
      {
        title: "Download DDL ⬇️",
        rows: data.dl_links?.map((dl, i) => ({
          title: `${dl.quality} (${dl.size})`,
          rowId: `${prefix}tv_download ${dl.link}||${safeTitle}||${dl.quality}||${image}`
        })) || []
      }
    ];

    await conn.listMessage2(from, {
      image: { url: image || (config.LOGO || "https://files.catbox.moe/apqvg7.jpeg") },
      caption,
      footer: config.FOOTER || "> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*",
      title: "",
      buttonText: "`Select Download Option` 🔢",
      sections,
    }, mek);
  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { text: "❌ Error occurred while fetching episode data." }, { quoted: mek });
  }
});

// Fetch detailed TV series information
cmd({
  pattern: "tv_info",
  react: "☑️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    const [url, seriesTitle] = q.split("||");
    if (!url || !seriesTitle) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    let series = await fetchJson(`${seriesApi}/movie/sinhalasub/tvshow?url=${encodeURIComponent(url)}`);
    if (!series.result?.data) return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });

    let data = series.result.data;
    let imageData = await fetchJson(`${searchApi}/movie/sinhalasub/movie?url=${encodeURIComponent(url)}`);
    const image = imageData.result?.data?.images && Array.isArray(imageData.result.data.images) && imageData.result.data.images.length > 0
      ? imageData.result.data.images[0]
      : (data.image && (data.image.startsWith("https://sinhalasub.lk") || data.image.startsWith("https://image.tmdb.org"))
        ? data.image
        : config.LOGO || "https://files.catbox.moe/apqvg7.jpeg");

    const caption = `☘️ *\`𝗧ɪᴛʟᴇ\` : ${seriesTitle}* \n
📅 *\`𝗥ᴇʟᴇᴀꜱᴇᴅ ᴅᴀᴛᴇ\` : ${data.date || 'N/A'}*
🌟 *\`𝗥ᴀᴛɪɴɢ\` : ${data.imdb || data.tmdbRate || 'N/A'}*
🗳️ *\`𝗦ɪɴʜᴀʟᴀꜱᴜʙ ᴠᴏᴛᴇꜱ\` : ${data.average || data.sinhalasubVote || 'N/A'}*
🎭 *\`𝗖ᴀᴛᴇɢᴏʀɪᴇꜱ\` : ${data.category?.join(', ') || 'N/A'}*
🎬 *\`𝗗ɪʀᴇᴄᴛᴇᴅ ʙʏ\` : ${data.director || 'N/A'}*
🪄️ *\`𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ\` : ${data.subtitle_author || 'N/A'}*
📎 *\`𝗨ʀʟ\` : ${url}*
📺 *\`𝗧ᴏᴛᴀʟ ᴇᴘɪꜱᴏᴅᴇꜱ\` : ${data.episodes?.length || 'N/A'}*

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
    await conn.sendMessage(from, { text: "❌ Error occurred while fetching series details." }, { quoted: mek });
  }
});

// Download individual episode
cmd({
  pattern: "tv_download",
  react: "⬇️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, quoted }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: epurlneed }, { quoted: mek });

    const [link, title, quality, image] = q.split("||");
    const safeTitle = title?.replace(/[^\w\s\-]/gi, '') || "Episode";

    const message = {
      document: { url: link },
      mimetype: "video/mp4",
      fileName: `${safeTitle} - 𝙷𝙸𝚁𝙰𝙽-𝙼𝙳 𝚃𝚅 𝚂𝙴𝚁𝙸𝙴𝚂 𝙳𝙻.mp4`,
      caption: `[ *Quality:* \`${quality}\` ]\n\n${config.MV_FOOTER || "> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌𝐃 🧚🪄*"}`,
      thumbnail: { url: image || (config.LOGO || "https://files.catbox.moe/apqvg7.jpeg") }
    };

    const targetJID = config.MV_JID || from;
    await conn.sendMessage(targetJID, message, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✔", key: mek.key } });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { text: "❌ Failed to send the episode." }, { quoted: mek });
  }
});

// Download all episodes
cmd({
  pattern: "tv_download_all",
  react: "⬇️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, prefix, quoted }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    const [seriesUrl, seriesTitle] = q.split("||");
    if (!seriesUrl || !seriesTitle) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    let series = await fetchJson(`${seriesApi}/movie/sinhalasub/tvshow?url=${encodeURIComponent(seriesUrl)}`);
    if (!series.result?.data?.episodes) return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });

    const episodes = series.result.data.episodes;
    const safeSeriesTitle = seriesTitle?.replace(/[^\w\s\-]/gi, '') || "Series";

    await conn.sendMessage(from, { text: `*📺 Downloading all episodes for ${safeSeriesTitle}...*\nThis may take a while depending on the number of episodes.` }, { quoted: mek });

    let imageData = await fetchJson(`${searchApi}/movie/sinhalasub/movie?url=${encodeURIComponent(seriesUrl)}`);
    const defaultImage = imageData.result?.data?.images && Array.isArray(imageData.result.data.images) && imageData.result.data.images.length > 0
      ? imageData.result.data.images[0]
      : config.LOGO || "https://files.catbox.moe/apqvg7.jpeg";

    for (const episode of episodes) {
      let epData = await fetchJson(`${seriesApi}/movie/sinhalasub/episode?url=${encodeURIComponent(episode.episode_link || episode.link)}`);
      if (!epData.result?.data) continue;

      const ep = epData.result.data;
      const downloadLink = ep.dl_links?.[1]?.link;
      const quality = ep.dl_links?.[1]?.quality || "Unknown";
      const safeEpTitle = ep.ep_name?.replace(/[^\w\s\-]/gi, '') || ep.title?.replace(/[^\w\s\-]/gi, '') || `Episode_${ep.episode || 'Unknown'}`;

      if (downloadLink) {
        const message = {
          document: { url: downloadLink },
          mimetype: "video/mp4",
          fileName: `${safeSeriesTitle} - ${safeEpTitle} - 𝙷𝙸𝚁𝙰𝙽-𝙼𝙳 𝚃𝚅 𝚂𝙴𝚁𝙸𝙴𝚂 𝙳𝙻.mp4`,
          caption: `[ *Episode:* ${ep.ep_name || ep.title || 'Untitled'} ]\n[ *Quality:* \`${quality}\` ]\n\n${config.MV_FOOTER || "> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌𝐃 🧚🪄*"}`,
          thumbnail: { url: defaultImage }
        };

        const sentMessage = await conn.sendMessage(from, message, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✔", key: sentMessage.key } });

        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    await conn.sendMessage(from, { text: `*✅ Finished downloading all available episodes for ${safeSeriesTitle}.*` }, { quoted: mek });
    await conn.sendMessage(from, { react: { text: "✔", key: mek.key } });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { text: "❌ Error occurred while downloading episodes." }, { quoted: mek });
  }
});
