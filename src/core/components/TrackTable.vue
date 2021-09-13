<template>
  <v-card dark style="height: 100%">
    <v-card-title>
      Temporary Playlist

      <v-tooltip bottom>
        <template v-slot:activator="{on, attrs}">
          <v-btn v-bind="attrs" v-on="on" icon @click="trashPlaylist" style="margin-left: 10px"
            ><v-icon>mdi-trash-can-outline</v-icon></v-btn
          >
        </template>
        <pre>Trash your temporary playlist</pre>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{on, attrs}">
          <v-btn dark v-bind="attrs" v-on="on" icon>
            <v-icon @click="goToSpotifyPage" color="grey lighten-1">mdi-vector-link</v-icon>
          </v-btn>
        </template>

        <pre>Go to the spotify tab to begin linking your tracks  </pre>
      </v-tooltip>

      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        style="margin-top: 0px; padding-top: 0px; max-width: 185px"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :items-per-page="10"
      :footer-props="{
        itemsPerPageOptions: [10, 50, 100, -1],
      }"
      dark
      class="track-table"
      height="calc(100vh - 136px)"
      dense
      :headers="headers"
      :items="tracks"
      :search="search"
    >
      <template v-slot:item="{item}">
        <tr style="width: 552px">
          <!-- total width of 552px -->
          <td style="width: 52px">
            <v-icon xx-small>{{ item.ytmId !== '' && item.spotifyId !== '' ? 'mdi-check' : 'mdi-close' }}</v-icon>
          </td>
          <td style="">{{ item.title }}</td>
          <td style="">{{ item.artist }}</td>
          <td style="">{{ item.album }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import StoreApi from '../api/storeApi';

export default Vue.extend({
  name: 'TrackTable',
  computed: {
    tracks() {
      return StoreApi.getState().tracks;
    },
  },
  methods: {
    trashPlaylist(): void {
      StoreApi.clearYtmMergedPlaylistIds();
      StoreApi.setTracks([]);
    },
    goToSpotifyPage() {
      StoreApi.setItem('selectedPage', 3);
    },
  },
  data: () => ({
    search: '',
    headers: [
      {text: 'Linked', value: 'spotifyId'},
      {text: 'Track', value: 'title'},
      {text: 'Artist', value: 'artist'},
      {text: 'Album', value: 'album'},
    ],
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

.track-table th {
  white-space: nowrap;
}
</style>
