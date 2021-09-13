export class Playlist {
  title: string;
  channelTitle: string;
  publishedAt: string;
  count: string;
  thumbnail: string;
  id: string;

  constructor(title: string, channelTitle: string, publishedAt: string, count: string, thumbnail: string, id: string) {
    this.title = title;
    this.channelTitle = channelTitle;
    this.publishedAt = publishedAt;
    this.count = count;
    this.thumbnail = thumbnail;
    this.id = id;
  }
}
