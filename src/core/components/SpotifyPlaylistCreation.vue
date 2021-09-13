<template>
  <v-card dark flat style="height: 100%">
    <v-list subheader two-line>
      <v-card-title>
        <v-icon dark large style="margin-left: 2px; margin-right: 13px">mdi-spotify</v-icon> Spotify Playlist Creator
      </v-card-title>
      <v-divider style="margin-left: 10px; margin-right: 10px"></v-divider>
      <v-list-item>
        <v-list-item-avatar>
          <!-- Checkbox -->
          <v-icon v-if="hasTracks" color="green" dark>mdi-checkbox-marked-outline</v-icon>
          <v-icon v-else dark>mdi-checkbox-blank-outline</v-icon>
        </v-list-item-avatar>
        <!-- Description -->
        <v-list-item-content>
          <v-list-item-title>Add tracks to the temporary playlist</v-list-item-title>
          <v-list-item-subtitle>Use the google API or Scraper to collect tracks.</v-list-item-subtitle>
        </v-list-item-content>

        <!-- Tooltip/btn -->
        <v-list-item-action>
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-btn dark v-bind="attrs" v-on="on" icon>
                <v-icon @click="goToGooglePage" color="grey lighten-1">mdi-open-in-new</v-icon>
              </v-btn>
            </template>
            <pre>Jump to the google page </pre>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
      <!-- Link tracks -->
      <v-list-item>
        <!-- Checkbox -->
        <v-list-item-avatar>
          <v-icon v-if="hasLinkedTracks" color="green" dark>mdi-checkbox-marked-outline</v-icon>
          <v-icon v-else dark>mdi-checkbox-blank-outline</v-icon>
        </v-list-item-avatar>
        <!-- Description -->
        <v-list-item-content>
          <v-list-item-title>Link google tracks to spotify tracks</v-list-item-title>
          <v-list-item-subtitle>Initiate by clikcing the 'Link Tracks' button.</v-list-item-subtitle>
        </v-list-item-content>

        <!-- Tooltip -->
        <v-list-item-action>
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-icon class="mr-2" dark v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
            </template>
            <pre>Search on spotify for tracks matching the  </pre>
            <pre>title, artist & album. Use these when </pre>
            <pre>building the new playlist on spotify. </pre>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
      <!-- Create a new playlist -->
      <v-list-item>
        <!-- Checkbox -->
        <v-list-item-avatar>
          <v-icon v-if="playlistCreated && hasTracks && hasLinkedTracks" color="green" dark
            >mdi-checkbox-marked-outline</v-icon
          >
          <v-icon v-else dark>mdi-checkbox-blank-outline</v-icon>
        </v-list-item-avatar>
        <!-- Description -->
        <v-list-item-content>
          <v-list-item-title>Create a new playlist</v-list-item-title>
          <v-list-item-subtitle>Set the playlist name and hit 'Create Playlist'</v-list-item-subtitle>
        </v-list-item-content>
        <!-- Tooltip -->
        <v-list-item-action>
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-icon class="mr-2" dark v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
            </template>
            <pre>Create a new playlist in spotify. </pre>
            <pre>We use the linked tracks to build </pre>
            <pre>the playlist.</pre>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>

      <!-- Selected playlist -->
      <v-subheader style="height: 32px" class="ml-5">New Playlist</v-subheader>
      <v-divider style="margin-left: 35px; width: 125px"></v-divider>
      <v-list-item style="margin-left: 20px; margin-top: 15px">
        <v-img
          dark
          src="https://www.gstatic.com/youtube/media/ytm/images/pbg/liked-songs-@576.png"
          class="mr-4"
          max-width="64"
          min-width="64"
        ></v-img>
        <v-list-item-content>
          <span class="text-uppercase font-weight-regular caption">{{ playlistName }}</span>
          <div>{{ linkedTracks.length }} • songs</div>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!-- Buttons & inputs -->
    <v-container style="position: absolute; bottom: 15px">
      <v-row>
        <v-text-field style="max-width: 180px !important; margin-left: 32px; height: 42px" v-model="playlistName" dark>
          <v-icon slot="prepend" color="green"> mdi-content-save-move-outline </v-icon>
        </v-text-field>
      </v-row>

      <v-row style="height: 48px">
        <v-col cols="5" style="height: 48px">
          <v-btn
            color="primary"
            :disabled="!(hasTracks && hasLinkedTracks && !progressBar)"
            @click="createPlaylist(playlistName)"
            class="ml-6"
          >
            Create Playlist
          </v-btn>
        </v-col>
        <v-col cols="4" style="height: 48px">
          <v-btn :disabled="!hasTracks" @click="linkTracks()" class="ml-6"> Link tracks </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import StoreApi from '../api/storeApi';
import SpotifyApi from '@/core/api/spotifyApi';
import {Track} from '../models/track';

export default Vue.extend({
  name: 'Spotify',
  components: {},
  data: () => ({
    playlistName: 'My New Playlist',
    playlistCreated: false,
    mappedTracksCount: 0,
    selectedMethod: '',
    loggedIn: false,
    navigationIconColor: 'sideBarNavigatorIcon',
    onHoverGL: 'sideBarNavigatorIcon',
    onHoverJS: 'sideBarNavigatorIcon',
  }),
  computed: {
    hasTracks() {
      return StoreApi.getState().tracks.length > 0;
    },
    hasLinkedTracks(): boolean {
      let likedTracks = StoreApi.getState().tracks.filter((d) => d.spotifyId);
      return likedTracks.length > 0;
    },
    linkedTracks(): Array<Track> {
      return StoreApi.getState().tracks.filter((d) => d.spotifyId);
    },
    tracks(): Array<Track> {
      return StoreApi.getState().tracks;
    },
    progressBar(): boolean {
      return StoreApi.getState().progressBarActive;
    },
  },
  methods: {
    goToGooglePage() {
      StoreApi.setItem('selectedPage', 1);
    },
    createPlaylist(name: string, description: string) {
      SpotifyApi.getInstance()
        .createNewPlaylist(name, description)
        .then((d) => {
          this.refreshPlaylists();
          let uris = Array<string>();
          this.tracks.forEach((track) => {
            // Check that uris are defined
            if (track.spotifyId) uris.push(track.spotifyId);
          });

          // We split the uris array into chunks of 100 to limit the total number of tracks in
          // each requst to spotify as per the spotify docs.
          let chunks = Array<Array<string>>();
          while (uris.length) {
            chunks.push(uris.splice(0, 100));
          }

          // Parse each chunk to the "addTracksToPlaylist" method.
          // Seperate each request by 500ms to avoid API rate limiting.
          this.playlistCreated = false;
          StoreApi.progressBarActive(true);
          this.addTracksToPlaylist(d, chunks, 0).finally(() => {
            StoreApi.progressBarActive(false);
            this.playlistCreated = true;
          });
        });
    },
    addTracksToPlaylist(playlistId: string, chunks: Array<Array<string>>, index: number) {
      return new Promise((resolve) => {
        let chunk = chunks[index];
        SpotifyApi.getInstance()
          .addTracksToPlaylist(playlistId, chunk)
          .then(() => {
            index++;

            if (index < chunks.length) {
              // Buffer the item add requests
              setTimeout(() => {
                this.addTracksToPlaylist(playlistId, chunks, index)
                  .then(() => resolve(true))
                  .catch(() => {
                    resolve('Failed: to add items to playlist ');
                  });
              }, 2000);
            } else {
              resolve(true);
            }
          });
      });
    },
    linkTracks() {
      StoreApi.progressBarActive(true);
      this.updateTracksWithSpotifyId(this.tracks, 0).finally(() => {
        StoreApi.progressBarActive(false);
      });
    },
    /**
     * This is a recursive function, therefore it has an index parameter,
     */
    updateTracksWithSpotifyId(tracks: Array<Track>, index: number): Promise<any> {
      return new Promise((resolve, reject) => {
        let track = tracks[index];

        this.updateTrackWithSpotifyId(track, track.title, track.artist, track.album)
          .then(() => {
            index++;
            let track = tracks[index];
            if (index < tracks.length) {
              this.updateTracksWithSpotifyId(tracks, index)
                .then(() => resolve(true))
                .catch(() => {
                  resolve('Failed: Unable to match track: ' + track.title + ' ' + track.artist + ' ' + track.album);
                });
            } else {
              resolve(true);
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    /**
     *
     *  Search spotify for a track from youtube music.
     *  Use the title, artist and album names to find the match.
     *  Loosen query If a match is not initially found using all 3 parameters.
     *
     * @param track
     * @param title
     * @param artist?
     * @param album?
     *
     * @returns Promise<Track> | Promise<undefined>
     *
     */
    updateTrackWithSpotifyId(track: Track, title: string, artist?: string, album?: string): Promise<Track | undefined> {
      //  -- Logic --
      // Full Query (y) -> Resolve result
      //            (n) -> Query with 2 Fields (-album).
      //                (y) -> Resolve result
      //                (n) -> Query for title only
      //                       (y) -> Resolve result
      //                       (n) -> Reject & end
      //                (?) -> (One field was undefined?)
      //                       - Query for title only
      //                       (y) -> Resolve result
      //                       (n) -> Reject & end
      //            (err) -> check if rate limit
      //                  (y) -> Rerun query after 10s
      //                  (n) -> reject with err
      // {Prerequesits}
      // There must always be a title.

      return new Promise((resolve, reject) => {
        // Request track from spotify
        SpotifyApi.getInstance()
          .searchForTrackWithFilters(title, artist, album)
          .then((results: any) => {
            // Success?
            if (results.tracks.items.length > 0) {
              track.spotifyId = results.tracks.items[0].uri;
              // Extend the comparison here for better results
              resolve(track);
            } else {
              // Queried for the title only: resolve with undefined
              if (title && !artist && !album) {
                resolve(undefined);
                // Queried for title & (artist or album): Query for title only
              } else if ((title && artist && !album) || (title && album && !artist)) {
                setTimeout(() => {
                  this.updateTrackWithSpotifyId(track, title)
                    .then((track) => {
                      resolve(track);
                    })
                    .catch(() => {
                      reject();
                    });
                }, 100);
                // Queried for title, artist & album: Query for title & artist only
              } else if (title && artist && album) {
                setTimeout(() => {
                  this.updateTrackWithSpotifyId(track, title, artist)
                    .then((track) => {
                      resolve(track);
                    })
                    .catch(() => {
                      reject();
                    });
                }, 100);
              }
            }
          })
          .catch((e) => {
            // 429 is a spotify rate limit timeout
            if (e.status == 429) {
              setTimeout(() => {
                this.updateTrackWithSpotifyId(track, title, artist, album)
                  .then((track) => {
                    resolve(track);
                  })
                  .catch(() => {
                    reject();
                  });
              }, 10000);
            }
            reject(e);
          });
      });
    },
    createPlaylistWithTracks(): void {},
    refreshPlaylists() {
      SpotifyApi.getInstance()
        .getPlaylists()
        .then((d) => {
          StoreApi.setSpotifyPlaylists(d);
        });
    },
  },
});
</script>
