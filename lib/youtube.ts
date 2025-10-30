export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    // Handle standard watch URL: https://www.youtube.com/watch?v=VIDEOID
    const v = u.searchParams.get('v');
    if (v && v.length === 11) return v;

    // Handle youtu.be short links: https://youtu.be/VIDEOID
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id && id.length === 11) return id;
    }

    // Handle embed: https://www.youtube.com/embed/VIDEOID
    if (u.pathname.startsWith('/embed/')) {
      const id = u.pathname.split('/')[2];
      if (id && id.length === 11) return id;
    }

    // Handle shorts: https://www.youtube.com/shorts/VIDEOID
    if (u.pathname.startsWith('/shorts/')) {
      const id = u.pathname.split('/')[2];
      if (id && id.length === 11) return id;
    }

    // Handle /live/VIDEOID
    if (u.pathname.startsWith('/live/')) {
      const id = u.pathname.split('/')[2];
      if (id && id.length === 11) return id;
    }

    // Fallback regex for odd cases
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  } catch {
    return null;
  }
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getYouTubeEmbedFromUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  return id ? getYouTubeEmbedUrl(id) : null;
}

export function isYouTubeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be');
  } catch {
    return false;
  }
}
