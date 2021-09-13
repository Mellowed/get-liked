<template>
  <v-card dark flat style="height: 100%">
    <v-list subheader two-line>
      <v-card-title>
        <v-icon dark large style="margin-left: 2px; margin-right: 13px">mdi-spider-thread</v-icon> Youtube Music Scraper
      </v-card-title>
      <!-- <v-subheader inset>Youtube Music Scraper</v-subheader> -->
      <v-divider style="margin-left: 10px; margin-right: 10px;"></v-divider>
      <!-- <v-subheader>Steps</v-subheader> -->
      <!-- Open youtube music -->
      <v-list-item>
        <v-list-item-avatar>
          <!-- Checkbox -->
          <v-icon v-if="ytmIsOpen" color="green" dark>mdi-checkbox-marked-outline</v-icon>
          <v-icon v-else dark>mdi-checkbox-blank-outline</v-icon>
        </v-list-item-avatar>
        <!-- Description -->
        <v-list-item-content>
          <v-list-item-title>Open up youtube music</v-list-item-title>
          <v-list-item-subtitle>Open this extention on a youtube music tab</v-list-item-subtitle>
        </v-list-item-content>

        <!-- Tooltip/btn -->
        <v-list-item-action>
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-btn dark v-bind="attrs" v-on="on" icon>
                <v-icon @click="goToYoutubeMusic" color="grey lighten-1">mdi-open-in-new</v-icon>
              </v-btn>
            </template>
            <pre>Open Youtube Music in a new tab </pre>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
      <!-- Open playlist -->
      <v-list-item>
        <!-- Checkbox -->
        <v-list-item-avatar>
          <v-icon v-if="isPlaylistSelected" color="green" dark>mdi-checkbox-marked-outline</v-icon>
          <v-icon v-else dark>mdi-checkbox-blank-outline</v-icon>
        </v-list-item-avatar>
        <!-- Description -->
        <v-list-item-content>
          <v-list-item-title>Navigate to a playlist</v-list-item-title>
          <v-list-item-subtitle>Focus on the playlist by clicking anywhere on the page</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action> </v-list-item-action>
      </v-list-item>
      <!-- Load all tracks -->
      <v-list-item>
        <!-- Checkbox -->
        <v-list-item-avatar>
          <v-icon v-if="!hasContinuation" color="green" dark>mdi-checkbox-marked-outline</v-icon>
          <v-icon v-else dark>mdi-checkbox-blank-outline</v-icon>
        </v-list-item-avatar>
        <!-- Description -->
        <v-list-item-content>
          <v-list-item-title>Load all tracks, {{ loadedTrackCount }} • loaded</v-list-item-title>
          <v-list-item-subtitle
            >Scroll down to load all tracks, or use the 'Auto Load More..' feature</v-list-item-subtitle
          >
        </v-list-item-content>
        <!-- Tooltip -->
        <v-list-item-action>
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-icon class="mr-2" dark v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
            </template>
            <pre>Private videos and expired songs </pre>
            <pre>are counted by Youtube Music and </pre>
            <pre>shown in the playlist sub-title. </pre>
            <pre>However, these tracks are not </pre>
            <pre>in the actual playlist.</pre>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>

      <!-- Scrape Tracks -->
      <v-list-item>
        <!-- Checkbox -->
        <v-list-item-avatar>
          <v-icon v-if="tracksScrapedSuccessfully" color="green" dark>mdi-checkbox-marked-outline</v-icon>
          <v-icon v-else dark>mdi-checkbox-blank-outline</v-icon>
        </v-list-item-avatar>
        <!-- Description -->
        <v-list-item-content>
          <v-list-item-title>Scrape tracks</v-list-item-title>
          <v-list-item-subtitle>Click the 'Begin Scraping' button</v-list-item-subtitle>
        </v-list-item-content>

        <!-- Tooltip -->
        <v-list-item-action>
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-icon class="mr-2" dark v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
            </template>
            <pre>This will add the scraped tracks </pre>
            <pre>to the temporary playlist. </pre>
            <pre>Open the spotify tab to upload  </pre>
            <pre>these tracks to a new playlist.  </pre>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>

      <!-- Selected playlist -->
      <v-subheader style="height: 32px" class="ml-5">Detected Playlist</v-subheader>
      <v-divider style="margin-left: 35px; width: 125px"></v-divider>
      <v-list-item style="    margin-left: 20px; margin-top: 15px;">
        <v-img :src="selectedPlaylist.thumbnail" class="mr-4" max-width="64" min-width="64"></v-img>
        <v-list-item-content>
          <span class="text-uppercase font-weight-regular caption">{{ selectedPlaylist.name }}</span>
          <div>{{ selectedPlaylist.count }}</div>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!-- Buttons -->
    <v-container style="position: absolute; bottom: 15px;">
      <v-row style="height: 48px">
        <v-col cols="5" style="height: 48px">
          <v-btn :disabled="!(isPlaylistSelected && ytmIsOpen)" @click="scrapeTracks()" class="ml-6">
            Begin Scraping
            <v-icon style="margin-left: 5px" small>mdi-playlist-play</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="4" style="height: 48px">
          <v-checkbox
            :disabled="!(isPlaylistSelected && ytmIsOpen)"
            style="margin-top: 2px;"
            v-model="autoScroll"
            label="Auto Load More.."
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import StoreApi from '../api/storeApi';
import contentScript from '@/core/api/contentScriptApi.ts';

export default Vue.extend({
  name: 'YtmScraper',
  computed: {
    progressBarActive(): boolean {
      return StoreApi.getState().progressBarActive;
    },
    tracksScrapedSuccessfully(): boolean {
      if (StoreApi.getState().tracks.length == 0 || this.loadedTrackCount == 0) {
        return false;
      }
      return StoreApi.getState().tracks.length == this.loadedTrackCount;
    },
  },
  mounted() {
    this.isYoutubeMusicOpen();
    setInterval(() => {
      this.isPlaylistOpen();
      this.isYoutubeMusicOpen();
      if (this.isPlaylistSelected && this.ytmIsOpen) {
        this.getTrackCount();
        this.updateHasContinuation();
        this.getPlaylistName();
        this.getPlaylistTrackCount();
        this.getPlaylistThumbnail();
        if (this.autoScroll) {
          this.loadMore();
        }
      }
    }, 1000);
  },
  methods: {
    isPlaylistOpen() {
      chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        if (tabs[0] && tabs[0].url?.includes('https://music.youtube.com/playlist?list=')) {
          this.isPlaylistSelected = true;
        } else {
          this.isPlaylistSelected = false;
        }
      });
    },
    goToYoutubeMusic() {
      chrome.tabs.create({url: 'https://music.youtube.com/library/playlists'});
    },
    isYoutubeMusicOpen() {
      contentScript.request('report_back', (data: string) => {
        if (data.toLowerCase() == 'ok') {
          this.ytmIsOpen = true;
        } else {
          this.ytmIsOpen = false;
        }
      });
    },
    getPlaylistName() {
      contentScript.request('get_playlist_name', (result: string) => {
        this.selectedPlaylist.name = result;
      });
    },
    getPlaylistTrackCount() {
      contentScript.request('get_playlist_track_count', (result: string) => {
        this.selectedPlaylist.count = result;
      });
    },
    updateHasContinuation() {
      contentScript.request('has_continuation', (result: boolean) => {
        if (result) {
          this.hasContinuation = result;
        } else {
          this.hasContinuation = false;
        }
      });
    },
    getPlaylistThumbnail() {
      contentScript.request('get_playlist_thumbnail', (result: string) => {
        if (result) {
          this.selectedPlaylist.thumbnail = result;
        } else {
          this.selectedPlaylist.thumbnail = 'https://www.gstatic.com/youtube/media/ytm/images/pbg/liked-songs-@576.png';
        }
      });
    },
    getTrackCount(): void {
      contentScript.request('get_tracks', (data: Array<any>) => {
        this.loadedTrackCount = data.length;
      });
    },
    scrapeTracks(): void {
      contentScript.request('get_tracks', (data: Array<any>) => {
        this.$store.dispatch('setTracks', data);
      });
    },
    loadMore(): void {
      contentScript.request('load_more', () => {});
    },
  },
  data: () => ({
    autoScroll: false,
    hasContinuation: true,
    loadedTrackCount: 0,
    ytmIsOpen: false,
    isPlaylistSelected: false,
    selectedPlaylist: {
      name: '',
      count: '',
      thumbnail: '',
    },
  }),
});
</script>
<style></style>
