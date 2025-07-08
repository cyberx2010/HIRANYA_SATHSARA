const { readEnv } = require('../lib/database');
const { cmd } = require('../lib/command');
const os = require("os");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, Func, fetchJson } = require('../lib/functions');
const axios = require('axios');
const config = require('../settings');

cmd({
    pattern: "forward",
    desc: "forward messages to multiple jids",
    alias: ["f"],
    category: "owner",
    use: '.forward <jid1,jid2,jid3>',
    filename: __filename
},

async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {

    if (!isOwner) {
        return reply("*Owner Only ❌*");
    }

    if (!q || !m.quoted) {
        return reply("*Please provide JIDs and quote a message ❌*");
    }

    // Split JIDs by comma and trim whitespace
    const jids = q.split(',').map(jid => jid.trim()).filter(jid => jid);

    if (jids.length === 0) {
        return reply("*Please provide valid JIDs ❌*");
    }

    try {
        // Create a copy of the quoted message
        let message = JSON.parse(JSON.stringify(m.quoted.fakeObj || m.quoted));

        // Remove forwarded status safely
        if (message.message?.extendedTextMessage?.contextInfo) {
            message.message.extendedTextMessage.contextInfo.isForwarded = false;
            delete message.message.extendedTextMessage.contextInfo.forwardingScore;
        }
        if (message.message?.conversation?.contextInfo) {
            message.message.conversation.contextInfo.isForwarded = false;
            delete message.message.conversation.contextInfo.forwardingScore;
        }

        // Handle media messages
        let mediaOptions = { quoted: null, contextInfo: { isForwarded: false } };
        if (message.message?.imageMessage || message.message?.documentMessage || message.message?.videoMessage) {
            let mediaType = Object.keys(message.message)[0];
            let mediaMessage = message.message[mediaType];
            if (mediaMessage.url) {
                mediaOptions.url = mediaMessage.url;
            } else if (mediaMessage.fileSha256) {
                mediaOptions.media = await getBuffer(mediaMessage); // Ensure getBuffer is defined
            }
        }

        // Handle document with caption
        if (message.message?.documentWithCaptionMessage?.message?.documentMessage) {
            const mime = message.message.documentWithCaptionMessage.message.documentMessage.mimetype;
            const mimeType = require('mime-types');
            let ext = mimeType.extension(mime);
            message.message.documentWithCaptionMessage.message.documentMessage.fileName = 
                message.message.documentWithCaptionMessage.message.documentMessage.caption + "." + ext;
        }

        // Forward to each JID
        for (let jid of jids) {
            try {
                let newMessage = JSON.parse(JSON.stringify(message));
                await conn.sendMessage(jid, newMessage.message, mediaOptions);
                await reply(`*Message forwarded to: ${jid} ✅*`);
                await sleep(1000); // Delay to prevent spam detection
            } catch (e) {
                await reply(`*Failed to forward to ${jid}: ${e.message} ❌*`);
            }
        }

    } catch (error) {
        await reply(`*Error: ${error.message} ❌*`);
    }
});
