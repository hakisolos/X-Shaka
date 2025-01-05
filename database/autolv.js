const db = require('quick.db');
const categories = { 
  naruto: ['Hokage', 'Akastuki Clan', 'Madara Uchiha', 'Uchiha', 'Akatsuki', 'Shinobi', 'Sannin', 'Rogue Ninja', 'Sasuke', 'Itachi', 'Naruto', 'Kurama 9tl'],
  dragonBall: ['Son Goku', 'Vegita', 'Jiren', 'Blory', 'Gohan', 'Vegito', 'Gogeta', 'Gotenks', 'Namekian', 'Frieza Force', 'Z Fighter', 'Majin', 'Android', 'Beerus', 'Whis', 'Grand Zeno']
};

function cxl(level) {
  if (level < 5) return categories.naruto[Math.floor(Math.random() * categories.naruto.length)];
  if (level >= 5 && level < 10) return categories.dragonBall[Math.floor(Math.random() * categories.dragonBall.length)];
  return categories.naruto[Math.floor(Math.random() * categories.naruto.length)];}
async function maxUP(message, conn) {
  const contact = message.user; 
  const username = contact.split('@')[0] || 'astral';
  let userXP = db.get(`${contact}.xp`) || 0;
  let userLevel = db.get(`${contact}.level`) || 0;
  userXP += 7;
  const nextLevelXP = 5 * Math.pow(userLevel + 1, 2);
  if (userXP >= nextLevelXP) {
    userLevel += 1;
    userXP -= nextLevelXP;
    db.set(`${contact}.xp`, userXP);
    db.set(`${contact}.level`, userLevel);
    const img = await conn.profilePictureUrl(contact, 'image').catch(() => null);
    const category = cxl(userLevel);
    const maxSend = `🎉 **Level-Up** 🎉\n**Username**: ${username}\n**🎈 Level**: ${userLevel}\n**🎈 Category**: ${category}`;
    if (img) {
      await conn.sendMessage(contact, { image: { url: img }, caption: maxSend });
    } else {
      await conn.sendMessage(contact, { text: maxSend });
    }
  } else {
    db.set(`${contact}.xp`, userXP);
  }}

async function detectACTION(update, conn) {
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

module.exports = { maxUP, detectACTION };
    
