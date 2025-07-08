const axios = require("axios");
const { cmd, commands } = require('../lib/command');
const config = require('../settings');
const { fetchJson } = require('../lib/functions');
const yts = require('yt-search');

const apiBase = `https://apis.davidcyriltech.my.id`;
const defaultPreview = config.LOGO;

var imgmsg = '';
if (config.LANG === 'SI') imgmsg = "*🎵 කරුණාකර ගීතයේ නමක් හෝ URL එකක් ලබා දෙන්න*";
else imgmsg = "*🎵 Please provide a song title or URL*";

var urlneed = '';
if (config.LANG === 'SI') urlneed = "*🎵 කරුණාකර YouTube URL එකක් ලබා දෙන්න*";
else urlneed = "*🎵 Please provide a YouTube URL*";

var N_FOUND = '';
if (config.LANG === 'SI') N_FOUND = "*මට කිසිවක් සොයාගත නොහැකි විය :(*";
else N_FOUND = "*I couldn't find anything :(*";

function extractYouTubeId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|playlist\?list=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function convertYouTubeLink(q) {
    const videoId = extractYouTubeId(q);
    if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return q;
}

function isYouTubeLink(q) {
    return extractYouTubeId(q) !== null;
}

// CSong command (Custom song search for TikTok JID)
cmd({
    pattern: "csong",
    alias: ["csg"],
    use: ".csong <song name or YouTube URL>",
    react: "🎵",
    desc: "Search song to send to TikTok JID",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, prefix }) => {
    try {
        if (!q) return reply(imgmsg);

        const query = convertYouTubeLink(q);

        if (isYouTubeLink(q)) {
            await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
            const search = await yts(query);
            if (!search.videos || search.videos.length === 0) return reply(N_FOUND);

            const data = search.videos[0];

            const msg = `*☘️ Title : ${data.title}*\n` +
                       `*📅 Release Date : ${data.ago}*\n` +
                       `*⏱️ Duration : ${data.timestamp}*\n` +
                       `*👀 Views : ${data.views}*\n` +
                       `*🔗 Link : https://youtube.com/watch?v=${extractYouTubeId(data.url)}*`;

            const buttons = [
                { buttonId: `${prefix}csongdl ${query} audio`, buttonText: { displayText: "🎧 Send Song" }, type: 1 }
            ];

            await conn.buttonMessage2(from, {
                image: { url: data.thumbnail },
                caption: msg,
                footer: config.FOOTER,
                buttons,
                headerType: 4
            }, mek);
        } else {
            const search = await yts(query);
            const results = search.videos.slice(0, 10);

            if (!results || results.length === 0) {
                return reply(N_FOUND);
            }

            const formatted = {
                provider: "hiran-md",
                result: results.map(video => ({
                    title: video.title || "No Title",
                    url: video.url || "No URL",
                    duration: video.timestamp || "N/A",
                    views: video.views || "N/A",
                    uploaded: video.ago || "N/A"
                }))
            };

            const buttons = formatted.result.map((item, i) => ({
                buttonId: `.csonginfo ${item.url}`,
                buttonText: { displayText: `${item.title}` },
                type: 1
            }));

            const buttonMessage = {
                image: { url: defaultPreview },
                caption: `*🔎 Song Search Results*\n\n \`Input :\` _${q}_`,
                footer: config.FOOTER,
                buttons,
                headerType: 4
            };

            await conn.buttonMessage2(from, buttonMessage, mek);
        }

    } catch (err) {
        console.error(err);
        reply("*❌ Error occurred while processing.*");
    }
});

// CSong info command
cmd({
    pattern: "csonginfo",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, prefix, quoted, reply }) => {
    try {
        if (!q) return reply(urlneed);

        const search = await yts(q);
        if (!search.videos || search.videos.length === 0) return reply(N_FOUND);

        const data = search.videos[0];

        const msg = `*☘️ Title : ${data.title}*\n\n` +
                   `*📅 Release Date : ${data.ago}*\n` +
                   `*⏱️ Duration : ${data.timestamp}*\n` +
                   `*👀 Views : ${data.views}*\n` +
                   `*🔗 Link : https://youtube.com/watch?v=${extractYouTubeId(data.url)}*`;

        const buttons = [
            { buttonId: `${prefix}csongdl ${q} audio`, buttonText: { displayText: "🎧 Send Song" }, type: 1 }
        ];

        await conn.buttonMessage2(from, {
            image: { url: data.thumbnail },
            caption: msg,
            footer: config.FOOTER,
            buttons,
            headerType: 4
        }, mek);

    } catch (e) {
        reply('*ERROR*');
        console.log(e);
    }
});

// CSong download command (Send details with thumbnail, then song as voice note to TIKTOK_SEND_JID)
cmd({
    pattern: "csongdl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, quoted, reply }) => {
    try {
        if (!q) return reply(urlneed);
        const [url, type] = q.split(' ');
        if (!url || type !== 'audio') return reply("*🎵 Please use .csongdl with a valid URL and 'audio' type*");

        const apiUrl = `${apiBase}/download/ytmp3?url=${encodeURIComponent(url)}`;
        const res = await fetchJson(apiUrl);
        if (res.status !== 200 || !res.success || !res.result.download_url) {
            return reply("*Failed to fetch audio. Try again later 😔*");
        }

        const downloadUrl = res.result.download_url;
        const search = await yts(url);
        const data = search.videos[0];

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } }); // Notify user of completion

        const msg = `*☘️ 𝗧ɪᴛʟᴇ : ${data.title}*\n\n` +
`*📆 𝗥ᴇʟᴇᴀꜱᴇᴅ ᴅᴀᴛᴇ : ${data.ago}*\n` +
`*⏱️ 𝗗ᴜʀᴀᴛɪᴏɴ : ${data.timestamp}*\n` +
`*📈 𝗩ɪᴇᴡꜱ : ${data.views}*\n\n` +
`> *𝗨ꜱᴇ 𝗛ᴇᴀᴅᴘʜᴏɴᴇꜱ 𝗙ᴏʀ 𝗕ᴇꜱᴛ 𝗟ɪꜱᴛᴇɴɪɴɢ 🧝‍♂️🪄*\n\n` +
`* *𝙹𝙾𝙸𝙽 𝚆𝙸𝚃𝙷 𝚄𝚂 ➟* https://whatsapp.com/channel/0029VbAqseT30LKNCO71mQ3d`;

        // Send details with thumbnail to CSONG_SEND_JID first
        if (config.CSONG_SEND_JID) {
            await conn.sendMessage(config.CSONG_SEND_JID, {
                image: { url: data.thumbnail },
                caption: msg,
                footer: config.FOOTER,
                headerType: 4
            });
            // Send audio as voice note to CSONG_SEND_JID separately
            await conn.sendMessage(config.CSONG_SEND_JID, {
                audio: { url: downloadUrl },
                mimetype: "audio/mpeg",
                ptt: true // Send as voice note to match waveform style
            });
            await conn.sendMessage(from, { text: `*🎧 Song and information sent to \`${config.CSONG_SEND_JID}\` Successfully!*` });
        } else {
            await conn.sendMessage(from, { text: "*❌ CSONG_SEND_JID not configured!*" });
        }

    } catch (e) {
        reply('*ERROR*');
        console.log(e);
    }
});
