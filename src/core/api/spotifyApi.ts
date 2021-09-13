import SpotifyWebApi from 'spotify-web-api-js';
import { ConversionUtil } from '../utils/conversion';

export default class SpotifyApi {
  /**
   * We setup the Youtube Music API as a singleton.
   * This helps preserver and reuse the api token.
   */
  private static instance: SpotifyApi;
  private static requestInit: object;
  private static token: string;
  private static userId: string;
  private static spotifyWebApi = new SpotifyWebApi();

  private constructor() { }

  public static getInstance(): SpotifyApi {
    if (!SpotifyApi.instance) {
      SpotifyApi.instance = new SpotifyApi();
    }
    return SpotifyApi.instance;
  }

  /**
   *  We need to manually build and fetch the user profile As the 'spotify-web-api-js'
   *  has no profile requests method. The result is used to update the userId.
   *
   */
  public getCurrentUserProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch('https://api.spotify.com/v1/me', SpotifyApi.requestInit)
        .then((response) => response.json())
        .then(function (data) {
          SpotifyApi.userId = data.id;
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public searchForTrackWithFilters(title: string, artist?: string, album?: string) {
    return new Promise((resolve, reject) => {
      let query = title;
      query += artist ? ' artist:' + artist : '';
      query += album ? ' album:' + album : '';

      // We should measure performance differences between open query and parameterized query
      SpotifyApi.getInstance()
        .searchForTrack(query)
        .then((d) => {
          resolve(d);
        })
        .catch((err) => reject(err));
    });
  }

  public searchForTrack(query: string) {
    return new Promise((resolve, reject) => {
      SpotifyApi.spotifyWebApi.searchTracks(query).then(
        function (data) {
          resolve(data);
        },
        function (err) {
          reject(err);
        }
      );
    });
  }

  /**
   *
   * @param playlistId
   * @param uris limit of 100 items
   */
  public addTracksToPlaylist(playlistId: string, uris: Array<string>) {
    return new Promise((resolve, reject) => {
      SpotifyApi.spotifyWebApi.addTracksToPlaylist(playlistId, uris).then(
        function (data) {
          resolve(data);
        },
        function (err) {
          reject(err);
        }
      );
    });
  }

  public createNewPlaylist(name: string, description: string): Promise<string> {
    return new Promise((resolve) => {
      SpotifyApi.spotifyWebApi
        .createPlaylist(SpotifyApi.userId, {
          name: name,
          description: description,
          public: false,
        })
        .then((d) => resolve(d.id));
    });
  }

  public getPlaylists(): Promise<any> {
    return new Promise((resolve, reject) => {
      SpotifyApi.spotifyWebApi.getUserPlaylists().then(
        function (d) {
          let playlists = ConversionUtil.spotifyResponseToPlaylist(d);
          resolve(playlists);
        },
        function (err) {
          reject(err);
        }
      );
    });
  }

  /**
   * The Identity API caches access tokens in memory, so it's ok to call getAuthToken non-interactively
   * any time a token is required. The token cache automatically handles expiration.
   *
   * https://developer.chrome.com/docs/extensions/reference/identity/#method-getAuthToken
   */
  public authenticate(): Promise<boolean> {
    let client_id = 'YourClientId';
    let redirectUri = chrome.identity.getRedirectURL() + 'spotify';
    let scopes = 'playlist-modify-public playlist-modify-private playlist-read-private user-read-private';
    // var redirectUri = chrome.identity.getRedirectURL('spotify');
    return new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        {
          url:
            'https://accounts.spotify.com/authorize?client_id=' +
            client_id +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' +
            encodeURIComponent(redirectUri) +
            '&response_type=token',
          interactive: true,
        },
        (redirect_url) => {
          if (redirect_url) {
            // To use the URLSearchParams interface we need to split the response url by the '#' and prepend a '?'
            var urlParams = new URL(redirect_url.split('#').join('?')).searchParams;
            // First check that there are no errors in the response
            if (urlParams.has('error')) {
              reject('Login Failed: Failed to authenticate with Spotify');
            }
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError.message);
            }
            // check that the access_token token exists, if so set the global spotify token and resolve
            let access_token = urlParams.get('access_token');
            if (access_token) {
              SpotifyApi.token = access_token;
              SpotifyApi.spotifyWebApi.setAccessToken(access_token);
              // construct the requestInit which is used to manually build api requests.
              SpotifyApi.requestInit = {
                method: 'GET',
                async: true,
                headers: {
                  Authorization: 'Bearer ' + access_token,
                  'Content-Type': 'application/json',
                },
                contentType: 'json',
              };
              // We require the 'userId' to manage playlists. Collect it by querying the current user profile.
              SpotifyApi.getInstance().getCurrentUserProfile();
            } else {
              reject('Login Failed: Failed to retrieve token from redirect url');
            }
            resolve(true);
          } else {
            reject('Login Failed: Failed to authenticate with Spotify: Undefined redirect url');
          }
        }
      );
    });
  }
}
