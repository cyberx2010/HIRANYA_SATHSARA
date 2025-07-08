const fetch = require('node-fetch');
const axios = require('axios');
const config = require('../settings');

const userName = `${config.GITHUB_USER_NAME}`;
const token = `ghp_${config.GITHUB_AUTH_TOKEN}`;
const repoName = "HIRAN-MD-DB";

// Function to fetch data from GitHub API
async function githubApiRequest(url, method = 'GET', data = {}) {
  try {
    const options = {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(`${userName}:${token}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    };

    if (method === 'GET' || method === 'HEAD') {
      delete options.body;
    } else {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    throw new Error(`GitHub API request failed: ${error.message}`);
  }
}

async function checkRepoAvailability() {
  try {
    const apiUrl = `https://api.github.com/repos/${userName}/${repoName}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(apiUrl, { headers });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false;
    } else {
      console.error('Error:', error.message);
    }
  }
}

// 1. Function to search GitHub file
async function githubSearchFile(filePath, fileName) {
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}?ref=main`;
  const data = await githubApiRequest(url);
  return data.find((file) => file.name === fileName);
}

// 2. Function to create a new GitHub file
async function githubCreateNewFile(filePath, fileName, content) {
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}/${fileName}`;
  const data = {
    message: `Create new file: ${fileName}`,
    content: Buffer.from(content).toString('base64'),
  };
  return await githubApiRequest(url, 'PUT', data);
}

// 3. Function to delete a GitHub file
async function githubDeleteFile(filePath, fileName) {
  const file = await githubSearchFile(filePath, fileName);
  if (!file) throw new Error('File not found on GitHub.');
  
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}/${fileName}`;
  const data = {
    message: `Delete file: ${fileName}`,
    sha: file.sha,
  };
  await githubApiRequest(url, 'DELETE', data);
}

// 4. Function to get GitHub file content
async function githubGetFileContent(filePath, fileName) {
  const file = await githubSearchFile(filePath, fileName);
  if (!file) throw new Error('File not found on GitHub.');
  
  const url = file.download_url;
  const response = await fetch(url);
  return await response.text();
}

// 5. Function to clear GitHub file content and add new content
async function githubClearAndWriteFile(filePath, fileName, content) {
  const file = await githubSearchFile(filePath, fileName);
  if (!file) {
    await githubCreateNewFile(filePath, fileName, content);
  } else {
    const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}/${fileName}`;
    const data = {
      message: `Modify file: ${fileName}`,
      content: Buffer.from(content).toString('base64'),
      sha: file.sha,
    };
    return await githubApiRequest(url, 'PUT', data);
  }
}

// 6. Function to delete an existing GitHub file and upload a new one
async function githubDeleteAndUploadFile(fileName, newContent) {
  await githubDeleteFile(fileName);
  await githubCreateNewFile(fileName, newContent);
}

//========================================
async function updateCMDStore(MsgID, CmdID) {
  try { 
    let olds = JSON.parse(await githubGetFileContent("Non-Btn", 'data.json'));
    olds.push({ [MsgID]: CmdID });
    var add = await githubClearAndWriteFile('Non-Btn', 'data.json', JSON.stringify(olds, null, 2));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function isbtnID(MsgID) {
  try {
    let olds = JSON.parse(await githubGetFileContent("Non-Btn", 'data.json'));
    let foundData = null;
    for (const item of olds) {
      if (item[MsgID]) {
        foundData = item[MsgID];
        break;
      }
    }
    if (foundData) return true;
    else return false;
  } catch (e) {
    return false;
  }
}

async function getCMDStore(MsgID) {
  try { 
    let olds = JSON.parse(await githubGetFileContent("Non-Btn", 'data.json'));
    let foundData = null;
    for (const item of olds) {
      if (item[MsgID]) {
        foundData = item[MsgID];
        break;
      }
    }
    return foundData;
  } catch (e) {
    console.log(e);
    return false;
  }
} 

function getCmdForCmdId(CMD_ID_MAP, cmdId) {
  const result = CMD_ID_MAP.find((entry) => entry.cmdId === cmdId);
  return result ? result.cmd : null;
}

const connectdb = async () => {
  let availabilityrepo = await checkRepoAvailability();
  if (!availabilityrepo) {
    const response = await axios.post(
      'https://api.github.com/user/repos',
      {
        name: repoName,
        private: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let get = {
      LANG: 'EN',
      AUTO_RECORDING: false,
      ANTI_BAD: false,
      CHAT_BOT: false,
      PREFIX: '.',
      AUTO_READ_STATUS: true,
      AUTO_REACT_STATUS: false,
      AUTO_BLOCK: false,
      ANTI_CALL: false,
      ONLY_GROUP: false,
      ANTI_LINK: false,
      AUTO_BIO: true,
      JID_BLOCK: [],
      ANTI_BOT: false,
      ANTI_DELETE: false,
      AUTO_REACT: false,
      AUTO_TYPING: false,
      READ_CMD: false,
      OWNER_REAT: true,
      ONLY_ME: true,
      ALWAYS_ONLINE: false,
      MODE: 'public',
      ALIVE: 'default',
      FOOTER: '> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*',
      MV_FOOTER: '> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*',
      OWNER_NUMBER: '94768698018',
      LOGO: `https://files.catbox.moe/lmyrtr.jpeg`,
      MV_JID: '',
      CSONG_SEND_JID: ''
    };

    let olds = [];
    await githubCreateNewFile("settings", "settings.json", JSON.stringify(get));
    await githubCreateNewFile("Non-Btn", "data.json", JSON.stringify(olds));
    console.log(`Database "${repoName}" created successfully 🛢️`);
  } else {
    console.log("Database connected 🛢️");
  }
};

async function input(setting, data) {
  let get = JSON.parse(await githubGetFileContent("settings", "settings.json"));
 
  if (setting == "AUTO_RECORDING") {
    get.AUTO_RECORDING = data;
    config.AUTO_RECORDING = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "ANTI_BAD") {
    get.ANTI_BAD = data;
    config.ANTI_BAD = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "AUTO_READ_STATUS") {
    get.AUTO_READ_STATUS = data;
    config.AUTO_READ_STATUS = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "AUTO_REACT_STATUS") {
    get.AUTO_REACT_STATUS = data;
    config.AUTO_REACT_STATUS = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "ONLY_GROUP") {
    get.ONLY_GROUP = data;
    config.ONLY_GROUP = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "MODE") {
    get.MODE = data;
    config.MODE = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "ANTI_LINK") {
    get.ANTI_LINK = data;
    config.ANTI_LINK = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "ANTI_BOT") {
    get.ANTI_BOT = data;
    config.ANTI_BOT = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "AUTO_TYPING") {
    get.AUTO_TYPING = data;
    config.AUTO_TYPING = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "FOOTER") {
    get.FOOTER = data;
    config.FOOTER = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "MV_FOOTER") {
    get.MV_FOOTER = data;
    config.MV_FOOTER = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "LOGO") {
    get.LOGO = data;
    config.LOGO = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "PREFIX") {
    get.PREFIX = data;
    config.PREFIX = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "ALIVE") {
    get.ALIVE = data;
    config.ALIVE = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "READ_CMD") {
    get.READ_CMD = data;
    config.READ_CMD = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "ALWAYS_ONLINE") {
    get.ALWAYS_ONLINE = data;
    config.ALWAYS_ONLINE = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "AUTO_BLOCK") {
    get.AUTO_BLOCK = data;
    config.AUTO_BLOCK = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "ANTI_CALL") {
    get.ANTI_CALL = data;
    config.ANTI_CALL = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "AUTO_REACT") {
    get.AUTO_REACT = data;
    config.AUTO_REACT = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "OWNER_NUMBER") {
    get.OWNER_NUMBER = data;
    config.OWNER_NUMBER = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "OWNER_REAT") {
    get.OWNER_REAT = data;
    config.OWNER_REAT = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "LANG") {
    get.LANG = data;
    config.LANG = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "ANTI_DELETE") {
    get.ANTI_DELETE = data;
    config.ANTI_DELETE = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "ONLY_ME") {
    get.ONLY_ME = data;
    config.ONLY_ME = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "CHAT_BOT") {
    get.CHAT_BOT = data;
    config.CHAT_BOT = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "AUTO_BIO") {
    get.AUTO_BIO = data;
    config.AUTO_BIO = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "JID_BLOCK") {
    get.JID_BLOCK = data;
    config.JID_BLOCK = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "MV_JID") {
    get.MV_JID = data;
    config.MV_JID = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } else if (setting == "CSONG_SEND_JID") {
    get.CSONG_SEND_JID = data;
    config.CSONG_SEND_JID = data;
    return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));
  } 
}

async function get(setting) {
  let get = JSON.parse(await githubGetFileContent("settings", "settings.json"));
 
  if (setting == "AUTO_RECORDING") {
    return get.AUTO_RECORDING;
  } else if (setting == "ANTI_BAD") {
    return get.ANTI_BAD;
  } else if (setting == "AUTO_READ_STATUS") {
    return get.AUTO_READ_STATUS;
  } else if (setting == "AUTO_REACT_STATUS") {
    return get.AUTO_REACT_STATUS;
  } else if (setting == "ONLY_GROUP") {
    return get.ONLY_GROUP;
  } else if (setting == "MODE") {
    return get.MODE;
  } else if (setting == "ANTI_LINK") {
    return get.ANTI_LINK;
  } else if (setting == "ANTI_BOT") {
    return get.ANTI_BOT;
  } else if (setting == "AUTO_TYPING") {
    return get.AUTO_TYPING;
  } else if (setting == "FOOTER") {
    return get.FOOTER;
  } else if (setting == "MV_FOOTER") {
    return get.MV_FOOTER;
  } else if (setting == "LOGO") {
    return get.LOGO;
  } else if (setting == "PREFIX") {
    return get.PREFIX;
  } else if (setting == "ALIVE") {
    return get.ALIVE;
  } else if (setting == "READ_CMD") {
    return get.READ_CMD;
  } else if (setting == "ALWAYS_ONLINE") {
    return get.ALWAYS_ONLINE;
  } else if (setting == "AUTO_BLOCK") {
    return get.AUTO_BLOCK;
  } else if (setting == "ANTI_CALL") {
    return get.ANTI_CALL;
  } else if (setting == "AUTO_REACT") {
    return get.AUTO_REACT;
  } else if (setting == "OWNER_NUMBER") {
    return get.OWNER_NUMBER;
  } else if (setting == "OWNER_REAT") {
    return get.OWNER_REAT;
  } else if (setting == "LANG") {
    return get.LANG;
  } else if (setting == "ANTI_DELETE") {
    return get.ANTI_DELETE;
  } else if (setting == "ONLY_ME") {
    return get.ONLY_ME;
  } else if (setting == "CHAT_BOT") {
    return get.CHAT_BOT;
  } else if (setting == "AUTO_BIO") {
    return get.AUTO_BIO;
  } else if (setting == "JID_BLOCK") {
    return get.JID_BLOCK;
  } else if (setting == "MV_JID") {
    return get.MV_JID;
  } else if (setting == "CSONG_SEND_JID") {
    return get.CSONG_SEND_JID;
  } 
}

async function updb() {
  let get = JSON.parse(await githubGetFileContent("settings", "settings.json"));
  config.LANG = get.LANG;
  config.AUTO_RECORDING = get.AUTO_RECORDING;
  config.AUTO_READ_STATUS = get.AUTO_READ_STATUS;
  config.AUTO_REACT_STATUS = get.AUTO_REACT_STATUS;
  config.AUTO_TYPING = get.AUTO_TYPING;
  config.ALIVE = get.ALIVE;
  config.ANTI_CALL = get.ANTI_CALL;
  config.FOOTER = get.FOOTER;
  config.MV_FOOTER = get.MV_FOOTER;
  config.READ_CMD = get.READ_CMD;
  config.PREFIX = get.PREFIX;
  config.LOGO = get.LOGO;
  config.ANTI_BAD = get.ANTI_BAD;
  config.ONLY_GROUP = get.ONLY_GROUP;
  config.MODE = get.MODE;
  config.AUTO_REACT = get.AUTO_REACT;
  config.AUTO_BIO = get.AUTO_BIO;
  config.JID_BLOCK = get.JID_BLOCK;
  config.AUTO_BLOCK = get.AUTO_BLOCK;
  config.ALWAYS_ONLINE = get.ALWAYS_ONLINE;
  config.ANTI_LINK = get.ANTI_LINK;
  config.ANTI_BOT = get.ANTI_BOT;
  config.OWNER_REAT = get.OWNER_REAT;
  config.ANTI_DELETE = get.ANTI_DELETE;
  config.CHAT_BOT = get.CHAT_BOT;
  config.OWNER_NUMBER = get.OWNER_NUMBER;
  config.ONLY_ME = get.ONLY_ME;
  config.MV_JID = get.MV_JID;
  config.CSONG_SEND_JID = get.CSONG_SEND_JID;
  console.log("Database writed ✅");
}

async function updfb() {
  let get = {
    LANG: 'EN',
    AUTO_RECORDING: false,
    ANTI_BAD: false,
    AUTO_READ_STATUS: true,
    AUTO_REACT_STATUS: false,
    ANTI_CALL: false,
    ALWAYS_ONLINE: false,
    AUTO_REACT: false,
    ONLY_GROUP: false,
    AUTO_BIO: true,
    JID_BLOCK: [],
    ANTI_LINK: false,
    OWNER_REAT: true,
    ANTI_DELETE: false,
    PREFIX: '.',
    ANTI_BOT: false,
    CHAT_BOT: false,
    ALIVE: 'default',
    AUTO_TYPING: false,
    AUTO_BLOCK: false,
    ONLY_ME: true,
    READ_CMD: false,
    MODE: 'public',
    FOOTER: '> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*',
    MV_FOOTER: '> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*',
    OWNER_NUMBER: '94768698018',
    LOGO: `https://files.catbox.moe/lmyrtr.jpeg`,
    MV_JID: '',
    CSONG_SEND_JID: ''
  };
  await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(get));

  config.LANG = 'EN';
  config.AUTO_RECORDING = false;
  config.ALWAYS_ONLINE = false;
  config.AUTO_READ_STATUS = true;
  config.AUTO_REACT_STATUS = false;
  config.ANTI_CALL = false;
  config.AUTO_TYPING = false;
  config.AUTO_BLOCK = false;
  config.OWNER_REAT = true;
  config.AUTO_REACT = false;
  config.ONLY_ME = true;
  config.MODE = 'public';
  config.FOOTER = '> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*';
  config.MV_FOOTER = '> *© 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐇ɪʀᴀɴ-𝐌ᴅ 🧚🪄*';
  config.OWNER_NUMBER = '94768698018';
  config.ALIVE = 'default';
  config.PREFIX = '.';
  config.LOGO = `https://files.catbox.moe/lmyrtr.jpeg`;
  config.ANTI_BAD = false;
  config.ONLY_GROUP = false;
  config.ANTI_DELETE = false;
  config.AUTO_BIO = true;
  config.JID_BLOCK = [];
  config.READ_CMD = false;
  config.ANTI_LINK = false;
  config.ANTI_BOT = false;
  config.CHAT_BOT = false;
  config.MV_JID = '';
  config.CSONG_SEND_JID = '';
  console.log("Database writed ✅");
}

module.exports = { updateCMDStore, isbtnID, getCMDStore, getCmdForCmdId, connectdb, input, get, updb, updfb };
