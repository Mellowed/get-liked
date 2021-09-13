<template>
  <div style="height: 100%" v-if="selectedMethod == ''">
    <div
      style="height: 100%; padding: 0px; padding-top: 40%; text-align: center; cursor: pointer"
      @mouseover="onHoverGL = 'sideBarNavigatorIconOnHover'"
      @mouseleave="onHoverGL = 'sideBarNavigatorIcon'"
      @click="useSpotify()"
    >
      <v-icon dark large :color="onHoverGL">mdi-spotify</v-icon>
      <v-card-title :style="'color: var(--v-' + onHoverGL + '-base); display: block;'"> Spotify Login </v-card-title>
    </div>
  </div>

  <div v-else-if="selectedMethod == 'spotify'" style="height: 100%">
    <div v-if="!hasAccess">
      <div
        style="margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center"
      >
        <v-progress-circular :size="70" :width="7" color="white" indeterminate></v-progress-circular>
        <v-card-title style="color: var(--v-sideBarNavigatorIcon-base); word-break: break-word">
          Please Complete Spotify Authentication
        </v-card-title>
      </div>
    </div>
    <div style="height: 100%" v-else>
      <SpotifyPlaylistCreation />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import StoreApi from '../api/storeApi';
import SpotifyApi from '@/core/api/spotifyApi';
import SpotifyPlaylistCreation from '@/core/components/SpotifyPlaylistCreation.vue';
import {Track} from '../models/track';

export default Vue.extend({
  name: 'Spotify',
  components: {SpotifyPlaylistCreation},
  data: () => ({
    playlistName: 'New Playlist',
    mappedTracksCount: 0,
    loggedIn: false,
    navigationIconColor: 'sideBarNavigatorIcon',
    onHoverGL: 'sideBarNavigatorIcon',
    onHoverJS: 'sideBarNavigatorIcon',
  }),
  computed: {
    selectedMethod: {
      get() {
        return StoreApi.getState().spotify.selectedMethod;
      },
      set(val: string) {
        StoreApi.setItem('spotify.selectedMethod', val);
      },
    },
    hasAccess() {
      return StoreApi.getState().authentication.spotify.hasAccess;
    },
    tracks(): Array<Track> {
      return StoreApi.getState().tracks;
    },
  },
  mounted() {
    // Updated the selected method to 'spotify' if a user has already authenticated.
    if (StoreApi.getState().authentication.spotify.hasAccess) {
      this.selectedMethod = 'spotify';
    }
  },
  methods: {
    useSpotify() {
      this.selectedMethod = 'spotify';
      this.authenticate();
    },
    authenticate() {
      SpotifyApi.getInstance()
        .authenticate()
        .then(
          () => {
            StoreApi.setItem('authentication.spotify.hasAccess', true);
            SpotifyApi.getInstance().getPlaylists();
          },
          (e) => {
            this.selectedMethod = '';
            StoreApi.setItem('authentication.spotify.hasAccess', false);
            StoreApi.newNotification(e);
          }
        );
    },
  },
});
</script>
