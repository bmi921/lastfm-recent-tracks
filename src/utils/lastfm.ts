import axios from "axios";

interface LastFMTrack {
  name: string;
  artist: { "#text": string };
  date?: { "#text": string };
}

export const fetchRecentTracks = async (): Promise<LastFMTrack[]> => {
  const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
  const LASTFM_USER = process.env.LASTFM_USER;

  if (!LASTFM_API_KEY || !LASTFM_USER) {
    throw new Error("Last.fm API key or user not set");
  }

  const response = await axios.get(
    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=5`
  );

  return response.data.recenttracks.track;
};
