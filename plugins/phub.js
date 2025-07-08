const axios = require("axios");
const { cmd, commands } = require('../lib/command');
const config = require('../settings');
const { fetchJson } = require('../lib/functions');

const searchApi = `https://xham.vercel.app`;
const downloadApi = `https://phdl-ayo.vercel.app`;

var desc = '';
if (config.LANG === 'SI') desc = "PornHub වෙතින් වීඩියෝ බාගත කරයි.";
else desc = "Download videos from PornHub.";

var imgmsg = '';
if (config.LANG === 'SI') imgmsg = "*🚩 කරුණාකර වකන කිහිපයක් ලියන්න*";
else imgmsg = "*🚩 Please provide a search query*";

var urlneed = '';
if (config.LANG === 'SI') urlneed = "*🚩 කරුණාකර PornHub url එකක් ඲{බා දෙන්න*";
else urlneed = "*🚩 Please provide a PornHub URL*";

var N_FOUND = '';
if (config.LANG === 'SI') N_FOUND = "*මට කිසිවක් සොයාගත නොහැකි විය :(*";
else N_FOUND = "*I couldn't find anything :(*";

cmd({
  pattern: "phub",
  alias: ["pornhub"],
  use: ".phub <query>",
  react: "🔞",
  desc: "Search videos from PornHub (18+)",
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, q, reply, prefix }) => {
  try {
    if (!q) return reply(imgmsg);

    const res = await fetchJson(`${searchApi}/api/phs?q=${encodeURIComponent(q)}`);

    if (!res || res.length === 0) {
      return reply(N_FOUND);
    }

    const results = res.slice(0, 30);

    const formatted = {
      provider: "xham-api",
      result: results.map(video => ({
        title: video.title || "No Title",
        url: video.url || "No URL",
        duration: video.duration || "N/A",
        uploader: video.uploader || "Unknown",
        views: video.views || "N/A"
      }))
    };

    const buttons = formatted.result.map((item, i) => ({
      buttonId: `.phubinfo ${item.url}`,
      buttonText: { displayText: `${item.title}` },
      type: 1
    }));

    const buttonMessage = {
      image: { url: config.LOGO },
      caption: `*🔞 PornHub Search Results for:* _${q}_`,
      footer: config.FOOTER,
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
  pattern: "phubinfo",
  react: "⬇️",
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, { from, q, reply, prefix }) => {
  try {
    if (!q) return reply(urlneed);

    // Fetch video details from download API
    const dlInfo = await fetchJson(`${downloadApi}/api/phdl?url=${encodeURIComponent(q)}`);
    if (dlInfo.code !== 0 || !dlInfo.video_title || !dlInfo.format || dlInfo.format.length === 0) {
      return reply(N_FOUND);
    }

    // Fetch duration and views from search API
    const viewkey = q.match(/viewkey=([^&]+)/)?.[1] || dlInfo.video_title || q;
    const searchRes = await fetchJson(`${searchApi}/api/phs?q=${encodeURIComponent(viewkey)}`);
    const video = searchRes.find(v => v.url === q) || searchRes[0] || {};

    // Log if views or duration are missing for debugging
    if (!video.views || !video.duration) {
      console.warn(`Missing views/duration for URL: ${q}, viewkey: ${viewkey}`, searchRes);
    }

    const msg = `*🍑 PornHub Video Downloader*
    
*┃* 📝 \`Title\` : ${dlInfo.video_title}
*┃* 👤 \`Uploader\` : ${dlInfo.video_uploader}
*┃* 📈 \`Views\` : ${video.views || "N/A"}
*┃* ⏳ \`Duration\` : ${video.duration || "N/A"}`;

    // Generate buttons for each available resolution
    const buttons = dlInfo.format.map(format => ({
      buttonId: `${prefix}phubdl ${q} ${format.resolution}`,
      buttonText: { displayText: `Download ${format.resolution}p` },
      type: 1
    }));

    await conn.buttonMessage2(from, {
      image: { url: dlInfo.video_cover || config.LOGO },
      caption: msg,
      footer: config.FOOTER,
      buttons,
      headerType: 4
    }, mek);

  } catch (e) {
    console.error(`Error in phubinfo for URL: ${q}`, e);
    reply('*❌ Error fetching video info.*');
  }
});

cmd({
  pattern: "phubdl",
  react: "⬇️",
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply(urlneed);

    // Split query into URL and resolution (e.g., ".phubdl <url> 720")
    const [url, resolution] = q.split(' ').filter(Boolean);
    if (!url || !resolution) return reply("*🚩 Please provide a URL and resolution (e.g., 720).*");

    // Fetch download info
    const dlInfo = await fetchJson(`${downloadApi}/api/phdl?url=${encodeURIComponent(url)}`);
    if (dlInfo.code !== 0 || !dlInfo.format || dlInfo.format.length === 0) {
      return reply(N_FOUND);
    }

    // Find the requested resolution
    const selectedFormat = dlInfo.format.find(f => f.resolution === resolution);
    if (!selectedFormat) {
      return reply(`*❌ Resolution ${resolution}p not available.*`);
    }

    const videoUrl = selectedFormat.download_url;

    // Validate video URL with a HEAD request
    try {
      await axios.head(videoUrl, { timeout: 5000 });
    } catch (e) {
      console.error(`Invalid video URL: ${videoUrl}`, e.message);
      return reply("*❌ Video URL is invalid or inaccessible.*");
    }

    // Send video
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption: `*${dlInfo.video_title} (${resolution}p)*\n\n${config.FOOTER}`,
    }, { quoted: mek });

  } catch (e) {
    console.error(`Error in phubdl for query: ${q}`, e);
    reply('*❌ Error downloading video.*');
  }
});
