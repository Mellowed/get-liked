<template>
  <v-card dark style="height: 100%">
    <v-card-title>
      YTMusic Playlists
      <v-btn icon @click="refreshPlaylist" style="margin-left: 10px"><v-icon>mdi-refresh</v-icon></v-btn>
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
      style="height: calc(100% - 68px)"
      height="calc(100% - 40px)"
      :search="search"
      dark
      class="playlist-table"
      dense
      :headers="headers"
      :items="playlists"
    >
      <template v-slot:item="{item}">
        <tr>
          <!-- total width of 552px -->
          <td style="width: 60px"><v-img max-height="42" max-width="60" :src="item.thumbnail"></v-img></td>
          <td>{{ item.title }}</td>
          <td style="width: 80px">{{ item.count }}</td>
          <td style="width: 60px">
            <v-btn :disabled="isDisabled(item.id)" @click="addPlaylist(item.id)" icon dark style="margin-left: 10px"
              ><v-icon small>mdi-plus-thick</v-icon></v-btn
            >
          </td>
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
    progressBarActive(): boolean {
      return StoreApi.getState().progressBarActive;
    },
    playlists() {
      return StoreApi.getState().ytMusic.playlists;
    },
  },
  methods: {
    isDisabled(id: string) {
      if (this.progressBarActive) {
        return true;
      }

      return StoreApi.getState().ytMusic.mergedPlaylists.includes(id);
    },
    addPlaylist(id: string) {
      StoreApi.addYtmMergedPlaylistId(id);
      this.$emit('click:add', id);
    },
    refreshPlaylist() {
      this.$emit('click:refresh');
    },
  },
  data: () => ({
    addedIds: Array<String>(),
    search: '',
    headers: [
      {text: '', value: 'thumbnail', sortable: false},
      {text: 'Name', value: 'title'},
      {text: 'Count', value: 'count'},
      {text: '', value: '', sortable: false},
    ],
  }),
});
</script>
<style>
.playlist-table .v-data-footer {
  height: 32px !important;
}

.playlist-table .v-data-footer__select {
  height: 32px !important;
}

.playlist-table th {
  white-space: nowrap;
}
</style>
