const { cmd } = require('../lib/command');
const config = require('../settings');
const axios = require('axios');

let apkInfoMap = {};
let apkLastMsgKey = null;
let apkConnRef = null;

cmd({
    pattern: "apk",
    alias: ["apksearch", "apkd", "apkdl"],
    desc: "Search and download Android APKs (list view & direct download!)",
    react: "📱",
    category: "downloader",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        apkConnRef = conn;
        const query = args.join(" ");
        if (!query) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key }});
            return reply('*Type the app name to search for an APK!*\nEx: `.apk whatsapp`');
        }

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        // 1. Search APK
        const searchUrl = `https://bk9.fun/search/apk?q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(searchUrl);

        if (!data?.status || !Array.isArray(data.BK9) || data.BK9.length === 0) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key }});
            return reply("❌ *No APK found for your search. Try another keyword!*");
        }

        // List Message (works for many items, unlike "buttons")
        const results = data.BK9;
        const sections = [
          {
            title: "🔎 APK Search Results",
            rows: results.map((app, i) => ({
              title: app.name,
              rowId: `.apkdl_${app.id}`,
              description: `#${i+1} | ${app.id}`
            }))
          }
        ];

        const sentMsg = await conn.sendMessage(from, {
          text: `🔍 *Found ${results.length} APK(s)*\nSelect an app to download below.\n\n_Powered by your bot_`,
          footer: config.footer, // Your custom footer
          title: "APK Downloader",
          buttonText: "Select APK",
          sections
        }, { quoted: mek });

        apkLastMsgKey = sentMsg?.key?.id ?? null;
        if (apkLastMsgKey) apkInfoMap[apkLastMsgKey] = results;

        await conn.sendMessage(from, { react: { text: "✅", key: sentMsg.key }});
    } catch (e) {
        console.log(e);
        await apkConnRef.sendMessage(from, { react: { text: "❌", key: mek.key }});
        reply("*ERROR ❗❗*");
    }
});

// Button/list reply handler for APK download
if (!global.__apkButtonHandler) {
    global.__apkButtonHandler = true;
    const { setTimeout } = require('timers');
    function waitForApkConn() {
        if (!apkConnRef) return setTimeout(waitForApkConn, 500);
        apkConnRef.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages?.[0];
            if (!msg || !msg.key) return;

            // List selection (rowId)
            if (msg.message && msg.message.listResponseMessage) {
                const selected = msg.message.listResponseMessage.singleSelectReply?.selectedRowId?.trim();
                if (!selected || !selected.startsWith('.apkdl_')) return;

                const pkgId = selected.replace('.apkdl_', '');
                await apkConnRef.sendMessage(msg.key.remoteJid, { react: { text: "⏬", key: msg.key }});

                // Download info
                const dlUrl = `https://bk9.fun/download/apk?id=${encodeURIComponent(pkgId)}`;
                try {
                    const { data } = await axios.get(dlUrl);
                    if (!data?.status || !data.BK9) {
                        await apkConnRef.sendMessage(msg.key.remoteJid, { text: "❌ Download info not found!" }, { quoted: msg });
                        return;
                    }
                    const info = data.BK9;
                    const dlMsg = `*📦 APK Download Info*\n━━━━━━━━━━━━━━━━━━
*Name:* ${info.name}
*Package:* \`${info.package}\`
*Last Update:* ${info.lastup}
━━━━━━━━━━━━━━━━━━
⬇️ *Downloading...*
━━━━━━━━━━━━━━━━━━
Created by Hiranya Sathsara`; // You can customize this owner field if needed

                    await apkConnRef.sendMessage(msg.key.remoteJid, {
                        image: { url: config.LOGO }, // Your custom logo
                        caption: dlMsg,
                        footer: config.footer // Your custom footer
                    }, { quoted: msg });

                    await apkConnRef.sendMessage(msg.key.remoteJid, {
                        document: { url: info.dllink },
                        mimetype: "application/vnd.android.package-archive",
                        fileName: `${info.name.replace(/[^a-zA-Z0-9]/g, "_")}.apk`
                    }, { quoted: msg });

                    await apkConnRef.sendMessage(msg.key.remoteJid, { react: { text: "✅", key: msg.key }});
                } catch (err) {
                    await apkConnRef.sendMessage(msg.key.remoteJid, { text: "❌ Error fetching download info!", quoted: msg });
                }
            }
        });
    }
    waitForApkConn();
}
