const { CreatePlug } = require('../lib/commands');
const fetch = require('node-fetch');
const CONFIG = require('../config');

CreatePlug({
  command: 'apk',
  category: 'download',
  desc: 'Search and download APKs',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_Please provide the app name to search for._');
    await message.react('🔍');

    // Perform search
    const searchUrl = `https://bk9.fun/search/apk?q=${match}`;
    const searchResults = await fetch(searchUrl).then(res => res.json()).catch(err => null);

    if (!searchResults || !searchResults.BK9 || searchResults.BK9.length === 0) {
      return message.reply('_No results found. Try a different search term._');
    }

    // Send the numbered list of results
    let resultList = '*Search Results:*\n';
    searchResults.BK9.forEach((apk, index) => {
      resultList += `${index + 1}. ${apk.name}\n`;
    });
    resultList += '\n_Reply with the number of the APK to download._';

    // Attach search results to the message for dynamic context
    message.reply(resultList, {
      contextInfo: {
        quotedMessage: {
          results: searchResults.BK9.map(apk => ({ id: apk.id, name: apk.name })),
        },
      },
    });
  },
});

CreatePlug({
  on: true, // Handles replies to the `apk` command
  execute: async (message, conn) => {
    if (!message.quoted || !message.quoted.contextInfo || !message.quoted.contextInfo.results) return;

    const results = message.quoted.contextInfo.results;
    const selectedNumber = parseInt(message.body.trim());
    if (isNaN(selectedNumber) || selectedNumber < 1 || selectedNumber > results.length) {
      return message.reply('_Invalid selection. Please reply with a valid number._');
    }

    const selectedApk = results[selectedNumber - 1];
    const downloadUrl = `https://bk9.fun/download/apk?id=${selectedApk.id}`;

    // Fetch download link
    const downloadResponse = await fetch(downloadUrl).then(res => res.json()).catch(err => null);
    if (!downloadResponse || !downloadResponse.BK9 || !downloadResponse.BK9.dllink) {
      return message.reply('_Error fetching the APK download link._');
    }

    // Send APK file
    const apkDetails = {
      document: { url: downloadResponse.BK9.dllink },
      fileName: selectedApk.name,
      mimetype: "application/vnd.android.package-archive",
      caption: `*${selectedApk.name}*\nDownloaded successfully!`,
    };
    await conn.sendMessage(message.user, apkDetails, { quoted: message });
  },
});
    
