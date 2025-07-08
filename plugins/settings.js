const config = require('../settings');
const { cmd, commands } = require('../lib/command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');
const { updateCMDStore, isbtnID, getCMDStore, getCmdForCmdId, connectdb, input, get, updb, updfb } = require("../lib/database");

var tesadtag = config.LANG === 'SI' ? '*මට settings update කිරීමට text එකක් දෙන්න. !*' : '*Give me text to update settings !*';
var desc1 = config.LANG === 'SI' ? "එය groups settings fetures යාවත්කාලීන කරයි." : "It updates groups setting features.";
var desc2 = config.LANG === 'SI' ? "එය bot's settings යාවත්කාලීන කරයි." : "It updates bot's settings.";
var desc3 = config.LANG === 'SI' ? "එය bot's configs යාවත්කාලීන කරයි." : "It updates bot's configs.";
var ONLGROUP = config.LANG === 'SI' ? "*මෙය group එකක් නොවේ !*" : "*This is not a group !*";
var ADMIN = config.LANG === 'SI' ? "*ඔබ admin නොවේ !*" : "*You are not an admin !*";
var ADMINim = config.LANG === 'SI' ? "*මම admin නොවේ !*" : "*I'm not an admin !*";
var BOTOW = config.LANG === 'SI' ? "*ඔබ Bot's හිමිකරු හෝ උපපරිපාලක නොවේ !*" : "*You are not bot's owner or moderator !*";
var alredy = config.LANG === 'SI' ? "*මෙම සැකසුම දැනටමත් යාවත්කාලීන කර ඇත !*" : "*This setting already updated !*";
var needus = config.LANG === 'SI' ? 'එය දත්ත සමුදාය නැවත සකසයි.' : "It resets database.";

// Group Settings Command
cmd({
    pattern: "group",
    react: "🛡️",
    alias: ["groupset", "groupsettings"],
    desc: desc1,
    category: "owner",
    use: '.group',
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return await reply(ONLGROUP);
        if (!isAdmins) return await reply(ADMIN);
        if (!isBotAdmins) return await reply(ADMINim);

        const sections = [
            {
                title: "Anti Link",
                rows: [
                    { title: 'ON 📲', rowId: '.antilink on' },
                    { title: 'OFF 📴', rowId: '.antilink off' }
                ]
            },
            {
                title: "Anti Bad Words",
                rows: [
                    { title: 'ON 📲', rowId: '.antibad on' },
                    { title: 'OFF 📴', rowId: '.antibad off' }
                ]
            },
            {
                title: "Anti Bots",
                rows: [
                    { title: 'ON 📲', rowId: '.antibot on' },
                    { title: 'OFF 📴', rowId: '.antibot off' }
                ]
            }
        ];
        const listMessage = {
            text: `┌───[🧚 HIRAN-MD 🧚‍♂️]\n│\n│     *GROUP SETTINGS*\n│\n│ _Select setting to enable or disable._\n│`,
            footer: config.FOOTER,
            title: '',
            buttonText: 'Select Option',
            sections,
            image: { url: config.LOGO }
        };
        await conn.sendMessage(from, listMessage, { quoted: mek });
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

// Bot Settings Command
cmd({
    pattern: "settings",
    react: "🛡️",
    alias: ["setting", "botsetting"],
    desc: desc2,
    category: "owner",
    use: '.settings',
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        const sections = [
            {
                title: "Only Group",
                rows: [
                    { title: 'ON 📲', rowId: '.onlygroup on' },
                    { title: 'OFF 📴', rowId: '.onlygroup off' }
                ]
            },
            {
                title: "Language 🗣️",
                rows: [
                    { title: 'English 🇺🇸', rowId: '.lang EN' },
                    { title: 'Sinhala 🇱🇰', rowId: '.lang SI' }
                ]
            },
            {
                title: "Auto Typing",
                rows: [
                    { title: 'ON 📲', rowId: '.autotyping on' },
                    { title: 'OFF 📴', rowId: '.autotyping off' }
                ]
            },
            {
                title: "Mode",
                rows: [
                    { title: 'Public 🌍', rowId: '.mode public' },
                    { title: 'Private 🔒', rowId: '.mode private' }
                ]
            },
            {
                title: "Auto React",
                rows: [
                    { title: 'ON 📲', rowId: '.autoreact on' },
                    { title: 'OFF 📴', rowId: '.autoreact off' }
                ]
            },
            {
                title: "Anti Delete",
                rows: [
                    { title: 'ON 📲', rowId: '.antidelete on' },
                    { title: 'OFF 📴', rowId: '.antidelete off' }
                ]
            },
            {
                title: "Chat Bot",
                rows: [
                    { title: 'ON 📲', rowId: '.chatbot on' },
                    { title: 'OFF 📴', rowId: '.chatbot off' }
                ]
            },
            {
                title: "Auto Recording",
                rows: [
                    { title: 'ON 📲', rowId: '.autorecording on' },
                    { title: 'OFF 📴', rowId: '.autorecording off' }
                ]
            },
            {
                title: "Auto Read Status",
                rows: [
                    { title: 'ON 📲', rowId: '.autoreadstatus on' },
                    { title: 'OFF 📴', rowId: '.autoreadstatus off' }
                ]
            },
            {
                title: "Auto React Status",
                rows: [
                    { title: 'ON 📲', rowId: '.autoreactstatus on' },
                    { title: 'OFF 📴', rowId: '.autoreactstatus off' }
                ]
            },
            {
                title: "Anti Call",
                rows: [
                    { title: 'ON 📲', rowId: '.anticall on' },
                    { title: 'OFF 📴', rowId: '.anticall off' }
                ]
            },
            {
                title: "Always Online",
                rows: [
                    { title: 'ON 📲', rowId: '.alwaysonline on' },
                    { title: 'OFF 📴', rowId: '.alwaysonline off' }
                ]
            },
            {
                title: "Auto Block",
                rows: [
                    { title: 'ON 📲', rowId: '.autoblock on' },
                    { title: 'OFF 📴', rowId: '.autoblock off' }
                ]
            },
            {
                title: "Owner React",
                rows: [
                    { title: 'ON 📲', rowId: '.ownerreact on' },
                    { title: 'OFF 📴', rowId: '.ownerreact off' }
                ]
            },
            {
                title: "Only Me",
                rows: [
                    { title: 'ON 📲', rowId: '.onlyme on' },
                    { title: 'OFF 📴', rowId: '.onlyme off' }
                ]
            },
            {
                title: "Auto Bio",
                rows: [
                    { title: 'ON 📲', rowId: '.autobio on' },
                    { title: 'OFF 📴', rowId: '.autobio off' }
                ]
            },
            {
                title: "Read Command",
                rows: [
                    { title: 'ON 📲', rowId: '.readcmd on' },
                    { title: 'OFF 📴', rowId: '.readcmd off' }
                ]
            },
            {
                title: "Auto Voice",
                rows: [
                    { title: 'ON 📲', rowId: '.autovoice on' },
                    { title: 'OFF 📴', rowId: '.autovoice off' }
                ]
            },
            {
                title: "Auto Reply",
                rows: [
                    { title: 'ON 📲', rowId: '.autoreply on' },
                    { title: 'OFF 📴', rowId: '.autoreply off' }
                ]
            },
            {
                title: "Auto Sticker",
                rows: [
                    { title: 'ON 📲', rowId: '.autosticker on' },
                    { title: 'OFF 📴', rowId: '.autosticker off' }
                ]
            },
            {
                title: "Auto News Sender",
                rows: [
                    { title: 'ON 📲', rowId: '.autonewssender on' },
                    { title: 'OFF 📴', rowId: '.autonewssender off' }
                ]
            },
            {
                title: "Auto TikTok Sender",
                rows: [
                    { title: 'ON 📲', rowId: '.autotiktoksender on' },
                    { title: 'OFF 📴', rowId: '.autotiktoksender off' }
                ]
            }
        ];
        const listMessage = {
            text: `┌───[🧚 HIRAN-MD 🧚‍♂️]\n│\n│     *BOT SETTINGS*\n│\n│ _Select setting to enable or disable._\n│`,
            footer: config.FOOTER,
            title: '',
            buttonText: 'Select Option',
            sections,
            image: { url: config.LOGO }
        };
        await conn.sendMessage(from, listMessage, { quoted: mek });
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

// Config Settings Command
cmd({
    pattern: "apply",
    react: "🛠️",
    alias: ["set", "input"],
    desc: desc3,
    category: "owner",
    use: '.apply <data>',
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        if (!q) return await reply(tesadtag);
        const sections = [
            {
                title: "Max Upload Size",
                rows: [
                    { title: 'DEFAULT 🎲', rowId: '.uploadsz 100' },
                    { title: 'NEW 🌱', rowId: '.uploadsz ' + q }
                ]
            },
            {
                title: "Alive Message",
                rows: [
                    { title: 'DEFAULT 🎲', rowId: '.alivemg default' },
                    { title: 'NEW 🌱', rowId: '.alivemg ' + q }
                ]
            },
            {
                title: "Footer Text / Caption",
                rows: [
                    { title: 'DEFAULT 🎲', rowId: '.footertxt > *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*' },
                    { title: 'NEW 🌱', rowId: '.footertxt ' + q }
                ]
            },
            {
                title: "Movie Footer",
                rows: [
                    { title: 'DEFAULT 🎲', rowId: '.mvfooter ᴜᴘʟᴏᴀᴅᴇᴅ ʙʏ ꜱʟᴍᴠ ᴀᴅᴍɪɴ' },
                    { title: 'NEW 🌱', rowId: '.mvfooter ' + q }
                ]
            },
            {
                title: "Logo",
                rows: [
                    { title: 'DEFAULT 🎲', rowId: '.setlogo https://files.catbox.moe/lmyrtr.jpeg' },
                    { title: 'NEW 🌱', rowId: '.setlogo ' + q }
                ]
            },
            {
                title: "Prefix",
                rows: [
                    { title: 'DEFAULT 🎲', rowId: '.setprefix .' },
                    { title: 'NEW 🌱', rowId: '.setprefix ' + q }
                ]
            },
            {
                title: "Owner Number",
                rows: [
                    { title: 'DEFAULT 🎲', rowId: '.setownernumber 94768698018' },
                    { title: 'NEW 🌱', rowId: '.setownernumber ' + q }
                ]
            },
            {
                title: "Movie JID",
                rows: [
                    { title: 'NEW 🌱', rowId: '.setmv ' + q }
                ]
            },
            {
                title: "News Send JID",
                rows: [
                    { title: 'NEW 🌱', rowId: '.setnews ' + q }
                ]
            },
            {
                title: "TikTok Send JID",
                rows: [
                    { title: 'NEW 🌱', rowId: '.settiktok ' + q }
                ]
            },
            {
                title: "Song Send JID",
                rows: [
                    { title: 'NEW 🌱', rowId: '.setsong ' + q }
                ]
            }
        ];
        const listMessage = {
            text: `┌───[🧚 HIRAN-MD 🧚‍♂️]\n│\n│     *BOT CONFIG*\n│\n│ _Select setting to update._\n│`,
            footer: config.FOOTER,
            title: '',
            buttonText: 'Select Option',
            sections,
            image: { url: config.LOGO }
        };
        await conn.sendMessage(from, listMessage, { quoted: mek });
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

// Group Boolean Setting Commands
cmd({
    pattern: "antilink",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return await reply(ONLGROUP);
        if (!isAdmins) return await reply(ADMIN);
        if (!isBotAdmins) return await reply(ADMINim);
        const isAnti = async (teks) => {
            let getdata = await get(teks);
            return getdata.includes(from);
        };
        if (q === "on") {
            if (await isAnti("ANTI_LINK")) return await reply(alredy);
            let olddata = await get("ANTI_LINK");
            olddata.push(from);
            await input("ANTI_LINK", olddata);
            await reply("*Anti link updated: ON*");
        } else if (q === "off") {
            if (!await isAnti("ANTI_LINK")) return await reply(alredy);
            let olddata = await get("ANTI_LINK");
            olddata = olddata.filter(jid => jid !== from);
            await input("ANTI_LINK", olddata);
            await reply("*Anti link updated: OFF*");
        } else {
            await reply("*Usage: .antilink on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "antibot",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return await reply(ONLGROUP);
        if (!isAdmins) return await reply(ADMIN);
        if (!isBotAdmins) return await reply(ADMINim);
        const isAnti = async (teks) => {
            let getdata = await get(teks);
            return getdata.includes(from);
        };
        if (q === "on") {
            if (await isAnti("ANTI_BOT")) return await reply(alredy);
            let olddata = await get("ANTI_BOT");
            olddata.push(from);
            await input("ANTI_BOT", olddata);
            await reply("*Anti bots updated: ON*");
        } else if (q === "off") {
            if (!await isAnti("ANTI_BOT")) return await reply(alredy);
            let olddata = await get("ANTI_BOT");
            olddata = olddata.filter(jid => jid !== from);
            await input("ANTI_BOT", olddata);
            await reply("*Anti bots updated: OFF*");
        } else {
            await reply("*Usage: .antibot on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "antibad",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return await reply(ONLGROUP);
        if (!isAdmins) return await reply(ADMIN);
        if (!isBotAdmins) return await reply(ADMINim);
        const isAnti = async (teks) => {
            let getdata = await get(teks);
            return getdata.includes(from);
        };
        if (q === "on") {
            if (await isAnti("ANTI_BAD")) return await reply(alredy);
            let olddata = await get("ANTI_BAD");
            olddata.push(from);
            await input("ANTI_BAD", olddata);
            await reply("*Anti bad words updated: ON*");
        } else if (q === "off") {
            if (!await isAnti("ANTI_BAD")) return await reply(alredy);
            let olddata = await get("ANTI_BAD");
            olddata = olddata.filter(jid => jid !== from);
            await input("ANTI_BAD", olddata);
            await reply("*Anti bad words updated: OFF*");
        } else {
            await reply("*Usage: .antibad on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

// Bot Boolean Setting Commands
cmd({
    pattern: "onlygroup",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("ONLY_GROUP");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("ONLY_GROUP", true);
            await reply("*Only group updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("ONLY_GROUP", false);
            await reply("*Only group updated: OFF*");
        } else {
            await reply("*Usage: .onlygroup on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "lang",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("LANG");
        if (q === "EN" || q === "SI") {
            if (gett === q) return await reply(alredy);
            await input("LANG", q);
            await reply("*Language updated: " + q + "*");
        } else {
            await reply("*Usage: .lang EN/SI*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "autotyping",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("AUTO_TYPING");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("AUTO_TYPING", true);
            await reply("*Auto typing updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("AUTO_TYPING", false);
            await reply("*Auto typing updated: OFF*");
        } else {
            await reply("*Usage: .autotyping on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "mode",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("MODE");
        if (q === "public" || q === "private") {
            if (gett === q) return await reply(alredy);
            await input("MODE", q);
            await reply("*Mode updated: " + q.charAt(0).toUpperCase() + q.slice(1) + "*");
        } else {
            await reply("*Usage: .mode public/private*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "autoreact",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("AUTO_REACT");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("AUTO_REACT", true);
            await reply("*Auto react updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("AUTO_REACT", false);
            await reply("*Auto react updated: OFF*");
        } else {
            await reply("*Usage: .autoreact on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "antidelete",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("ANTI_DELETE");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("ANTI_DELETE", true);
            await reply("*Anti delete updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("ANTI_DELETE", false);
            await reply("*Anti delete updated: OFF*");
        } else {
            await reply("*Usage: .antidelete on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "chatbot",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("CHAT_BOT");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("CHAT_BOT", true);
            await reply("*Chat bot updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("CHAT_BOT", false);
            await reply("*Chat bot updated: OFF*");
        } else {
            await reply("*Usage: .chatbot on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "autorecording",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("AUTO_RECORDING");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("AUTO_RECORDING", true);
            await reply("*Auto recording updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("AUTO_RECORDING", false);
            await reply("*Auto recording updated: OFF*");
        } else {
            await reply("*Usage: .autorecording on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "autoreadstatus",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("AUTO_READ_STATUS");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("AUTO_READ_STATUS", true);
            await reply("*Auto read status updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("AUTO_READ_STATUS", false);
            await reply("*Auto read status updated: OFF*");
        } else {
            await reply("*Usage: .autoreadstatus on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "autoreactstatus",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("AUTO_REACT_STATUS");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("AUTO_REACT_STATUS", true);
            await reply("*Auto react status updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("AUTO_REACT_STATUS", false);
            await reply("*Auto react status updated: OFF*");
        } else {
            await reply("*Usage: .autoreactstatus on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "anticall",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("ANTI_CALL");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("ANTI_CALL", true);
            await reply("*Anti call updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("ANTI_CALL", false);
            await reply("*Anti call updated: OFF*");
        } else {
            await reply("*Usage: .anticall on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "alwaysonline",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("ALWAYS_ONLINE");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("ALWAYS_ONLINE", true);
            await reply("*Always online updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("ALWAYS_ONLINE", false);
            await reply("*Always online updated: OFF*");
        } else {
            await reply("*Usage: .alwaysonline on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "autoblock",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("AUTO_BLOCK");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("AUTO_BLOCK", true);
            await reply("*Auto block updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("AUTO_BLOCK", false);
            await reply("*Auto block updated: OFF*");
        } else {
            await reply("*Usage: .autoblock on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "ownerreact",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("OWNER_REAT");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("OWNER_REAT", true);
            await reply("*Owner react updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("OWNER_REAT", false);
            await reply("*Owner react updated: OFF*");
        } else {
            await reply("*Usage: .ownerreact on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "onlyme",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("ONLY_ME");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("ONLY_ME", true);
            await reply("*Only me updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("ONLY_ME", false);
            await reply("*Only me updated: OFF*");
        } else {
            await reply("*Usage: .onlyme on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "autobio",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("AUTO_BIO");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("AUTO_BIO", true);
            await reply("*Auto bio updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("AUTO_BIO", false);
            await reply("*Auto bio updated: OFF*");
        } else {
            await reply("*Usage: .autobio on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "readcmd",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("READ_CMD");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("READ_CMD", true);
            await reply("*Read command updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("READ_CMD", false);
            await reply("*Read command updated: OFF*");
        } else {
            await reply("*Usage: .readcmd on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

// New Bot Boolean Setting Commands
cmd({
    pattern: "autovoice",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("AUTO_VOICE");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("AUTO_VOICE", true);
            await reply("*Auto voice updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("AUTO_VOICE", false);
            await reply("*Auto voice updated: OFF*");
        } else {
            await reply("*Usage: .autovoice on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "autoreply",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("AUTO_REPLY");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("AUTO_REPLY", true);
            await reply("*Auto reply updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("AUTO_REPLY", false);
            await reply("*Auto reply updated: OFF*");
        } else {
            await reply("*Usage: .autoreply on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "autosticker",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("AUTO_STICKER");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("AUTO_STICKER", true);
            await reply("*Auto sticker updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("AUTO_STICKER", false);
            await reply("*Auto sticker updated: OFF*");
        } else {
            await reply("*Usage: .autosticker on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "autonewssender",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("AUTO_NEWS_SENDER");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("AUTO_NEWS_SENDER", true);
            await reply("*Auto news sender updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("AUTO_NEWS_SENDER", false);
            await reply("*Auto news sender updated: OFF*");
        } else {
            await reply("*Usage: .autonewssender on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "autotiktoksender",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("AUTO_TIKTOK_SENDER");
        if (q === "on") {
            if (gett === true) return await reply(alredy);
            await input("AUTO_TIKTOK_SENDER", true);
            await reply("*Auto TikTok sender updated: ON*");
        } else if (q === "off") {
            if (gett === false) return await reply(alredy);
            await input("AUTO_TIKTOK_SENDER", false);
            await reply("*Auto TikTok sender updated: OFF*");
        } else {
            await reply("*Usage: .autotiktoksender on/off*");
        }
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

// Config Setting Commands
cmd({
    pattern: "uploadsz",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        if (!q || isNaN(q)) return await reply("*Usage: .uploadsz <number>*");
        let gett = await get("MAX_SIZE");
        if (gett === Number(q)) return await reply(alredy);
        await input("MAX_SIZE", Number(q));
        await reply("*Max upload size updated: " + q + " MB*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "alivemg",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("ALIVE");
        if (q === "default") q = '*Hey there!* \n\n *HIRAN-MD is LIVE and READY! 💥* \n *Drop a command or ask me anything, and let\'s make things happen!*';
        if (gett === q) return await reply(alredy);
        await input("ALIVE", q);
        await reply("*Alive message updated!*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "footertxt",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("FOOTER");
        if (gett === q) return await reply(alredy);
        await input("FOOTER", q);
        await reply("*Footer updated: " + q + "*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "mvfooter",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        let gett = await get("MV_FOOTER");
        if (gett === q) return await reply(alredy);
        await input("MV_FOOTER", q);
        await reply("*Movie footer updated: " + q + "*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "setlogo",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        if (!q || !isUrl(q)) return await reply("*Usage: .setlogo <valid URL>*");
        let gett = await get("LOGO");
        if (gett === q) return await reply(alredy);
        await input("LOGO", q);
        await reply("*Logo updated!*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "setprefix",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        if (!q || q.length > 1) return await reply("*Usage: .setprefix <single character>*");
        let gett = await get("PREFIX");
        if (gett === q) return await reply(alredy);
        await input("PREFIX", q);
        await reply("*Prefix updated: " + q + "*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "setownernumber",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        if (!q || !/^\d+$/.test(q)) return await reply("*Usage: .setownernumber <phone number>*");
        let gett = await get("OWNER_NUMBER");
        if (gett === q) return await reply(alredy);
        await input("OWNER_NUMBER", q);
        await reply("*Owner number updated: " + q + "*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "setmv",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        if (!q) return await reply("*Usage: .setmvjid <JID>*");
        let gett = await get("MV_JID");
        if (gett === q) return await reply(alredy);
        await input("MV_JID", q);
        await reply("*Movie JID updated: " + q + "*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "setnews",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        if (!q) return await reply("*Usage: .setnewsjid <JID>*");
        let gett = await get("NEWS_SEND_JID");
        if (gett === q) return await reply(alredy);
        await input("NEWS_SEND_JID", q);
        await reply("*News send JID updated: " + q + "*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "settiktok",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        if (!q) return await reply("*Usage: .settiktokjid <JID>*");
        let gett = await get("TIKTOK_SEND_JID");
        if (gett === q) return await reply(alredy);
        await input("TIKTOK_SEND_JID", q);
        await reply("*TikTok send JID updated: " + q + "*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "setsong",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        if (!q) return await reply("*Usage: .setsong <JID>*");
        let gett = await get("CSONG_SEND_JID");
        if (gett === q) return await reply(alredy);
        await input("CSONG_SEND_JID", q);
        await reply("*Song send JID updated: " + q + "*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

// JID Block Commands
cmd({
    pattern: "blockjid",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        if (!q) return await reply("*Usage: .blockjid <JID>*");
        let gett = await get("JID_BLOCK");
        if (gett.includes(q)) return await reply("*JID already blocked!*");
        gett.push(q);
        await input("JID_BLOCK", gett);
        await reply("*JID blocked: " + q + "*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

cmd({
    pattern: "unblockjid",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        if (!q) return await reply("*Usage: .unblockjid <JID>*");
        let gett = await get("JID_BLOCK");
        if (!gett.includes(q)) return await reply("*JID not blocked!*");
        gett = gett.filter(jid => jid !== q);
        await input("JID_BLOCK", gett);
        await reply("*JID unblocked: " + q + "*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});

// Reset Database Command
cmd({
    pattern: "resetdb",
    desc: needus,
    category: "owner",
    use: '.resetdb',
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply(BOTOW);
        await updfb();
        await reply("*Database reset successfully!*");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});
