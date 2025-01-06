async function announcementi(update, conn) {
  const { id, participants, action } = update;
  for (const participant of participants) {
    const zmg = await conn.profilePictureUrl(participant, 'image').catch(() => null);
    const username = participant.split('@')[0];
    let _msg = '';
    if (action === 'promote') {
      _msg = `**Promotion Alert!**\n**Name**: ${username}\nWow new role`;
    } else if (action === 'demote') {
      _msg = `**Demotion Alert!**\n**Name**: ${username}\nBeen adjusted`;}
    if (_msg) {
      if (zmg) {
        await conn.sendMessage(id, { image: { url: zmg }, caption: _msg });
      } else {
        await conn.sendMessage(id, { text: _msg });
      }
    }
  }
}

module.exports = { announcementi };
    
