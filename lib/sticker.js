const ffmpeg = require('fluent-ffmpeg');
const webpmux = require('node-webpmux');
const { Buffer } = require('buffer');

function createSticker(baffu, size = '512x512', quality = 80, loop = 0, packname = '❤️NaxorDev', author = 'naxordev') {
  return new Promise((resolve, reject) => {
    let ext;
    try {
      ext = baffu.slice(0, 4).toString('hex'); 
    } catch (err) {
      reject(new Error('invald_media'));}
    let naxor = [];
    let isVideo = false;
    if (ext === '000001b3' || ext === '000001ba') {
      isVideo = true;
    }

    const process = ffmpeg()
      .input(baffu)
      .inputFormat(isVideo ? 'mp4' : 'image2')
      .outputOptions([
        '-vcodec', 'libwebp',
        '-preset', 'default',
        '-loop', loop,  
        '-an', 
        '-f', 'webp',
        '-q:v', quality,
        '-s', size
      ])
      .on('data', (chunk) => naxor.push(chunk))  
      .on('end', () => {
        const final = Buffer.concat(naxor);
        addMetadata(final, packname, author)
          .then(stickerWithMetadata => {
            resolve(stickerWithMetadata);
          })
          .catch(err => reject(new Error(`${err.message}`)));
      })
      .on('error', (err) => reject(new Error(`${err.message}`)))
      .run();
  });
}

function addMetadata(st, packname, author) {
  return new Promise((resolve, reject) => {
    try {
      const sti = webpmux.read(st);
      sti.addMetadata({
        'pack': packname,
        'author': author
      });
      sti.writeToBuffer((err, buffer) => {
        if (err) {
        reject(new Error(`${err.message}`));
        } else {
        resolve(buffer); 
        }
      });
    } catch (err) {
      reject(new Error(`${err.message}`));
    }
  });
}

module.exports = { createSticker };
    
