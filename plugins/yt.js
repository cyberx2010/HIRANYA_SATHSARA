const axios = require("axios");
const { cmd, commands } = require('../lib/command');
const config = require('../settings');
const { fetchJson } = require('../lib/functions');
const yts = require('yt-search');

const apiBase = `https://apis.davidcyriltech.my.id`;
const defaultPreview = config.LOGO;

var songDesc = '';
if (config.LANG === 'SI') songDesc = "YouTube වෙතින් ගීත බාගත කරයි.";
else songDesc = "Download songs from YouTube.";

var videoDesc = '';
if (config.LANG === 'SI') videoDesc = "YouTube වෙතින් වීඩියෝ බාගත කරයි.";
else videoDesc = "Download videos from YouTube.";

var ytDesc = '';
if (config.LANG === 'SI') ytDesc = "YouTube වෙතින් ගීත හෝ වීඩියෝ බාගත කරයි.";
else ytDesc = "Download songs or videos from YouTube.";

var imgmsg = '';
if (config.LANG === 'SI') imgmsg = "*🎵🎥 කරුණාකර ගීතයේ හෝ වීඩියෝවේ නමක් හෝ URL එකක් ලබා දෙන්න*";
else imgmsg = "*🎵🎥 Please provide a song or video title or URL*";

var urlneed = '';
if (config.LANG === 'SI') urlneed = "*🎵🎥 කරුණාකර YouTube URL එකක් ලබා දෙන්න*";
else urlneed = "*🎵🎥 Please provide a YouTube URL*";

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

// Song command (Audio search)
cmd({
    pattern: "song",
    alias: ["play"],
    use: ".song <song name or YouTube URL>",
    react: "🎵",
    desc: songDesc,
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, prefix }) => {
    try {
        if (!q) return reply(imgmsg.replace('🎵🎥', '🎵'));

        const query = convertYouTubeLink(q);

        if (isYouTubeLink(q)) {
            await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
            const search = await yts(query);
            if (!search.videos || search.videos.length === 0) return reply(N_FOUND);

            const data = search.videos[0];

            const msg = `*┃* 📝 \`Title\` : ${data.title}
*┃* 📈 \`Views\` : ${data.views}
*┃* ⏱️ \`Duration\` : ${data.timestamp}
*┃* 📅 \`Uploaded\` : ${data.ago}
*┃* 🔗 \`URL\` : ${data.url}`;

            const buttons = [
                { buttonId: `${prefix}songdl ${query} audio`, buttonText: { displayText: "🎧 Download Audio" }, type: 1 },
                { buttonId: `${prefix}songdl ${query} document`, buttonText: { displayText: "📁 Download Document" }, type: 1 },
                { buttonId: `${prefix}songdl ${query} voice`, buttonText: { displayText: "🎤 Download Voice" }, type: 1 }
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
                buttonId: `.songinfo ${item.url}`,
                buttonText: { displayText: `${item.title}` },
                type: 1
            }));

            const buttonMessage = {
                image: { url: defaultPreview },
                caption: `*🔎 𝗦𝗼𝗻𝗴 𝘀𝗲𝗮𝗿𝗰𝗵 𝗿𝗲𝘀𝘂𝗹𝘁𝘀*\n\n \`Input :\` _${q}_`,
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

// Song info command
cmd({
    pattern: "songinfo",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, prefix, quoted, reply }) => {
    try {
        if (!q) return reply(urlneed.replace('🎵🎥', '🎵'));

        const search = await yts(q);
        if (!search.videos || search.videos.length === 0) return reply(N_FOUND);

        const data = search.videos[0];

        const msg = `*┃* 📝 \`Title\` : ${data.title}
*┃* 📈 \`Views\` : ${data.views}
*┃* ⏱️ \`Duration\` : ${data.timestamp}
*┃* 📅 \`Uploaded\` : ${data.ago}
*┃* 🔗 \`URL\` : ${data.url}`;

        const buttons = [
            { buttonId: `${prefix}songdl ${q} audio`, buttonText: { displayText: "🎧 Download Audio" }, type: 1 },
            { buttonId: `${prefix}songdl ${q} document`, buttonText: { displayText: "📁 Download Document" }, type: 1 },
            { buttonId: `${prefix}songdl ${q} voice`, buttonText: { displayText: "🎤 Download Voice" }, type: 1 }
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

// Song download command
cmd({
    pattern: "songdl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, quoted, reply }) => {
    try {
        if (!q) return reply(urlneed.replace('🎵🎥', '🎵'));

        const [url, type] = q.split(' ');
        if (!url || !['audio', 'document', 'voice'].includes(type)) return reply(urlneed.replace('🎵🎥', '🎵'));

        const apiUrl = `${apiBase}/download/ytmp3?url=${encodeURIComponent(url)}`;
        const res = await fetchJson(apiUrl);
        if (res.status !== 200 || !res.success || !res.result.download_url) return reply("*Failed to fetch audio. Try again later 😔*");

        const downloadUrl = res.result.download_url;
        const search = await yts(url);
        const data = search.videos[0];

        await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });

        if (type === 'audio') {
            await conn.sendMessage(from, {
                audio: { url: downloadUrl },
                mimetype: "audio/mpeg",
                contextInfo: {
                    externalAdReply: {
                        title: data.title,
                        body: data.videoId,
                        mediaType: 1,
                        sourceUrl: data.url,
                        thumbnailUrl: data.thumbnail,
                        renderLargerThumbnail: true,
                        showAdAttribution: true
                    }
                }
            }, { quoted: mek });
        } else if (type === 'document') {
            await conn.sendMessage(from, {
                document: { url: downloadUrl },
                mimetype: "audio/mp3",
                fileName: `${data.title}.mp3`,
                caption: `> *${data.title}*\n${config.FOOTER}`
            }, { quoted: mek });
        } else if (type === 'voice') {
            await conn.sendMessage(from, {
                audio: { url: downloadUrl },
                mimetype: "audio/mpeg",
                ptt: true,
                contextInfo: {
                    externalAdReply: {
                        title: data.title,
                        body: data.videoId,
                        mediaType: 1,
                        sourceUrl: data.url,
                        thumbnailUrl: data.thumbnail,
                        renderLargerThumbnail: true,
                        showAdAttribution: true
                    }
                }
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '📤', key: mek.key } });

    } catch (e) {
        reply('*ERROR*');
        console.log(e);
    }
});

// Video command (Video search)
cmd({
    pattern: "video",
    alias: ["vid", "mp4", "ytv"],
    use: ".video <video name or YouTube URL>",
    react: "🎥",
    desc: videoDesc,
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, prefix }) => {
    try {
        if (!q) return reply(imgmsg.replace('🎵🎥', '🎥'));

        const query = convertYouTubeLink(q);

        if (isYouTubeLink(q)) {
            await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
            const search = await yts(query);
            if (!search.videos || search.videos.length === 0) return reply(N_FOUND);

            const data = search.videos[0];

            const msg = `*┃* 📝 \`Title\` : ${data.title}
*┃* 📈 \`Views\` : ${data.views}
*┃* ⏱️ \`Duration\` : ${data.timestamp}
*┃* 📅 \`Uploaded\` : ${data.ago}
*┃* 🔗 \`URL\` : ${data.url}`;

            const buttons = [
                { buttonId: `${prefix}videodl ${query} video`, buttonText: { displayText: "🎬 Download Video" }, type: 1 },
                { buttonId: `${prefix}videodl ${query} document`, buttonText: { displayText: "📁 Download Document" }, type: 1 }
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
                buttonId: `.videoinfo ${item.url}`,
                buttonText: { displayText: `${item.title}` },
                type: 1
            }));

            const buttonMessage = {
                image: { url: defaultPreview },
                caption: `*🔎 𝗩𝗶𝗱𝗲𝗼 𝘀𝗲𝗮𝗿𝗰𝗵 𝗿𝗲𝘀𝘂𝗹𝘁𝘀*\n\n \`Input :\` _${q}_`,
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

// Video info command
cmd({
    pattern: "videoinfo",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, prefix, quoted, reply }) => {
    try {
        if (!q) return reply(urlneed.replace('🎵🎥', '🎥'));

        const search = await yts(q);
        if (!search.videos || search.videos.length === 0) return reply(N_FOUND);

        const data = search.videos[0];

        const msg = `*┃* 📝 \`Title\` : ${data.title}
*┃* 📈 \`Views\` : ${data.views}
*┃* ⏱️ \`Duration\` : ${data.timestamp}
*┃* 📅 \`Uploaded\` : ${data.ago}
*┃* 🔗 \`URL\` : ${data.url}`;

        const buttons = [
            { buttonId: `${prefix}videodl ${q} video`, buttonText: { displayText: "🎬 Download Video" }, type: 1 },
            { buttonId: `${prefix}videodl ${q} document`, buttonText: { displayText: "📁 Download Document" }, type: 1 }
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

// Video download command
cmd({
    pattern: "videodl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, quoted, reply }) => {
    try {
        if (!q) return reply(urlneed.replace('🎵🎥', '🎥'));

        const [url, type] = q.split(' ');
        if (!url || !['video', 'document'].includes(type)) {
            return reply("*🎥 Please provide a valid YouTube URL and type (video/document)*");
        }

        const apiUrl = `${apiBase}/download/ytmp4?url=${encodeURIComponent(url)}`;
        const res = await fetchJson(apiUrl);
        if (res.status !== 200 || !res.success || !res.result.download_url) {
            return reply("*Failed to fetch video. Try again later 😔*");
        }

        const downloadUrl = res.result.download_url;
        const search = await yts(url);
        const data = search.videos[0];

        await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });

        if (type === 'video') {
            await conn.sendMessage(from, {
                video: { url: downloadUrl },
                mimetype: "video/mp4",
                caption: `> *${data.title}*\n${config.FOOTER}`,
                contextInfo: {
                    externalAdReply: {
                        title: data.title,
                        body: data.videoId,
                        mediaType: 2,
                        sourceUrl: data.url,
                        thumbnailUrl: data.thumbnail,
                        renderLargerThumbnail: true,
                        showAdAttribution: true
                    }
                }
            }, { quoted: mek });
        } else if (type === 'document') {
            await conn.sendMessage(from, {
                document: { url: downloadUrl },
                mimetype: "video/mp4",
                fileName: `${data.title}.mp4`,
                caption: `> *${data.title}*\n${config.FOOTER}`
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '📤', key: mek.key } });

    } catch (e) {
        reply('*ERROR*');
        console.log(e);
    }
});

// YT command (Combined audio and video search/download)
cmd({
    pattern: "yt",
    alias: ["ytdl"],
    use: ".yt <song/video name or YouTube URL>",
    react: "🎶🎥",
    desc: ytDesc,
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

            const msg = `*┃* 📝 \`Title\` : ${data.title}
*┃* 📈 \`Views\` : ${data.views}
*┃* ⏱️ \`Duration\` : ${data.timestamp}
*┃* 📅 \`Uploaded\` : ${data.ago}
*┃* 🔗 \`URL\` : ${data.url}`;

            const buttons = [
                { buttonId: `${prefix}ytdl ${query} audio audio`, buttonText: { displayText: "🎧 Download Audio" }, type: 1 },
                { buttonId: `${prefix}ytdl ${query} audio document`, buttonText: { displayText: "📁 Audio Document" }, type: 1 },
                { buttonId: `${prefix}ytdl ${query} audio voice`, buttonText: { displayText: "🎤 Download Voice" }, type: 1 },
                { buttonId: `${prefix}ytdl ${query} video video`, buttonText: { displayText: "🎬 Download Video" }, type: 1 },
                { buttonId: `${prefix}ytdl ${query} video document`, buttonText: { displayText: "📁 Video Document" }, type: 1 }
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
                buttonId: `.ytinfo ${item.url}`,
                buttonText: { displayText: `${item.title}` },
                type: 1
            }));

            const buttonMessage = {
                image: { url: defaultPreview },
                caption: `*🔎 𝗬𝗧 𝘀𝗲𝗮𝗿𝗰𝗵 𝗿𝗲𝘀𝘂𝗹𝘁𝘀*\n\n \`Input :\` _${q}_`,
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

// YT info command
cmd({
    pattern: "ytinfo",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, prefix, quoted, reply }) => {
    try {
        if (!q) return reply(urlneed);

        const search = await yts(q);
        if (!search.videos || search.videos.length === 0) return reply(N_FOUND);

        const data = search.videos[0];

        const msg = `*┃* 📝 \`Title\` : ${data.title}
*┃* 📈 \`Views\` : ${data.views}
*┃* ⏱️ \`Duration\` : ${data.timestamp}
*┃* 📅 \`Uploaded\` : ${data.ago}
*┃* 🔗 \`URL\` : ${data.url}`;

        const buttons = [
            { buttonId: `${prefix}ytdl ${q} audio audio`, buttonText: { displayText: "🎧 Download Audio" }, type: 1 },
            { buttonId: `${prefix}ytdl ${q} audio document`, buttonText: { displayText: "📁 Audio Document" }, type: 1 },
            { buttonId: `${prefix}ytdl ${q} audio voice`, buttonText: { displayText: "🎤 Download Voice" }, type: 1 },
            { buttonId: `${prefix}ytdl ${q} video video`, buttonText: { displayText: "🎬 Download Video" }, type: 1 },
            { buttonId: `${prefix}ytdl ${q} video document`, buttonText: { displayText: "📁 Video Document" }, type: 1 }
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

// YT download command
cmd({
    pattern: "ytdl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, quoted, reply }) => {
    try {
        if (!q) return reply(urlneed);

        const [url, mediaType, type] = q.split(' ');
        if (!url || !['audio', 'video'].includes(mediaType) || !['audio', 'document', 'voice'].includes(type)) {
            return reply("*🎶🎥 Please provide a valid YouTube URL, media type (audio/video), and type (audio/document/voice)*");
        }

        const search = await yts(url);
        if (!search.videos || search.videos.length === 0) return reply(N_FOUND);
        const data = search.videos[0];

        await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });

        if (mediaType === 'audio') {
            const apiUrl = `${apiBase}/download/ytmp3?url=${encodeURIComponent(url)}`;
            const res = await fetchJson(apiUrl);
            if (res.status !== 200 || !res.success || !res.result.download_url) return reply("*Failed to fetch audio. Try again later 😔*");

            const downloadUrl = res.result.download_url;

            if (type === 'audio') {
                await conn.sendMessage(from, {
                    audio: { url: downloadUrl },
                    mimetype: "audio/mpeg",
                    contextInfo: {
                        externalAdReply: {
                            title: data.title,
                            body: data.videoId,
                            mediaType: 1,
                            sourceUrl: data.url,
                            thumbnailUrl: data.thumbnail,
                            renderLargerThumbnail: true,
                            showAdAttribution: true
                        }
                    }
                }, { quoted: mek });
            } else if (type === 'document') {
                await conn.sendMessage(from, {
                    document: { url: downloadUrl },
                    mimetype: "audio/mp3",
                    fileName: `${data.title}.mp3`,
                    caption: `> *${data.title}*\n${config.FOOTER}`
                }, { quoted: mek });
            } else if (type === 'voice') {
                await conn.sendMessage(from, {
                    audio: { url: downloadUrl },
                    mimetype: "audio/mpeg",
                    ptt: true,
                    contextInfo: {
                        externalAdReply: {
                            title: data.title,
                            body: data.videoId,
                            mediaType: 1,
                            sourceUrl: data.url,
                            thumbnailUrl: data.thumbnail,
                            renderLargerThumbnail: true,
                            showAdAttribution: true
                        }
                    }
                }, { quoted: mek });
            }
        } else if (mediaType === 'video') {
            const apiUrl = `${apiBase}/download/ytmp4?url=${encodeURIComponent(url)}`;
            const res = await fetchJson(apiUrl);
            if (res.status !== 200 || !res.success || !res.result.download_url) {
                return reply("*Failed to fetch video. Try again later 😔*");
            }

            const downloadUrl = res.result.download_url;

            if (type === 'video') {
                await conn.sendMessage(from, {
                    video: { url: downloadUrl },
                    mimetype: "video/mp4",
                    caption: `> *${data.title}*\n${config.FOOTER}`,
                    contextInfo: {
                        externalAdReply: {
                            title: data.title,
                            body: data.videoId,
                            mediaType: 2,
                            sourceUrl: data.url,
                            thumbnailUrl: data.thumbnail,
                            renderLargerThumbnail: true,
                            showAdAttribution: true
                        }
                    }
                }, { quoted: mek });
            } else if (type === 'document') {
                await conn.sendMessage(from, {
                    document: { url: downloadUrl },
                    mimetype: "video/mp4",
                    fileName: `${data.title}.mp4`,
                    caption: `> *${data.title}*\n${config.FOOTER}`
                }, { quoted: mek });
            }
        }

        await conn.sendMessage(from, { react: { text: '📤', key: mek.key } });

    } catch (e) {
        reply('*ERROR*');
        console.log(e);
    }
});
