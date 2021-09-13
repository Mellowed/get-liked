import {Playlist} from '@/core/models/playlist';
import {Track} from '../core/models/track';
import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './state';
import _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
  state: new types.State(),
  mutations: {
    // Youtube Music
    setYTMPlaylists(state: types.State, item: Array<Playlist>) {
      state.ytMusic.playlists = item;
    },
    addYtmMergedPlaylistId(state: types.State, item: string) {
      state.ytMusic.mergedPlaylists.push(item);
    },
    clearYtmMergedPlaylistIds(state: types.State) {
      state.ytMusic.mergedPlaylists = [];
    },
    // Spotify
    setSpotifyPlaylists(state: types.State, item: Array<Playlist>) {
      state.spotify.playlists = item;
    },
    // Global
    setTracks(state: types.State, item: Array<Track>) {
      state.tracks = item;
    },
    addTracks(state: types.State, item: Array<Track>) {
      state.tracks.push(...item);
    },
    progressBarActive(state: types.State, item: boolean) {
      state.progressBarActive = item;
    },
    // Lazy settings of items
    setItem(state: types.State, data: {path: string; value: any}) {
      _.set(state, data.path, data.value);
    },
    // Lazy pushing of items
    pushItem(state: types.State, data: {path: string; value: any}) {
      _.update(state, data.path, function(n: Array<any>) {
        n.push(data.value);
        return n;
      });
    },
  },
  actions: {
    // Youtube Music
    setYTMPlaylists(context: any, item: Array<Playlist>) {
      context.commit('setYTMPlaylists', item);
    },
    addYtmMergedPlaylistId(context: any, item: string) {
      context.commit('addYtmMergedPlaylistId', item);
    },
    clearYtmMergedPlaylistIds(context: any, item: string) {
      context.commit('clearYtmMergedPlaylistIds', item);
    },
    // Spotify
    setSpotifyPlaylists(context: any, item: Array<Track>) {
      context.commit('setSpotifyPlaylists', item);
    },
    // Global
    setTracks(context: any, item: Array<Track>) {
      context.commit('setTracks', item);
    },
    addTracks(context: any, item: Array<Track>) {
      context.commit('addTracks', item);
    },
    progressBarActive(context: any, item: string) {
      context.commit('progressBarActive', item);
    },
    // Lazy settings of items
    setItem(context: any, data: {path: string; value: any}) {
      context.commit('setItem', data);
    },
    // Lazy pushing of items
    pushItem(context: any, data: {path: string; value: any}) {
      context.commit('pushItem', data);
    },
  },
  modules: {},
  getters: {
    getState: (state: types.State): types.State => {
      return state;
    },
  },
});
