import {Playlist} from '@/core/models/playlist';
import {Track} from '@/core/models/track';

export class State {
  ytMusic = {
    selectedMethod: '',
    playlists: Array<Playlist>(),
    mergedPlaylists: Array<String>(),
  };
  spotify = {
    selectedMethod: '',
    playlists: Array<Playlist>(),
  };
  tracks = Array<Track>();
  selectedPage = 0;
  progressBarActive = false;
  notifications = Array<string>();
  authentication = {
    google: {
      username: '',
      hasAccess: false,
    },
    spotify: {
      username: '',
      hasAccess: false,
    },
  };
}
