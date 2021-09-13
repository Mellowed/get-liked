import { Playlist } from '@/core/models/playlist';
import { Track } from '@/core/models/track';
import store from '@/store';
import type * as ss from '@/store/state';

export default class StoreApi {
  public static getState(): ss.State {
    return store.getters['getState'];
  }

  // Youtube Music

  public static setYTMPlaylists(data: Array<Playlist>): void{
    store.dispatch('setYTMPlaylists', data)
  }

  public static addYtmMergedPlaylistId(data: String): void{
    store.dispatch('addYtmMergedPlaylistId', data)
  }

  public static clearYtmMergedPlaylistIds(): void{
    store.dispatch('clearYtmMergedPlaylistIds')
  }

  // Spotify

  public static setSpotifyPlaylists(data: Array<Playlist>): void{
    store.dispatch('setSpotifyPlaylists', data)
  }

  // Global

  public static setTracks(data: Array<Track>): void{
    store.dispatch('setTracks', data)
  }

  public static addTracks(data: Array<Track>): void{
    store.dispatch('addTracks', data)
  }

  public static progressBarActive(data: boolean): void{
    store.dispatch('progressBarActive', data)
  }

  public static newNotification(message: string): void{
    this.pushItem('notifications', message)
  }

  //  General

  /**
   * Lazy setItem
   * set an item in the store by describing its path and parsing a value. 
   * 
   * e.g. setItem(data {'authentication.google.username', 'bob' })
   * 
   * @param data 
   */
  public static setItem(path: string, value: any): void{
    let data = {path: path, value: value};
    store.dispatch('setItem', data);
  }

    /**
   * Lazy pushItem
   * Add to an item in the store by describing its path and parsing a value. 
   * 
   * e.g. pushItem(data {'notifications', 'Error detected' })
   * 
   * @param data 
   */
  public static pushItem(path: string, value: any): void{
    let data = {path: path, value: value};
    store.dispatch('pushItem', data);
  }
  
}