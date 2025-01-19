async function fetchSoundCloudDetails(url) {
  const search = `https://api.siputzx.my.id/api/d/soundcloud?url=${url}`;
  const res = await fetch(apiUrl);
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

  return { success: false, message: 'Failed to fetch details.' };
}

async function fetchCapCutDetails(capcutUrl) {
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

  return { success: false, message: 'Failed to fetch details.' };
}

