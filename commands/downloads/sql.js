async function SoundCloud(url) {
  const search = `https://api.siputzx.my.id/api/d/soundcloud?url=${url}`;
  const res = await fetch(search);
  if (!res.ok) {
  return { success: false, message: `${res.status}` };
  }
  const data = await res.json();
  if (data.status) {
    return {
      success: true,
      title: data.data.title,
      thumbnail: data.data.thumbnail,
      audioUrl: data.data.url,
    };
  }

  return { success: false, message: 'err' };
}

async function CapCut(capcutUrl) {
  const _api = `https://api.siputzx.my.id/api/d/capcut?url=${capcutUrl}`;
  const response = await fetch(_api);
  if (!response.ok) {
  return { success: false, message: `${response.status}` };
  }
  const data = await response.json();
  if (data.status) {
    return {
      success: true,
      title: data.data.title,
      description: data.data.description,
      usage: data.data.usage,
      originalVideoUrl: data.data.originalVideoUrl,
      coverUrl: data.data.coverUrl,
      authorUrl: data.data.authorUrl,
    };
  }

  return { success: false, message: 'err' };
}

async function MusicApple(musicAppleUrl) {
  const _api = `https://api.siputzx.my.id/api/d/musicapple?url=${musicAppleUrl}`;
  const response = await fetch(_api);
  if (!response.ok) {
  return { success: false, message: `${response.status}` };
  }
  const data = await response.json();
  if (data.status) {
    return {
      success: true,
      url: data.data.url,
      pageTitle: data.data.pageTitle,
      description: data.data.description,
      keywords: data.data.keywords,
      artworkUrl: data.data.artworkUrl,
      appleTitle: data.data.appleTitle,
      appleDescription: data.data.appleDescription,
      musicReleaseDate: data.data.musicReleaseDate,
      mp3DownloadLink: data.data.mp3DownloadLink,
    };
  }

  return { success: false, message: 'err' };
}

async function AppleMusicSearch(query) {
  const _api = `https://api.siputzx.my.id/api/s/applemusic?query=${query}`;
  const voidi = await fetch(_api);
  if (!voidi.ok) {
  return { success: false, message: `${voidi.status}` };
  }
  const data = await voidi.json();
  if (data.status) {
    const results = data.data.result.map(item => ({
      title: item.title,
      artist: item.artist,
      link: item.link,
      image: item.image
    }));
    return {
      success: true,
      results
    };
  }

  return { success: false, message: 'err' };
}

async function YtPost(ytUrl) {
  const ap = `https://api.siputzx.my.id/api/d/ytpost?url=${ytUrl}`;
  const response = await fetch(ap);
  if (!response.ok) {
  return { success: false, message: `${response.status}` };}
  const data = await response.json();
  if (data.status) {
    return {
      success: true,
      postId: data.data.postId,
      content: data.data.content,
      images: data.data.images
    };
  }

  return { success: false, message: 'err' };
}

async function Pinterest(pinterestUrl) {
  const apu = `https://api.siputzx.my.id/api/d/pinterest?url=${pinterestUrl}`;
  const response = await fetch(apu);
  if (!response.ok) {
  return { success: false, message: `HTTP error! Status: ${response.status}` };}
  const data = await response.json();
  if (data.status) {
    return {
      success: true,
      id: data.data.id,
      createdAt: data.data.created_at,
      videoUrl: data.data.url
    };
  }

  return { success: false, message: 'err' };
}

async function SaveFrom(videoUrl) {
  const apu = `https://api.siputzx.my.id/api/d/savefrom?url=${videoUrl}`;
  const response = await fetch(apu);
  if (!response.ok) {
  return { success: false, message: `${response.status}` };
  }
  const data = await response.json();
  if (data.status) {
    return {
      success: true,
      id: data.data[0].id,
      title: data.data[0].meta.title,
      author: data.data[0].meta.author.nickname,
      videoUrl: data.data[0].video_quality.map(quality => ({
        quality,
        url: data.data[0].hd.url
      })),
      thumb: data.data[0].thumb,
      formats: data.data[0].data.map(item => ({
        format: item.name,
        ext: item.ext,
        url: item.url
      }))
    };
  }

  return { success: false, message: 'err' };
}
