const { CreatePlug } = require('../lib/commands');
const fetch = require('node-fetch');

CreatePlug({
  command: 'apk',
  category: 'download',
  desc: 'Search and download APK',
  execute: async (message, conn, match) => {
    try {
      // Ensure a search query exists
      if (!match) {
        if (message.quoted?.text) {
          match = message.quoted.text; // Use quoted text if available
        } else {
          return message.reply('_Please provide the app name or reply to a message with it._');
        }
      }

      // React to user message
      await message.react('🔎');

      // Search for the APK
      const searchUrl = `https://bk9.fun/search/apk?q=${encodeURIComponent(match)}`;
      const searchResult = await fetch(searchUrl).then(res => res.json());

      // Handle no results
      if (!searchResult?.BK9 || searchResult.BK9.length === 0) {
        return message.reply(`_No results found for "${match}". Please try again._`);
      }

      // Prepare APK list
      let apkList = '*Search Results:*\n\n';
      searchResult.BK9.forEach((apk, index) => {
        apkList += `${index + 1}. ${apk.name}\n`;
      });
      apkList += '\n_Reply with the number to download._';

      // Store results temporarily
      const senderId = message.sender;
      global.apkSearchResults = global.apkSearchResults || {};
      global.apkSearchResults[senderId] = searchResult.BK9;

      // Send list to user
      return message.reply(apkList);
    } catch (error) {
      console.error(error);
      message.reply('_An error occurred while searching for the APK._');
    }
  },

  on: async (message, conn) => {
    try {
      // Check if user replied with a number
      const senderId = message.sender;
      const userResults = global.apkSearchResults?.[senderId];
      if (!userResults) return;

      const number = parseInt(message.body.trim(), 10);
      if (isNaN(number) || number < 1 || number > userResults.length) {
        return message.reply('_Invalid selection. Please reply with a valid number._');
      }

      // Get the selected APK
      const selectedApk = userResults[number - 1];
      const downloadUrl = `https://bk9.fun/download/apk?id=${selectedApk.id}`;
      const downloadResult = await fetch(downloadUrl).then(res => res.json());

      // Ensure download link exists
      if (!downloadResult?.BK9?.dllink) {
        return message.reply('_Failed to retrieve download link. Please try again later._');
      }

      // Send the APK file
      const apkDetails = {
        document: { url: downloadResult.BK9.dllink },
        fileName: selectedApk.name,
        mimetype: 'application/vnd.android.package-archive',
        caption: `*${selectedApk.name}*\nDownloaded with ❤️.`,
      };
      await conn.sendMessage(message.user, apkDetails, { quoted: message });

      // Clean up temporary results
      delete global.apkSearchResults[senderId];
    } catch (error) {
      console.error(error);
      message.reply('_An error occurred while processing your request._');
    }
  },
});
      
