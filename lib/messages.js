const { proto, getContentType, downloadContentFromMessage, jidNormalizedUser } = require('@whiskeysockets/baileys')

const downloadMedia = async (_msg) => {
  let type = Object.keys(_msg)[0]
  let m = _msg[type]
  if (type === 'buttonsMessage' || type === 'viewOnceMessageV2') {
    if (type === 'viewOnceMessageV2') {m = _msg.viewOnceMessageV2?.message 
    type = Object.keys(m || {})[0]} else type = Object.keys(m || {})[1]
    m = m[type]}
  const stream = await downloadContentFromMessage(m, type.replace('Message', ''))
  let buffer = Buffer.from([])
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])
  }
  return buffer
}

function serialize(_msg, con) {
  if (_msg.key) {
    _msg.id = _msg.key.id
    _msg.isSelf = _msg.key.fromMe
    _msg.user = jidNormalizedUser(_msg.key.remoteJid) 
    _msg.isGroup = _msg.user.endsWith('@g.us')
    _msg.sender = _msg.isGroup ? jidNormalizedUser(_msg.key.participant) : _msg.isSelf ? jidNormalizedUser(con.user.id) : _msg.user
    _msg.isAdmin = _msg.isGroup && _msg.isSelf && _msg.user.endsWith('@g.us') 
    _msg.isBotAdmin = _msg.isGroup && _msg.user === jidNormalizedUser(con.user.id) 
  }

  if (_msg.message) {
    _msg.type = getContentType(_msg.message)
    if (_msg.type === 'ephemeralMessage') {
      _msg.message = _msg.message[_msg.type].message
      const tipe = Object.keys(_msg.message)[0]
      _msg.type = tipe
      if (tipe === 'viewOnceMessageV2') {
        _msg.message = _msg.message[_msg.type].message
        _msg.type = getContentType(_msg.message)
      }
    }
    if (_msg.type === 'viewOnceMessageV2') {
      _msg.message = _msg.message[_msg.type].message
      _msg.type = getContentType(_msg.message)
    }
  }

  _msg.messageTypes = (type) => ['videoMessage', 'imageMessage'].includes(type)

  try {
    const quoted = _msg.message[_msg.type]?.contextInfo
    if (quoted.quotedMessage['ephemeralMessage']) {
      const tipe = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0]
      if (tipe === 'viewOnceMessageV2') {
        _msg.quoted = {type: 'view_once',
          stanzaId: quoted.stanzaId,
          participant: jidNormalizedUser(quoted.participant),
          message: quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message}
      } else {
        _msg.quoted = {
          type: 'ephemeral',
          stanzaId: quoted.stanzaId,
          participant: jidNormalizedUser(quoted.participant), 
          message: quoted.quotedMessage.ephemeralMessage.message
        }
      }
    } else if (quoted.quotedMessage['viewOnceMessageV2']) {
      _msg.quoted = {
        type: 'view_once',
        stanzaId: quoted.stanzaId,
        participant: jidNormalizedUser(quoted.participant), 
        message: quoted.quotedMessage.viewOnceMessage.message
      }
    } else {
      _msg.quoted = {
        type: 'normal',
        stanzaId: quoted.stanzaId,
        participant: jidNormalizedUser(quoted.participant), 
        message: quoted.quotedMessage
      }
    }
    _msg.quoted.isSelf = _msg.quoted.participant === jidNormalizedUser(con.user.id) 
    _msg.quoted.mtype = Object.keys(_msg.quoted.message).filter(
      (v) => v.includes('Message') || v.includes('conversation')
    )[0]
    _msg.quoted.text = _msg.quoted.message[_msg.quoted.mtype]?.text ||
    _msg.quoted.message[_msg.quoted.mtype]?.description ||
    _msg.quoted.message[_msg.quoted.mtype]?.caption ||
    _msg.quoted.message[_msg.quoted.mtype]?.hydratedTemplate?.hydratedContentText ||
    _msg.quoted.message[_msg.quoted.mtype] ||
                ''
    _msg.quoted.key = {
      id: _msg.quoted.stanzaId,
      fromMe: _msg.quoted.isSelf,
      remoteJid: _msg.user
    }
    _msg.quoted.download = () => downloadMedia(_msg.quoted.message)
  } catch {
    _msg.quoted = null
  }

  _msg.body = _msg.message?.conversation ||
  _msg.message?.[_msg.type]?.text ||
  _msg.message?.[_msg.type]?.caption ||
  (_msg.type === 'listResponseMessage' && _msg.message?.[_msg.type]?.singleSelectReply?.selectedRowId) ||
  (_msg.type === 'buttonsResponseMessage' && _msg.message?.[_msg.type]?.selectedButtonId) ||
  (_msg.type === 'templateButtonReplyMessage' && _msg.message?.[_msg.type]?.selectedId) ||
            ''
  _msg.reply = (text) =>
  con.sendMessage(_msg.user,{text},{quoted: _msg})
  _msg.download = () => downloadMedia(_msg.message)
  return _msg
}

module.exports = {
  serialize
}
    
