<template>
  <div style="height: 100%">
    <v-row style="height: 100%" v-if="selectedMethod == ''">
      <!-- Google Login button -->
      <v-col
        style="height: 100%; padding: 0px; padding-top: 40%; text-align: center; cursor: pointer"
        @mouseover="onHoverGL = 'sideBarNavigatorIconOnHover'"
        @mouseleave="onHoverGL = 'sideBarNavigatorIcon'"
        @click="useGoogle()"
      >
        <v-icon dark large :color="onHoverGL">mdi-google-chrome</v-icon>
        <v-card-title :style="'color: var(--v-' + onHoverGL + '-base); display: block;'"> Google Login </v-card-title>
      </v-col>

      <v-divider vertical dark> </v-divider>

      <!-- Just scrape -->
      <v-col
        style="height: 100%; padding: 0px; padding-top: 40%; text-align: center; cursor: pointer"
        @mouseover="onHoverJS = 'sideBarNavigatorIconOnHover'"
        @mouseleave="onHoverJS = 'sideBarNavigatorIcon'"
        @click="useScraper()"
      >
        <v-icon dark large :color="onHoverJS">mdi-spider-thread</v-icon>
        <v-card-title :style="'color: var(--v-' + onHoverJS + '-base); display: block;'"> Just Scrape </v-card-title>
      </v-col>
    </v-row>

    <div v-else-if="selectedMethod == 'google'" style="height: 100%">
      <div v-if="!hasAccess">
        <div
          style="
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
          "
        >
          <v-progress-circular :size="70" :width="7" color="white" indeterminate></v-progress-circular>
          <v-card-title style="color: var(--v-sideBarNavigatorIcon-base); word-break: break-word">
            Please Complete Chrome Authentication
          </v-card-title>
        </div>
      </div>
      <div style="height: 100%" v-else>
        <YtmPlaylistTable @click:refresh="refreshPlaylists()" @click:add="addPlaylist" style="height: 100%" />
      </div>
    </div>

    <YtmScraper v-else-if="selectedMethod == 'scraper'" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import StoreApi from '../api/storeApi';
import YtmPlaylistTable from '@/core/components/YtmPlaylistsTable.vue';
import YtmScraper from '@/core/components/YtmScraper.vue';
import YtmApi from '@/core/api/ytmApi';

export default Vue.extend({
  name: 'Youtube',
  components: {YtmPlaylistTable, YtmScraper},
  computed: {
    hasAccess: {
      get() {
        return StoreApi.getState().authentication.google.hasAccess;
      },
      set(val: boolean) {
        StoreApi.setItem('authentication.google.hasAccess', val);
      },
    },
    selectedMethod: {
      get() {
        return StoreApi.getState().ytMusic.selectedMethod;
      },
      set(val: string) {
        StoreApi.setItem('ytMusic.selectedMethod', val);
      },
    },
  },
  mounted() {
    // If you a user has already authenticated we updated the selected method to 'google'
    if (StoreApi.getState().authentication.google.hasAccess) {
      this.selectedMethod = 'google';
    }
  },
  methods: {
    useGoogle() {
      this.selectedMethod = 'google';
      this.authenticate();
    },
    useScraper() {
      this.selectedMethod = 'scraper';
    },
    addPlaylist(id: string) {
      StoreApi.progressBarActive(true);
      YtmApi.getInstance()
        .getAllTracksFromPlaylist(id)
        .then((d) => {
          StoreApi.progressBarActive(false);
          StoreApi.addTracks(d);
        });
    },
    refreshPlaylists() {
      StoreApi.progressBarActive(true);
      YtmApi.getInstance()
        .getAllPlaylists()
        .then((d) => {
          StoreApi.progressBarActive(false);
          StoreApi.setYTMPlaylists(d);
        })
        .catch(() => {
          StoreApi.progressBarActive(false);
        });
    },
    authenticate() {
      YtmApi.getInstance()
        .authenticate()
        .then(
          () => {
            this.hasAccess = true;
            this.refreshPlaylists();
          },
          (e) => {
            this.selectedMethod = '';
            this.hasAccess = false;
            StoreApi.newNotification(e);
          }
        );
    },
  },
  data: () => ({
    loggedIn: false,
    navigationIconColor: 'sideBarNavigatorIcon',
    onHoverGL: 'sideBarNavigatorIcon',
    onHoverJS: 'sideBarNavigatorIcon',
  }),
});
</script>
<style>
.track-table .v-data-footer {
  height: 32px !important;
}

.track-table .v-data-footer__select {
  height: 32px !important;
}
</style>
