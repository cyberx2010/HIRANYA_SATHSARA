const { cmd, commands } = require('../lib/command');
const config = require('../settings')

cmd({
    pattern: "downmenu",
    react: "⬇👨‍💻",
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let menuc = `*● ══════════════ ●*

   *HIRAN-MD DOWNLOAD COMMANDS MENU*\n\n`
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'download'){
  if(!commands[i].dontAddCommandList){
menuc += `*📍➣Command :* ${commands[i].pattern}
*📃➣Desc :* ${commands[i].desc}
*⌛➣Use:* ${commands[i].use}\n\n`
}}};

let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'ʙᴏᴛ ꜱᴄʀɪᴘᴛ'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'ʜɪʀᴀɴ-ᴍᴅ ꜱᴘᴇᴇᴅ'
    },
    type: 1
  }]
  let buttonMessaged = {
    image: { url: `https://files.catbox.moe/yulkqj.jpeg` },
    caption: menuc,
    footer: `Pᴏᴡᴇʀᴇᴅ Bʏ Hɪʀᴀɴ-Mᴅ◎Cʀᴇᴀᴛᴇᴅ Bʏ Hɪʀᴀɴʏᴀ Sᴀᴛʜꜱᴀʀᴀ`,
    headerType: 4,
    buttons: generatebutton
  };
  return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
  reply('*ERROR !!*')
  l(e)
}
})


cmd({
    pattern: "searchmenu",
    react: "👨‍💻",
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let menuc = `*● ══════════════ ●*

   *HIRAN-MD SEARCH COMMANDS MENU*\n\n`
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'search'){
  if(!commands[i].dontAddCommandList){
menuc += `*📍➣Command :* ${commands[i].pattern}
*📃➣Desc :* ${commands[i].desc}
*⌛➣Use:* ${commands[i].use}\n\n`
}}};
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'ʙᴏᴛ ꜱᴄʀɪᴘᴛ'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'ʜɪʀᴀɴ-ᴍᴅ ꜱᴘᴇᴇᴅ'
    },
    type: 1
  }]
  let buttonMessaged = {
    image: { url: `https://files.catbox.moe/45v9fl.jpeg` },
    caption: menuc,
    footer: `Pᴏᴡᴇʀᴇᴅ Bʏ Hɪʀᴀɴ-Mᴅ◎Cʀᴇᴀᴛᴇᴅ Bʏ Hɪʀᴀɴʏᴀ Sᴀᴛʜꜱᴀʀᴀ`,
    headerType: 4,
    buttons: generatebutton
  };
  return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
  reply('*ERROR !!*')
  l(e)
}
})


cmd({
    pattern: "convertmenu",
    react: "👨‍💻",
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let menuc = `*● ══════════════ ●*

   *HIRAN-MD CONVERT COMMANDS MENU*\n\n`
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'convert'){
  if(!commands[i].dontAddCommandList){
menuc += `*📍➣Command :* ${commands[i].pattern}
*📃➣Desc :* ${commands[i].desc}
*⌛➣Use:* ${commands[i].use}\n\n`
}}};
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'ʙᴏᴛ ꜱᴄʀɪᴘᴛ'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'ʜɪʀᴀɴ-ᴍᴅ ꜱᴘᴇᴇᴅ'
    },
    type: 1
  }]
  let buttonMessaged = {
    image: { url: `https://files.catbox.moe/p2yb5e.jpeg` },
    caption: menuc,
    footer: `Pᴏᴡᴇʀᴇᴅ Bʏ Hɪʀᴀɴ-Mᴅ◎Cʀᴇᴀᴛᴇᴅ Bʏ Hɪʀᴀɴʏᴀ Sᴀᴛʜꜱᴀʀᴀ`,
    headerType: 4,
    buttons: generatebutton
  };
  return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
  reply('*ERROR !!*')
  l(e)
}
})



cmd({
    pattern: "logomenu",
    react: "👨‍💻",
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let menuc = `*● ══════════════ ●*

   *HIRAN-MD LOGO COMMANDS MENU*\n\n`
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'logo'){
if(!commands[i].dontAddCommandList){
menuc += `*📍➣Command :* ${commands[i].pattern}
*📃➣Desc :* ${commands[i].desc}
*⌛➣Use:* ${commands[i].use}\n\n`
}}};
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'ʙᴏᴛ ꜱᴄʀɪᴘᴛ'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'ʜɪʀᴀɴ-ᴍᴅ ꜱᴘᴇᴇᴅ'
    },
    type: 1
  }]
  let buttonMessaged = {
    image: { url: `https://files.catbox.moe/chdr8d.jpeg` },
    caption: menuc,
    footer: `Pᴏᴡᴇʀᴇᴅ Bʏ Hɪʀᴀɴ-Mᴅ◎Cʀᴇᴀᴛᴇᴅ Bʏ Hɪʀᴀɴʏᴀ Sᴀᴛʜꜱᴀʀᴀ`,
    headerType: 4,
    buttons: generatebutton
  };
  return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
  reply('*ERROR !!*')
  l(e)
}
})


cmd({
  pattern: "ownermenu",
  react: "👨‍💻",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let menuc = `*● ══════════════ ●*

   *HIRAN-MD OWNER COMMANDS MENU*\n\n`
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'owner'){
if(!commands[i].dontAddCommandList){
menuc += `*📍➣Command :* ${commands[i].pattern}
*📃➣Desc :* ${commands[i].desc}
*⌛➣Use:* ${commands[i].use}\n\n`
}}};
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'ʙᴏᴛ ꜱᴄʀɪᴘᴛ'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'ʜɪʀᴀɴ-ᴍᴅ ꜱᴘᴇᴇᴅ'
    },
    type: 1
  }]
  let buttonMessaged = {
    image: { url: `https://files.catbox.moe/1ehbuu.jpeg` },
    caption: menuc,
    footer: `Pᴏᴡᴇʀᴇᴅ Bʏ Hɪʀᴀɴ-Mᴅ◎Cʀᴇᴀᴛᴇᴅ Bʏ Hɪʀᴀɴʏᴀ Sᴀᴛʜꜱᴀʀᴀ`,
    headerType: 4,
    buttons: generatebutton
  };
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})



cmd({
  pattern: "adminmenu",
  react: "👨‍💻",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let menuc = `*● ══════════════ ●*

   *HIRAN-MD ADMIN COMMANDS MENU*\n\n`
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'admin'){
if(!commands[i].dontAddCommandList){
menuc += `*📍➣Command :* ${commands[i].pattern}
*📃➣Desc :* ${commands[i].desc}
*⌛➣Use:* ${commands[i].use}\n\n`
}}};
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'ʙᴏᴛ ꜱᴄʀɪᴘᴛ'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'ʜɪʀᴀɴ-ᴍᴅ ꜱᴘᴇᴇᴅ'
    },
    type: 1
  }]
  let buttonMessaged = {
    image: { url: `https://files.catbox.moe/cui6r8.jpeg` },
    caption: menuc,
    footer: `Pᴏᴡᴇʀᴇᴅ Bʏ Hɪʀᴀɴ-Mᴅ◎Cʀᴇᴀᴛᴇᴅ Bʏ Hɪʀᴀɴʏᴀ Sᴀᴛʜꜱᴀʀᴀ`,
    headerType: 4,
    buttons: generatebutton
  };
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})


cmd({
  pattern: "othermenu",
  react: "👨‍💻",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let menuc = `*● ══════════════ ●*

   *HIRAN-MD OTHER COMMANDS MENU*\n\n`
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'other'){
if(!commands[i].dontAddCommandList){
menuc += `*📍➣Command :* ${commands[i].pattern}
*📃➣Desc :* ${commands[i].desc}
*⌛➣Use:* ${commands[i].use}\n\n`
}}};
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'ʙᴏᴛ ꜱᴄʀɪᴘᴛ'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'ʜɪʀᴀɴ-ᴍᴅ ꜱᴘᴇᴇᴅ'
    },
    type: 1
  }]
  let buttonMessaged = {
    image: { url: `https://files.catbox.moe/q2zi7a.jpeg` },
    caption: menuc,
    footer: `Pᴏᴡᴇʀᴇᴅ Bʏ Hɪʀᴀɴ-Mᴅ◎Cʀᴇᴀᴛᴇᴅ Bʏ Hɪʀᴀɴʏᴀ Sᴀᴛʜꜱᴀʀᴀ`,
    headerType: 4,
    buttons: generatebutton
  };
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})
 

cmd({
  pattern: "moviemenu",
  react: "👨‍💻",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let menuc = `*● ══════════════ ●*

   *HIRAN-MD MOVIE COMMANDS MENU*\n\n`
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'movie'){
if(!commands[i].dontAddCommandList){
menuc += `*📍➣Command :* ${commands[i].pattern}
*📃➣Desc :* ${commands[i].desc}
*⌛➣Use:* ${commands[i].use}\n\n`
}}};
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'ʙᴏᴛ ꜱᴄʀɪᴘᴛ'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'ʜɪʀᴀɴ-ᴍᴅ ꜱᴘᴇᴇᴅ'
    },
    type: 1
  }]
  let buttonMessaged = {
    image: { url: `https://files.catbox.moe/rz5sj0.jpeg` },
    caption: menuc,
    footer: `Pᴏᴡᴇʀᴇᴅ Bʏ Hɪʀᴀɴ-Mᴅ◎Cʀᴇᴀᴛᴇᴅ Bʏ Hɪʀᴀɴʏᴀ Sᴀᴛʜꜱᴀʀᴀ`,
    headerType: 4,
    buttons: generatebutton
  };
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})
 

cmd({
  pattern: "groupmenu",
  react: "👨‍💻",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let menuc = `*● ══════════════ ●*

   *HIRAN-MD GROUP COMMANDS MENU*\n\n`
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'group'){
if(!commands[i].dontAddCommandList){
menuc += `*📍➣Command :* ${commands[i].pattern}
*📃➣Desc :* ${commands[i].desc}
*⌛➣Use:* ${commands[i].use}\n\n`
}}};
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'ʙᴏᴛ ꜱᴄʀɪᴘᴛ'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'ʜɪʀᴀɴ-ᴍᴅ ꜱᴘᴇᴇᴅ'
    },
    type: 1
  }]
  let buttonMessaged = {
    image: { url: `https://files.catbox.moe/ebes3s.jpeg` },
    caption: menuc,
    footer: `Pᴏᴡᴇʀᴇᴅ Bʏ Hɪʀᴀɴ-Mᴅ◎Cʀᴇᴀᴛᴇᴅ Bʏ Hɪʀᴀɴʏᴀ Sᴀᴛʜꜱᴀʀᴀ`,
    headerType: 4,
    buttons: generatebutton
  };
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})
 

