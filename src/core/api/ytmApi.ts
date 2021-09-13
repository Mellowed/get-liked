import {Track} from '@/core/models/track';
import {Playlist} from '../models/playlist';
import {ConversionUtil} from '../utils/conversion';

export default class YtmApi {
  /**
   * We setup the Youtube Music API as a singleton.
   * This helps preserver and reuse the api token.
   */
  private static instance: YtmApi;
  private static requestInit: object;
  private static token: string;
  private constructor() {}

  public static getInstance(): YtmApi {
    if (!YtmApi.instance) {
      YtmApi.instance = new YtmApi();
    }
    return YtmApi.instance;
  }

  // Playlist item queries

  /**
   *
   * Get all the tracks from a playlist.
   *
   * The googleapis has a limit of 50 results per a query.
   * We therefore use the pageToken and  recursively call 'getPlaylistItems' to build the Array<tracks> results set.
   *
   * @param playlistId
   */
  public getAllTracksFromPlaylist(playlistId: string): Promise<Array<Track>> {
    let tracks: Array<Track> = [];
    return new Promise((resolve) => {
      let nextPageToken: any = undefined;
      let turtle = (npt: any) => {
        YtmApi.getInstance()
          .getPlaylistItems(playlistId, npt)
          .then((d) => {
            let x = ConversionUtil.YoutubeResponseToTracks(d);
            tracks.push(...x);
            if (d.nextPageToken) {
              nextPageToken = d.nextPageToken;
              turtle(nextPageToken);
            } else {
              resolve(tracks);
            }
          });
      };
      turtle(nextPageToken);
    });
  }

  public getPlaylistItems(playlistId: string, pageToken?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(
        'https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=' +
          playlistId +
          (pageToken ? '&pageToken=' + pageToken : ''),
        YtmApi.requestInit
      )
        .then((response) => response.json())
        .then(function(data) {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // Playlist queries

  public getAllPlaylists(): Promise<Array<Playlist>> {
    return new Promise((resolve) => {
      let playlists: Array<Playlist> = [];

      // The  'Your Likes' playlist does not appear in the getPlaylists response.
      // Therefore we build a playlist object by requesting the playlistItems where the ID = 'LM' which contains the total count
      YtmApi.getInstance()
        .getPlaylistItems('LM')
        .then((d) => {
          playlists.push(
            new Playlist(
              'Your Likes',
              '',
              '',
              d.pageInfo.totalResults,
              'https://www.gstatic.com/youtube/media/ytm/images/pbg/liked-songs-@576.png',
              'LM'
            )
          );
        });

      let nextPageToken: any = undefined;
      let turtle = (npt: any) => {
        YtmApi.getInstance()
          .getPlaylists(npt)
          .then((d) => {
            let x = ConversionUtil.YoutubeResponseToPlaylist(d);
            playlists.push(...x);
            if (d.nextPageToken) {
              nextPageToken = d.nextPageToken;
              turtle(nextPageToken);
            } else {
              resolve(playlists);
            }
          });
      };
      turtle(nextPageToken);
    });
  }

  public getPlaylists(pageToken?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(
        'https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=50&mine=true' +
          (pageToken ? '&pageToken=' + pageToken : ''),
        YtmApi.requestInit
      )
        .then((response) => response.json())
        .then(function(data) {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // Management queries

  public validateToken(token: String) {
    return new Promise((resolve, reject) => {
      fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token, YtmApi.requestInit)
        .then((response) => response.json())
        .then(function(data) {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public clearTokenCache() {
    chrome.identity.removeCachedAuthToken({token: YtmApi.token});
    YtmApi.token = '';
    YtmApi.requestInit = {};
  }

  /**
   * The Identity API caches access tokens in memory, so it's ok to call getAuthToken non-interactively
   * any time a token is required. The token cache automatically handles expiration.
   *
   * https://developer.chrome.com/docs/extensions/reference/identity/#method-getAuthToken
   */
  public authenticate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({interactive: true}, (token) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        }

        if (token) {
          YtmApi.getInstance()
            .validateToken(token)
            .then((d: any) => {
              if (d.error !== 'invalid_token') {
                YtmApi.token = token;
                YtmApi.requestInit = {
                  method: 'GET',
                  async: true,
                  headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json',
                  },
                  contentType: 'json',
                };
                resolve(true);
              } else {
                YtmApi.token = '';
                reject('Login Failed: Invalid google token received');
              }
            });
        } else {
          reject('Login Failed: No token');
        }
      });
    });
  }
}
