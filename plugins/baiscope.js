const axios = require("axios");
const cheerio = require('cheerio');
const { cmd, commands } = require('../lib/command');
const config = require('../settings');
const { fetchJson } = require('../lib/functions');

var desc = '';
if (config.LANG === 'SI') desc = "Baiscope වෙතින් චිත්‍රපට බාගත කරයි.";
else desc = "Download movies from Baiscope.";

var imgmsg = '';
if (config.LANG === 'SI') imgmsg = "*🚩 කරුණාකර වචන කිහිපයක් ලියන්න*";
else imgmsg = "*🚩 Please give me a text*";

var urlneed = '';
if (config.LANG === 'SI') urlneed = "*🚩 කරුණාකර Baiscope URL එකක් ලබා දෙන්න*";
else urlneed = "*🚩 Please give me a Baiscope URL*";

var N_FOUND = '';
if (config.LANG === 'SI') N_FOUND = "*මට කිසිවක් සොයාගත නොහැකි විය :(*";
else N_FOUND = "*I couldn't find anything :(*";

// Search movies on Baiscope
cmd({
  pattern: "baiscope",
  alias: ["baiscopesearch"],
  react: "🎬",
  desc: desc,
  category: "movie",
  use: ".baiscope 2024",
  filename: __filename
},
async (conn, mek, m, { from, q, prefix }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: imgmsg }, { quoted: mek });

    const url = `https://www.baiscope.lk/?s=${encodeURIComponent(q)}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let results = [];
    $('article.elementor-post').each((index, element) => {
      const titleElement = $(element).find('h5 > a');
      const title = titleElement.text().trim();
      const link = titleElement.attr('href');
      const img = $(element).find('img').attr('src');
      if (title && link) {
        results.push({ title, link, img });
      }
    });

    if (results.length === 0) {
      return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });
    }

    const buttons = results.slice(0, 10).map((item, i) => ({
      buttonId: `${prefix}baiscope_details ${item.link}||${item.title}||${item.img}`,
      buttonText: { displayText: `${item.title}` },
      type: 1
    }));

    const buttonMessage = {
      image: { url: results[0].img || config.LOGO },
      caption: `_️🔎 𝗕𝗮𝗶𝘀𝗰𝗼𝗽𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀_\n\n\`Input :\` ${q}`,
      footer: config.FOOTER,
      buttons: buttons,
      headerType: 4
    };

    return await conn.buttonMessage2(from, buttonMessage, mek);

  } catch (e) {
    await conn.sendMessage(from, { text: '*Error*' }, { quoted: mek });
    console.error(e);
  }
});

// Search subtitles on Baiscope
cmd({
  pattern: "baiscopesub",
  alias: ["baiscopesubtitle"],
  react: "📑",
  desc: desc,
  category: "movie",
  use: ".baiscopesub 2024",
  filename: __filename
},
async (conn, mek, m, { from, q, prefix }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: imgmsg }, { quoted: mek });

    const url = `https://www.baiscope.lk/?s=${encodeURIComponent(q)}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let baiscope = [];
    $("div.elementor-column.elementor-col-66.elementor-top-column.elementor-element > div > div > div > div > article").each((c, d) => {
      const title = $(d).find("div > div > h5 > a").text().trim();
      const image = $(d).find("div > a > div > img").attr("src");
      const link = $(d).find("div > div > h5 > a").attr("href");
      if (title && link) {
        baiscope.push({ title, image, link });
      }
    });

    if (baiscope.length === 0) return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });

    const buttons = baiscope.slice(0, 10).map((item, i) => ({
      buttonId: `${prefix}baiscope_details ${item.link}||${item.title}||${item.image}`,
      buttonText: { displayText: `${item.title}` },
      type: 1
    }));

    const buttonMessage = {
      image: { url: baiscope[0].image || config.LOGO },
      caption: `_️🔎 𝗕𝗮𝗶𝘀𝗰𝗼𝗽𝗲 𝗦𝘂𝗯𝘁𝗶𝘁𝗹𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀_\n\n\`Input :\` ${q}`,
      footer: config.FOOTER,
      buttons: buttons,
      headerType: 4
    };

    return await conn.buttonMessage2(from, buttonMessage, mek);

  } catch (e) {
    await conn.sendMessage(from, { text: '*Error*' }, { quoted: mek });
    console.error(e);
  }
});

// Fetch movie/subtitle details
cmd({
  pattern: "baiscope_details",
  react: "🔎",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, prefix, quoted }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    const [url, title, image] = q.split("||");
    if (!url || !title) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const d = $("div.cm-posts.clearfix > article > div");
    const time = d.find("div.cm-below-entry-meta > span.cm-post-date > a > time").text() || 'N/A';
    const movieTitle = d.find("header.cm-entry-header > h1").text() || title;
    const desc = d.find("div.cm-entry-summary > p > span").text() || 'N/A';
    const ratings = d.find("div.cm-entry-summary > div > div > div.gdrts-rating-text > strong").text() || 'N/A';
    const link = $("#post-218491 > div > div.cm-entry-summary > a").attr("href");
    const lin2 = d.find("div.cm-entry-summary > div:nth-child(35) > a").attr("href");
    const dllinks = lin2 || link || 'N/A';

    const caption = `☘️ *\`𝗧ɪᴛʟᴇ\` : ${movieTitle}* \n
📅 *\`𝗥ᴇʟᴇᴀꜱᴇᴅ ᴅᴀᴛᴇ\` : ${time}*
📝 *\`𝗗ᴇꜱᴄʀɪᴘᴛɪᴏɴ\` : ${desc}*
🌟 *\`𝗥ᴀᴛɪɴɢ\` : ${ratings}*
📎 *\`𝗨ʀʟ\` : ${url}*`;

    const sections = [
      {
        title: "Download Movie/Subtitle ⬇️",
        rows: dllinks !== 'N/A' ? [{
          title: "Download",
          rowId: `${prefix}fetchrar ${dllinks}||${movieTitle}||${image}`
        }] : [{ title: "N/A", rowId: `${prefix}fetchrar none||${movieTitle}||${image}` }]
      },
      {
        title: "Get Movie Details",
        rows: [{
          title: "View on Baiscope",
          rowId: `${prefix}baiscope_view ${url}||${movieTitle}||${image}`
        }]
      }
    ];

    await conn.listMessage2(from, {
      image: { url: image || config.LOGO },
      caption,
      footer: config.FOOTER,
      title: "",
      buttonText: "`Reply Below Number` 🔢",
      sections,
    }, mek);

  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { text: "❌ Error occurred while fetching data." }, { quoted: mek });
  }
});

// View movie details on Baiscope
cmd({
  pattern: "baiscope_view",
  react: "☑️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    const [url, title, image] = q.split("||");
    if (!url || !title) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const d = $("div.cm-posts.clearfix > article > div");
    const time = d.find("div.cm-below-entry-meta > span.cm-post-date > a > time").text() || 'N/A';
    const movieTitle = d.find("header.cm-entry-header > h1").text() || title;
    const desc = d.find("div.cm-entry-summary > p > span").text() || 'N/A';
    const ratings = d.find("div.cm-entry-summary > div > div > div.gdrts-rating-text > strong").text() || 'N/A';

    const caption = `☘️ *\`𝗧ɪᴛʟᴇ\` : ${movieTitle}* \n
📅 *\`𝗥ᴇʟᴇᴀꜱᴇᴅ ᴅᴀᴛᴇ\` : ${time}*
📝 *\`𝗗ᴇꜱᴄʀɪᴘᴛɪᴏɴ\` : ${desc}*
🌟 *\`𝗥ᴀᴛɪɴɢ\` : ${ratings}*
📎 *\`𝗨ʀʟ\` : ${url}*

*➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟*

*𝙹𝙾𝙸𝙽 𝚄𝚂 ➟* https://chat.whatsapp.com/Jw9JYWEst4p08aDPyXHfJ6

*➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟* \n\n> *© 𝐏𝐨𝐰ᴇʀᴇᴅ 𝐁ʏ 𝐓𝐂 𝐓𝐞𝐚𝐦 🧚🪄*`;

    const targetJID = config.MV_JID || from;
    await conn.sendMessage(targetJID, {
      image: { url: image || config.LOGO },
      caption,
      footer: config.FOOTER
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { text: "❌ Error occurred while fetching details." }, { quoted: mek });
  }
});

// Download movie/subtitle file
cmd({
  pattern: "fetchrar",
  react: "⬇️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, quoted }) => {
  try {
    if (!q) return await conn.sendMessage(from, { text: urlneed }, { quoted: mek });

    const [link, title, image] = q.split("||");
    if (link === "none") return await conn.sendMessage(from, { text: "❌ No download link available." }, { quoted: mek });

    const safeTitle = title?.replace(/[^\w\s\-]/gi, '') || "Movie";

    var vajiralod = [
      "《 █▒▒▒▒▒▒▒▒▒▒▒》10%",
      "《 ████▒▒▒▒▒▒▒▒》30%",
      "《 ███████▒▒▒▒▒》50%",
      "《 ██████████▒▒》80%",
      "《 ████████████》100%",
      "𝙸𝙽𝙸𝚃𝙸𝙰𝙻𝙸𝚉𝙴𝙳 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴𝙳 🦄..."
    ];
    let { key } = await conn.sendMessage(from, { text: 'ᴜᴘʟᴏᴀᴅɪɴɢ ᴍᴏᴠɪᴇ...' });

    for (let i = 0; i < vajiralod.length; i++) {
      await conn.sendMessage(from, { text: vajiralod[i], edit: key });
    }

    const response = await axios.get(link, { responseType: 'arraybuffer' });
    const mediaBuffer = Buffer.from(response.data, 'binary');

    const message = {
      document: mediaBuffer,
      caption: `[ *Title:* \`${safeTitle}\` ]`,
      mimetype: "application/rar",
      fileName: `${safeTitle}- 𝙷𝙸𝚁𝙰𝙽-𝙼𝙳 𝙼𝙾𝚅𝙸𝙴 𝙳𝙻.rar`,
      thumbnail: { url: image || config.LOGO }
    };

    const targetJID = config.MV_JID || from;
    await conn.sendMessage(targetJID, message, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✔", key: mek.key } });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { text: "❌ Failed to send the Movie." }, { quoted: mek });
  }
});
