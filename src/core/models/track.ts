export class Track {
  title: string;
  artist: string;
  album: string;
  length: string;
  thumbnail: string;
  description: string;
  ytmId: string;
  spotifyId: string;

  constructor(
    title: string,
    artist: string,
    album: string,
    length: string,
    thumbnail: string,
    description: string,
    ytmId: string,
    spotifyId: string
  ) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.length = length;
    this.thumbnail = thumbnail;
    this.description = description;
    this.ytmId = ytmId;
    this.spotifyId = spotifyId;
  }
}
